import { InventoryModel } from '~/models/InventoryModel'
import apiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { WarehouseModel } from '~/models/WarehouseModel'
import { warehouseSlipsService } from '~/services/warehouseSlipsService'
import { VariantModel } from '~/models/VariantModel'
import { ShippingAddressModel } from '~/models/ShippingAddressModel'
import ApiError from '~/utils/ApiError'
import { couponsService } from '~/services/couponsService'
import { CouponModel } from '~/models/CouponModel'
import dayjs from 'dayjs'
import generateSequentialCode from '~/utils/generateSequentialCode'
import { OrderModel } from '~/models/OrderModel'
import { OrderItemModel } from '~/models/OrderItemModel'
import { PaymentTransactionModel } from '~/models/PaymentTransactionModel'
import { CartModel } from '~/models/CartModel'
import { env } from '~/config/environment'

const checkInventorySufficient = async (cartItems, session) => {
  const warehouses = await WarehouseModel.find({ destroy: false }).session(
    session
  )

  if (!warehouses || warehouses.length === 0) {
    throw new apiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Không có kho hàng nào được tìm thấy'
    )
  }

  const warehouseId = warehouses[0]._id.toString()

  for (const item of cartItems) {
    const { variantId, quantity } = item

    const inventory = await InventoryModel.findOne({
      warehouseId,
      variantId
    }).session(session)

    if (!inventory || inventory.quantity < quantity) {
      throw new apiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Biến thể ${variantId} không đủ tồn kho (yêu cầu: ${quantity}, còn lại: ${inventory?.quantity ?? 0})`
      )
    }
  }
}

const createWarehouseSlipFromOrder = async (
  jwtDecoded,
  cartItems,
  session,
  type = 'import'
) => {
  const warehouses = await WarehouseModel.find({ destroy: false }).session(
    session
  )

  if (!warehouses || warehouses.length === 0) {
    throw new apiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Không có kho hàng nào được tìm thấy'
    )
  }

  const warehouseId = warehouses[0]._id.toString()

  const customerId = jwtDecoded._id

  const reqBody = {
    type: type || 'export',
    date: new Date(),
    partnerId: customerId,
    warehouseId,
    note: 'Xuất kho tạo đơn hàng'
  }

  const variantItems = []

  for (const variant of cartItems) {
    const { variantId, quantity } = variant

    variantItems.push({
      variantId,
      quantity,
      unit: 'cái'
    })
  }

  reqBody.items = variantItems

  // Tạo phiếu xuất kho từ đơn hàng
  await warehouseSlipsService.exportStockWarehouseSlip(
    reqBody,
    jwtDecoded,
    session
  )
}

const getVariantIdsFromCartItems = (cartItems) => {
  const variantIds = cartItems.map((item) => item.variantId)

  if (!variantIds || variantIds.length === 0) {
    throw new apiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Không có biến thể nào trong giỏ hàng'
    )
  }

  return variantIds
}

const getVariantsFromCartItems = async (cartItems, variantIds, session) => {
  const result = await VariantModel.find({
    _id: { $in: variantIds }
  })
    .session(session)
    .lean()

  return result
}

const checkShippingAddress = async (userId, shippingAddressId, session) => {
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

  return address
}

const applyCouponToCart = async (
  userId,
  couponCode,
  calculatedSubtotal,
  session
) => {
  if (couponCode) {
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

    return validateCoupon
  }
}

const calculatedSubtotal = (cartItems, variantMap) => {
  const result = cartItems.reduce((acc, item) => {
    const variant = variantMap.get(item.variantId)

    if (variant) {
      return acc + item.quantity * variant.exportPrice
    }
    return acc
  }, 0)

  return result
}

const validateOrderTotal = (calculatedSubtotal, total) => {
  if (calculatedSubtotal !== total) {
    throw new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Tổng tiền không khớp với tổng đã tính toán'
    )
  }
}

const handleCreateOrder = async (
  userId,
  reqBody,
  address,
  discountAmount,
  cartTotal,
  session
) => {
  const { shippingAddressId, couponId, couponCode, paymentMethod, note } =
    reqBody

  // Tạo mã đơn hàng
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

  if (couponCode) cartTotal -= discountAmount || 0

  // Tao đơn hàng trong hệ thống
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
    status: paymentMethod === 'COD' ? 'Processing' : 'Failed',
    isPaid: false,
    paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Failed',
    isDelivered: false,

    shippingFee: reqBody.shippingFee,
    code: code
  }

  const [order] = await OrderModel.create([newOrder], { session })

  return order
}

const handleCreateOrderItems = async (
  cartItems,
  variantMap,
  order,
  session
) => {
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

  const result = await OrderItemModel.insertMany(orderItems, { session })

  return result
}

const handleCreateTransaction = async (
  reqBody,
  order,
  transactionInfo = {},
  session
) => {
  const { paymentMethod, note } = reqBody

  const paymentTransactionInfo = {
    orderId: order._id,
    method: paymentMethod,
    transactionId: null,
    status: 'Pending',
    paidAt: null,
    note: note || null,
    orderCode: order.code,

    ...transactionInfo
  }

  const result = await PaymentTransactionModel.create(
    [paymentTransactionInfo],
    { session }
  )

  return result
}

const handleDeleteCartItems = async (userId, variantIds, session) => {
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
}

const handlePaymentByVnpay = (reqBody, order, ipAddr) => {
  const { cartItems, couponCode, paymentMethod, note } = reqBody

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
        const value = encodeURIComponent(obj[originalKey]).replace(/%20/g, '+')
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
}

export const orderHelpers = {
  checkInventorySufficient,
  createWarehouseSlipFromOrder,
  getVariantIdsFromCartItems,
  getVariantsFromCartItems,
  checkShippingAddress,
  applyCouponToCart,
  calculatedSubtotal,
  validateOrderTotal,
  handleCreateOrder,
  handleCreateOrderItems,
  handleCreateTransaction,
  handleDeleteCartItems,
  handlePaymentByVnpay
}
