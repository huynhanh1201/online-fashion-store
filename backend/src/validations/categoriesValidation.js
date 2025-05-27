import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const categoryId = req.params.categoryId

  // Kiểm tra format ObjectId
  validObjectId(categoryId, next)

  next()
}

const category = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    name: Joi.string() // name bắt buộc, chuỗi
      .min(1) // tối thiểu 3 ký tự
      .max(50) // tối đa 50 ký tự
      .trim() // loại bỏ khoảng trắng đầu/cuối
      .required(), // bắt buộc

    description: Joi.string() // description không bắt buộc
      .max(500) // bạn có thể giới hạn độ dài nếu muốn
      .trim()
      .allow('', null) // cho phép bỏ trống hoặc null
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

export const categoriesValidation = {
  verifyId,
  category
}
