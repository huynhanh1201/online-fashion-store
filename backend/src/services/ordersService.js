import { StatusCodes } from 'http-status-codes'

import ApiError from '~/utils/ApiError'
import { OrderModel } from '~/models/OrderModel'
import { ShippingAddressModel } from '~/models/ShippingAddressModel'
import { CartModel } from '~/models/CartModel'
import { couponsService } from '~/services/couponsService'
import { ProductModel } from '~/models/ProductModel'
import { OrderItemModel } from '~/models/OrderItemModel'
import { OrderStatusHistoryModel } from '~/models/OrderStatusHistoryModel'
import { PaymentTransactionModel } from '~/models/PaymentTransactionModel'

import { generatePaymentUrl, verifyChecksum } from '~/utils/vnpay'
import { env } from '~/config/environment'

const createOrder = async (userId, reqBody, ipAddr) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const {
      cartItems,
      shippingAddressId,
      total,
      couponId,
      couponCode,
      paymentMethod,
      note
    } = reqBody

    // Kiểm tra cartItems
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Giỏ hàng trống hoặc không hợp lệ.'
      )
    }

    // Kiểm tra địa chỉ giao hàng
    const address = await ShippingAddressModel.findOne({
      _id: shippingAddressId,
      userId
    })
    if (!address) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Địa chỉ giao hàng không tồn tại.'
      )
    }

    // Lấy thông tin sản phẩm
    const productIds = cartItems.map((item) => item.productId)
    const products = await ProductModel.find({
      _id: { $in: productIds }
    }).lean()
    const productMap = new Map(products.map((p) => [p._id.toString(), p]))

    // Tính toán tổng tiền
    let calculatedSubtotal = 0
    for (const item of cartItems) {
      const product = productMap.get(item.productId.toString())
      if (!product) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          `Sản phẩm với ID ${item.productId} không tồn tại.`
        )
      }
      calculatedSubtotal += product.price * item.quantity
    }

    // Xác thực mã giảm giá
    const validateCoupon = await couponsService.validateCoupon(userId, {
      couponCode,
      cartTotal: calculatedSubtotal
    })

    if (!validateCoupon.valid && couponCode) {
      throw new ApiError(StatusCodes.BAD_REQUEST, validateCoupon.message)
    }

    const cartTotal = validateCoupon.newTotal || calculatedSubtotal
    const discountAmount = validateCoupon.discountAmount || 0

    // Kiểm tra tổng tiền từ FE
    if (cartTotal !== total) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        'Tổng tiền không chính xác.'
      )
    }

    // Tạo đơn hàng
    const newOrder = {
      userId,
      shippingAddressId,
      total: cartTotal,
      couponId,
      paymentMethod,
      couponCode,
      note,
      discountAmount,
      status: 'Pending',
      isPaid: false,
      paymentStatus: 'Pending',
      isDelivered: false
    }

    const order = await OrderModel.create(newOrder)

    // Tạo OrderItems
    const orderItems = cartItems.map((item) => {
      const product = productMap.get(item.productId.toString())
      return {
        orderId: order._id,
        productId: product._id,
        quantity: item.quantity,
        priceAtOrder: product.price
      }
    })

    await OrderItemModel.insertMany(orderItems)

    // Tạo giao dịch thanh toán
    const paymentTransactionInfo = {
      orderId: order._id,
      method: paymentMethod,
      transactionId: null,
      status: 'Pending',
      paidAt: null,
      note: note || null
    }

    await PaymentTransactionModel.create(paymentTransactionInfo)

    // Xóa sản phẩm trong giỏ hàng
    await CartModel.updateOne(
      { userId },
      {
        $pull: {
          cartItems: {
            productId: { $in: productIds }
          }
        }
      }
    )

    // Xử lý thanh toán VNPAY
    if (paymentMethod === 'vnpay') {
      const dayjs = require('dayjs')
      const crypto = require('crypto')
      const querystring = require('qs')

      const createDate = dayjs().format('YYYYMMDDHHmmss')
      const orderId = order._id.toString() // ID đơn hàng MongoDB
      const amount = total // Tổng tiền đơn đã được validate

      const bankCode = reqBody.bankCode || '' // lấy nếu FE gửi
      const orderInfo = `Thanh toán đơn hàng ${cartItems.length} sản phẩm, tổng: ${amount} VND, coupon: ${couponCode || 'Không'}, ghi chú: ${note || 'Không có'}`
      const orderType = 'other' // Có thể lấy từ reqBody nếu FE có truyền
      const locale = reqBody.language || 'vn'

      // Lấy config VNPAY
      const tmnCode = env.VNP_TMNCODE
      const secretKey = env.VNP_HASHSECRET
      const vnpUrl = env.VNP_URL
      const returnUrl = env.VNP_RETURN_URL

      let vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: orderType,
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate
      }

      if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode
      }

      // Sắp xếp tham số
      vnp_Params = Object.keys(vnp_Params)
        .sort()
        .reduce((acc, key) => {
          acc[key] = vnp_Params[key]
          return acc
        }, {})

      // Tạo chuỗi signData
      const signData = querystring.stringify(vnp_Params, { encode: false })

      // Tạo chữ ký HMAC SHA512
      const hmac = crypto.createHmac('sha512', secretKey)
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

      vnp_Params['vnp_SecureHash'] = signed

      // Tạo url thanh toán đầy đủ
      const urlPayment =
        vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false })

      console.log('urlPayment', urlPayment)

      return urlPayment
    }

    return order
  } catch (err) {
    throw err
  }
}

const getOrderList = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await OrderModel.find({})
      .populate('userId shippingAddressId couponId')
      .lean()

    console.log('result: ', result)

    return result
  } catch (err) {
    throw err
  }
}

const getOrder = async (orderId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await OrderModel.findById(orderId)
      .populate({
        path: 'userId couponId shippingAddressId',
        select: '-password -role -destroy -isActive -verifyToken'
      })
      .lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateOrder = async (userId, orderId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const existingOrder = await OrderModel.findById(orderId)
      .select('status')
      .lean()

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { _id: orderId },
      reqBody,
      {
        new: true,
        runValidators: true
      }
    )

    const newStatus = reqBody.status

    if (newStatus && newStatus !== existingOrder.status) {
      // status đã đổi, tạo history
      await OrderStatusHistoryModel.create({
        orderId: orderId,
        status: newStatus,
        note: reqBody.note || null,
        updatedBy: userId,
        updatedAt: new Date()
      })
    }

    return updatedOrder
  } catch (err) {
    throw err
  }
}

const deleteOrder = async (orderId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const orderUpdated = await OrderModel.findOneAndUpdate(
      {
        _id: orderId
      },
      {
        $set: { status: 'Cancelled' }
      },
      {
        new: true
      }
    )

    return orderUpdated
  } catch (err) {
    throw err
  }
}

// Thanh toán VNPAY

const vnpayIPN = async (req) => {
  const vnp_Params = { ...req.query }
  const isValid = verifyChecksum(vnp_Params)
  if (isValid) {
    const orderId = vnp_Params['vnp_TxnRef']
    const rspCode = vnp_Params['vnp_ResponseCode']

    // Ở đây bạn nên cập nhật trạng thái đơn hàng trong DB dựa vào orderId & rspCode
    // Ví dụ:
    // if (rspCode === '00') thì update đơn hàng thành công
    // else thì update trạng thái thất bại, hoặc chờ xử lý

    return { RspCode: '00', Message: 'success' }
  }
  return { RspCode: '97', Message: 'Fail checksum' }
}

const vnpayReturn = async (req) => {
  const vnp_Params = { ...req.query }
  const isValid = verifyChecksum(vnp_Params)
  if (isValid) {
    // Ở đây bạn có thể lấy mã response để FE hiển thị thông báo thành công/thất bại
    // Nếu cần thiết có thể kiểm tra thêm trạng thái đơn hàng trong DB rồi trả về
    return vnp_Params['vnp_ResponseCode']
  }
  return '97'
}

export const ordersService = {
  createOrder,
  getOrderList,
  getOrder,
  updateOrder,
  deleteOrder,
  vnpayIPN,
  vnpayReturn
}
