import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const orderId = req.params.orderId

  // Kiểm tra format ObjectId
  validObjectId(orderId, next)

  next()
}

const order = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    cartItems: Joi.array()
      .items(
        Joi.object({
          variantId: Joi.string().length(24).hex().required(),
          quantity: Joi.number().integer().min(1).required()
        })
      )
      .min(1)
      .required(),
    couponId: Joi.string().hex().length(24).allow(null),

    couponCode: Joi.string()
      .alphanum() // Chỉ cho phép chữ và số:contentReference[oaicite:0]{index=0}
      .uppercase() // Ép về chữ in hoa (nếu muốn tự động convert):contentReference[oaicite:1]{index=1}
      .min(5) // Độ dài tối thiểu 5 ký tự (ví dụ):contentReference[oaicite:2]{index=2}
      .max(20), // Độ dài tối đa 20 ký tự (ví dụ):contentReference[oaicite:3]{index=3}
    discountAmount: Joi.number().min(0).default(0),

    shippingAddressId: Joi.string().hex().length(24).required(),

    total: Joi.number().min(0).required(),

    status: Joi.string()
      .valid('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')
      .default('Pending'),

    isPaid: Joi.boolean().default(false),

    paymentMethod: Joi.string()
      .valid('COD', 'vnpay', 'momo', 'paypal', 'credit_card')
      .allow(null),

    paymentStatus: Joi.string()
      .valid('Pending', 'Completed', 'Failed')
      .allow(null),

    isDelivered: Joi.boolean().default(false),

    note: Joi.string().trim().min(1).max(500).allow(null),

    shippingFee: Joi.number().min(0).default(0)
  })

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false // Không dừng lại khi gặp lỗi đầu tiên
    })

    next() // Nếu không có lỗi, tiếp tục xử lý request sang controller
  } catch (err) {
    const errorMessage = new Error(err).message
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    )
    next(customError) // Gọi middleware xử lý lỗi tập trung
  }
}

const updateOrder = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    status: Joi.string()
      .valid('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')
      .required()
  })

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false // Không dừng lại khi gặp lỗi đầu tiên
    })

    next() // Nếu không có lỗi, tiếp tục xử lý request sang controller
  } catch (err) {
    const errorMessage = new Error(err).message
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    )
    next(customError) // Gọi middleware xử lý lỗi tập trung
  }
}

export const ordersValidation = {
  verifyId,
  order,
  updateOrder
}
