import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const shippingAddressId = req.params.shippingAddressId

  // Kiểm tra format ObjectId
  validObjectId(shippingAddressId, next)

  next()
}

const shippingAddress = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    fullName: Joi.string() // chuỗi ký tự
      .min(3)
      .max(100)
      .required(),

    phone: Joi.string() // chỉ chứa chữ số, độ dài 9–11
      .pattern(/^[0-9]{9,11}$/)
      .required(), // :contentReference[oaicite:1]{index.jsx=1}

    address: Joi.string() // chuỗi ký tự
      .min(5)
      .max(200)
      .required(),

    ward: Joi.string() // chuỗi ký tự
      .min(2)
      .max(100)
      .required(),

    district: Joi.string() // chuỗi ký tự
      .min(2)
      .max(100)
      .required(),

    city: Joi.string() // chuỗi ký tự
      .min(2)
      .max(100)
      .required(),

    wardId: Joi.string() // chuỗi ký tự
      .min(2)
      .max(100)
      .required(),

    districtId: Joi.string() // chuỗi ký tự
      .min(2)
      .max(100)
      .required(),

    cityId: Joi.string() // chuỗi ký tự
      .min(2)
      .max(100)
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

export const shippingAddressesValidation = {
  verifyId,
  shippingAddress
}
