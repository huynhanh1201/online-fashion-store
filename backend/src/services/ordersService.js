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

import { verifyChecksum } from '~/utils/vnpay'
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
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
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

    //==============================
    const dayjs = require('dayjs')
    const crypto = require('crypto')
    const querystring = require('qs')

    // Xử lý thanh toán VNPAY
    if (paymentMethod === 'vnpay') {
      const createDate = dayjs().format('YYYYMMDDHHmmss')
      const expireDate = dayjs().add(15, 'minute').format('YYYYMMDDHHmmss')
      const orderId = order._id.toString()
      const amount = total // tổng tiền chưa nhân 100
      const bankCode = reqBody.bankCode || ''
      const orderInfo = `Thanh toan don hang ${cartItems.length} san pham, tong: ${amount} VND, coupon: ${couponCode || 'Khong'}, ghi chu: ${note || 'Khong co'}`
      const orderType = 'other'
      const locale = reqBody.language || 'vn'

      const tmnCode = env.VNP_TMNCODE.trim()
      const secretKey = env.VNP_HASHSECRET.trim()
      const vnpUrl = env.VNP_URL.trim()
      const returnUrl = env.VNP_RETURN_URL.trim()

      let vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: orderType,
        vnp_Amount: amount * 100, // Bắt buộc nhân 100
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
        vnp_ExpireDate: expireDate
      }

      if (bankCode) {
        vnp_Params.vnp_BankCode = bankCode
      }

      // Loại bỏ tham số rỗng
      vnp_Params = Object.fromEntries(
        Object.entries(vnp_Params).filter(
          ([_, v]) => v !== null && v !== undefined && v !== ''
        )
      )

      // Hàm encode key, value rồi sort theo key
      // eslint-disable-next-line no-inner-declarations
      function sortObject(obj) {
        const sorted = {}
        const keys = Object.keys(obj)
          .map((k) => encodeURIComponent(k))
          .sort()
        for (const key of keys) {
          const originalKey = Object.keys(obj).find(
            (k) => encodeURIComponent(k) === key
          )
          const value = encodeURIComponent(obj[originalKey]).replace(
            /%20/g,
            '+'
          )
          sorted[key] = value
        }
        return sorted
      }

      // Sắp xếp và encode param theo chuẩn VNPAY
      const sortedParams = sortObject(vnp_Params)

      // Tạo chuỗi ký (signData) từ params đã encode, không encode thêm nữa
      const signData = querystring.stringify(sortedParams, { encode: false })

      // Tạo chữ ký HMAC SHA512 với secretKey
      const signature = crypto
        .createHmac('sha512', secretKey)
        .update(signData, 'utf-8')
        .digest('hex')

      // Thêm chữ ký vào params
      sortedParams['vnp_SecureHash'] = signature

      // Tạo URL thanh toán, sử dụng encode: false vì params đã được mã hóa
      const paymentUrl =
        vnpUrl + '?' + querystring.stringify(sortedParams, { encode: false })

      return paymentUrl
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
  try {
    const vnp_Params = { ...req.query }
    const isValid = verifyChecksum(vnp_Params)

    if (!isValid) {
      return { RspCode: '97', Message: 'Sai checksum' }
    }

    const orderId = vnp_Params['vnp_TxnRef']
    const rspCode = vnp_Params['vnp_ResponseCode']
    const transactionNo = vnp_Params['vnp_TransactionNo']
    const bankCode = vnp_Params['vnp_BankCode']

    const transaction = await PaymentTransactionModel.findOne({ orderId })
    if (!transaction) {
      return { RspCode: '01', Message: 'Không tìm thấy đơn hàng' }
    }

    const updateData = {
      transactionId: transactionNo,
      paidAt: new Date(),
      note: `Bank: ${bankCode}`
    }

    if (rspCode === '00') {
      updateData.status = 'Completed'
      await PaymentTransactionModel.updateOne({ orderId }, updateData)

      await OrderModel.updateOne(
        { _id: orderId },
        { paymentStatus: 'Completed' }
      )

      return { RspCode: '00', Message: 'Giao dịch thành công' }
    } else {
      updateData.status = 'Failed'
      await PaymentTransactionModel.updateOne({ orderId }, updateData)
      return { RspCode: '01', Message: 'Giao dịch thất bại' }
    }
  } catch (err) {
    return { RspCode: '99', Message: 'Lỗi hệ thống' }
  }
}

const vnpayReturn = async (req) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const vnp_Params = { ...req.query }
    const isValid = verifyChecksum(vnp_Params)

    if (isValid) {
      const rspCode = vnp_Params['vnp_ResponseCode']
      const txnRef = vnp_Params['vnp_TxnRef']

      if (rspCode === '00') {
        const amount = vnp_Params['vnp_Amount']
        const transactionNo = vnp_Params['vnp_TransactionNo']
        const payDate = vnp_Params['vnp_PayDate']
        const bankCode = vnp_Params['vnp_BankCode']

        const query = new URLSearchParams({
          txnRef,
          amount,
          rspCode,
          transactionNo,
          payDate,
          bankCode
        }).toString()

        // Kiểm tra thêm trạng thái đơn hàng nếu cần
        // const Order = require('../models/Order');
        // const order = await Order.findById(vnp_Params['vnp_TxnRef']);
        // if (order.status === 'success' && rspCode === '00') { ... }

        // Trả về URL thanh toán thành công
        return `${env.FE_BASE_URL}/payment-result?${query}`
      }

      const failQuery = new URLSearchParams({
        code: rspCode,
        txnRef: txnRef
      }).toString()

      // Trả về URL thanh toán thất bại
      return `${env.FE_BASE_URL}/payment-failed?${failQuery}`
    }

    // Trả về URL thanh toán thất bại
    return `${env.FE_BASE_URL}/payment-failed?code=97`
  } catch (err) {
    throw err
  }
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
