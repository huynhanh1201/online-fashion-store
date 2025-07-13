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

const orderItem = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    orderId: Joi.string() // ID đơn hàng (ObjectId)
      .length(24) // đúng 24 ký tự hex
      .hex()
      .required(), // bắt buộc

    productId: Joi.string() // ID sản phẩm (ObjectId)
      .length(24)
      .hex()
      .required(), // bắt buộc

    quantity: Joi.number() // Số lượng đặt
      .integer() // phải là số nguyên
      .min(1) // tối thiểu 1
      .required(), // bắt buộc

    priceAtOrder: Joi.number() // Giá tại thời điểm đặt
      .min(0) // không âm
      .required() // bắt buộc
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

export const orderItemsValidation = {
  verifyId,
  orderItem
}
