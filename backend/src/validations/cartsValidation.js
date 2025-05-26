import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const cartId = req.params.productId

  // Kiểm tra format ObjectId
  validObjectId(cartId, next)

  next()
}

const cart = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    // productId là ObjectId của sản phẩm - bắt buộc
    productId: Joi.string().hex().length(24).required(),

    color: Joi.string().min(1).max(50).required(),

    size: Joi.string().min(1).max(10).required(),

    // quantity là số lượng sản phẩm - bắt buộc, tối thiểu 1
    quantity: Joi.number().integer().min(1).required()
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

const cartItem = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    // quantity là số lượng sản phẩm - bắt buộc, tối thiểu 1
    quantity: Joi.number().integer().min(1).required(),

    color: Joi.string().min(1).max(50).required(),

    size: Joi.string().min(1).max(10).required(),

    selected: Joi.boolean()
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

export const cartsValidation = {
  verifyId,
  cart,
  cartItem
}
