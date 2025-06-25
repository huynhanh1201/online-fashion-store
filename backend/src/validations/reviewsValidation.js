import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const reviewId = req.params.reviewId

  // Kiểm tra format ObjectId
  validObjectId(reviewId, next)

  next()
}

const review = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    productId: Joi.string().length(24).hex().required(),
    userId: Joi.string().length(24).hex().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().trim().required(),
    orderId: Joi.string().length(24).hex().required(),

    images: Joi.array().items(Joi.string()).default([]),
    videos: Joi.array().items(Joi.string()).default([])
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

const reviewUpdate = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().trim().required(),

    images: Joi.array().items(Joi.string()).default([]),
    videos: Joi.array().items(Joi.string()).default([])
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

export const reviewsValidation = {
  verifyId,
  review,
  reviewUpdate
}
