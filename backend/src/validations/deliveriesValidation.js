import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'

const deliveryGHN = async (req, res, next) => {
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

    to_district_id: Joi.number().required(),

    to_ward_code: Joi.string().required()
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

export const deliveriesValidation = {
  deliveryGHN
}
