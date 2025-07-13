import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const sizeId = req.params.sizeId

  // Kiểm tra format ObjectId
  validObjectId(sizeId, next)

  next()
}

const size = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    name: Joi.string()
      .trim() // Loại bỏ khoảng trắng đầu/cuối
      .min(1) // ít nhất 1 ký tự sau khi trim
      .max(50) // tối đa 50 ký tự (tuỳ bạn điều chỉnh)
      .required() // bắt buộc phải có
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

export const sizesValidation = {
  verifyId,
  size
}
