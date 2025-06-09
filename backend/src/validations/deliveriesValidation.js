import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'

const deliveryGHN = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    numberItemOrder: Joi.number().min(1).required(),
    service_type_id: Joi.number().valid(2).required(), // chỉ cho phép 2, nếu sau này có nhiều hơn thì thêm vào
    from_district_id: Joi.number().required(),
    from_ward_code: Joi.string().required(),
    to_district_id: Joi.number().required(),
    to_ward_code: Joi.string().required(),
    insurance_value: Joi.number().min(0).required(), // có thể là 0
    coupon: Joi.string().allow(null, '') // cho phép null hoặc chuỗi rỗng
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
