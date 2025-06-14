import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import dayjs from 'dayjs'

import ApiError from '~/utils/ApiError'
import { OrderModel } from '~/models/OrderModel'
import { ShippingAddressModel } from '~/models/ShippingAddressModel'
import { CartModel } from '~/models/CartModel'
import { couponsService } from '~/services/couponsService'
import { OrderItemModel } from '~/models/OrderItemModel'
import { OrderStatusHistoryModel } from '~/models/OrderStatusHistoryModel'
import { PaymentTransactionModel } from '~/models/PaymentTransactionModel'
import { env } from '~/config/environment'
import { UserModel } from '~/models/UserModel'
import { CouponModel } from '~/models/CouponModel'
import { VariantModel } from '~/models/VariantModel'
import { InventoryModel } from '~/models/InventoryModel'
import apiError from '~/utils/ApiError'
import { deliveriesService } from '~/services/deliveriesService'
import generateSequentialCode from '~/utils/generateSequentialCode'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'

const createOrder = async (userId, reqBody, ipAddr) => {
  // eslint-disable-next-line no-useless-catch

  // 1. Bắt đầu phiên làm việc với Mongoose Transactions
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

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
    }).session(session)

    if (!address) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Địa chỉ giao hàng không tồn tại.'
      )
    }

    // Lấy thông tin sản phẩm và kiểm tra kho
    let variantIds = []

    let numberItemOrder = 0

    for (const item of cartItems) {
      const { variantId, quantity } = item

      const inventory = await InventoryModel.findOneAndUpdate(
        {
          variantId,
          quantity: { $gte: quantity }
        },
        {
          $inc: { quantity: -quantity }
        }
      )

      if (!inventory) {
        throw new apiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          `Số lượng tồn kho (${inventory?.quantity || 0}) không đủ so với yêu cầu (${quantity})`
        )
      }

      numberItemOrder += quantity

      // Lấy mảng variantId
      if (variantIds.includes(variantId)) continue
      variantIds.push(variantId)
    }

    const variants = await VariantModel.find({
      _id: { $in: variantIds }
    })
      .session(session)
      .lean()

    const variantMap = new Map(variants.map((p) => [p._id.toString(), p]))

    // Tính toán tổng tiền
    const variantItemsGHN = []
    let calculatedSubtotal = 0
    for (const item of cartItems) {
      const variant = variantMap.get(item.variantId.toString())
      if (!variant) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          `Sản phẩm với ID ${item.variantId} không tồn tại.`
        )
      }
      calculatedSubtotal += variant.exportPrice * item.quantity

      // Danh sach items GHN
      variantItemsGHN.push({
        name: variant.name,
        code: variant.sku,
        quantity: item.quantity,
        price: variant.exportPrice,
        length: 30,
        width: 20,
        height: 2,
        weight: 300
      })
    }

    // Xác thực mã giảm giá
    const validateCoupon = await couponsService.validateCoupon(userId, {
      couponCode,
      cartTotal: calculatedSubtotal
    })

    if (!validateCoupon.valid && couponCode) {
      throw new ApiError(StatusCodes.BAD_REQUEST, validateCoupon.message)
    }

    if (validateCoupon.valid && couponCode) {
      await CouponModel.updateOne(
        { code: couponCode },
        { $inc: { usedCount: 1 } }
      ).session(session)
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
    const date = dayjs().format('YYYYMMDD')
    const prefixSlipId = `DH-${date}-`

    const code = await generateSequentialCode(
      prefixSlipId,
      4,
      async (prefixSlipId) => {
        // Query mã lớn nhất đã có với prefixSlipId đó
        const regex = new RegExp(`^${prefixSlipId}(\\d{4})$`)
        const latest = await OrderModel.findOne({
          code: { $regex: regex }
        })
          .sort({ code: -1 }) // sort giảm dần, AV10 > AV09
          .lean()

        // Tính số thứ tự tiếp theo
        let nextNumber = 1
        if (latest) {
          const match = latest.code.match(regex)
          if (match && match[1]) {
            nextNumber = parseInt(match[1], 10) + 1 // ví dụ AV10 → match[1] = "10" → +1 = 11
          }
        }

        return nextNumber
      }
    )

    const newOrder = {
      userId,
      shippingAddressId,
      shippingAddress: address,
      total: cartTotal + reqBody?.shippingFee || 0,
      couponId,
      paymentMethod,
      couponCode,
      note,
      discountAmount,
      status: 'Pending',
      isPaid: false,
      paymentStatus: 'Pending',
      isDelivered: false,

      shippingFee: reqBody.shippingFee,
      code: code
    }

    const [order] = await OrderModel.create([newOrder], { session })

    // Tạo đơn hàng cho đơn vị vận chuyển (GHN)

    const length = 30
    const width = 20
    const height = 2 * numberItemOrder
    const weight = 300 * numberItemOrder

    const bodyReqCreateOrderGnh = {
      // Thông tin người nhận
      to_name: address.fullName,
      to_phone: address.phone,
      to_address: address.address,
      to_ward_name: address.ward,
      to_district_name: address.district,
      to_province_name: address.city,

      // Kích thước & cân nặng
      length,
      width,
      height,
      weight,

      // Dịch vụ giao hàng
      service_type_id: 2,
      payment_type_id: 1,
      cod_amount: reqBody.paymentMethod === 'COD' ? order.total : 0,
      required_note: 'KHONGCHOXEMHANG',

      // Quản lý đơn hàng
      client_order_code: order.code,

      items: variantItemsGHN
    }

    const orderGHNCreated = deliveriesService.createOrderDelivery(
      bodyReqCreateOrderGnh
    )

    // Tạo OrderItems
    const orderItems = cartItems.map((item) => {
      const variant = variantMap.get(item.variantId.toString())

      return {
        orderId: order._id,
        productId: variant.productId,
        color: variant.color,
        size: variant.size.name,
        name: variant.name,
        price: variant.exportPrice,
        quantity: item.quantity,
        subtotal: variant.exportPrice * item.quantity
      }
    })

    await OrderItemModel.insertMany(orderItems, { session })

    // Tạo giao dịch thanh toán
    const paymentTransactionInfo = {
      orderId: order._id,
      method: paymentMethod,
      transactionId: null,
      status: 'Pending',
      paidAt: null,
      note: note || null,
      orderCode: order.code
    }

    await PaymentTransactionModel.create([paymentTransactionInfo], { session })

    // Xóa sản phẩm trong giỏ hàng
    await CartModel.updateOne(
      { userId },
      {
        $pull: {
          cartItems: {
            variantId: { $in: variantIds }
          }
        }
      }
    ).session(session)

    // 3. Commit transaction
    await session.commitTransaction()

    //==============================
    // const dayjs = require('dayjs')
    const crypto = require('crypto')
    const querystring = require('qs')

    // Xử lý thanh toán VNPAY
    if (paymentMethod === 'vnpay') {
      const createDate = dayjs().format('YYYYMMDDHHmmss')
      const expireDate = dayjs().add(15, 'minute').format('YYYYMMDDHHmmss')
      const orderId = order._id.toString()
      const amount = order.total // tổng tiền chưa nhân 100
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
    await session.abortTransaction()
    throw err
  } finally {
    session.endSession()
  }
}

const getOrderList = async (queryString) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let {
      page = 1,
      limit = 10,
      userId,
      sort,
      filterTypeDate,
      startDate,
      endDate,
      status,
      paymentMethod,
      paymentStatus
    } = queryString

    // Kiểm tra dữ liệu đầu vào của limit và page
    validatePagination(page, limit)

    // Xử lý thông tin Filter
    const filter = {}

    if (userId) filter.userId = userId

    if (status) filter.status = status

    if (paymentMethod) filter.paymentMethod = paymentMethod

    if (paymentStatus) filter.paymentStatus = paymentStatus

    const dateRange = getDateRange(filterTypeDate, startDate, endDate)

    if (dateRange.startDate && dateRange.endDate) {
      filter['createdAt'] = {
        $gte: new Date(dateRange.startDate),
        $lte: new Date(dateRange.endDate)
      }
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 }
    }

    let sortField = {}

    if (sort) {
      sortField = sortMap[sort]
    }

    const [orders, total] = await Promise.all([
      OrderModel.find(filter)
        .sort(sortField)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId couponId')
        .lean(),

      OrderModel.countDocuments(filter)
    ])

    const result = {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }

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
        path: 'userId couponId',
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
      const user = await UserModel.findById(userId)

      if (!user)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Người dùng không tồn tại')

      // status đã đổi, tạo history
      await OrderStatusHistoryModel.create({
        orderId: orderId,
        status: newStatus,
        note: reqBody.note || null,
        updatedBy: { name: user.name, role: user.role },
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

export const ordersService = {
  createOrder,
  getOrderList,
  getOrder,
  updateOrder,
  deleteOrder
}
