import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const websiteConfigId = req.params.websiteConfigId

  // Kiểm tra format ObjectId
  validObjectId(websiteConfigId, next)

  next()
}

const websiteConfig = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    key: Joi.string().trim().min(1).required(), // identifier duy nhất như header, footer...

    title: Joi.string().trim().min(1).required(), // tiêu đề cấu hình

    description: Joi.string().trim().max(1000), // mô tả cấu hình

    content: Joi.any().required(), // JSON bất kỳ

    status: Joi.string().valid('draft', 'active', 'inactive').default('draft')
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

export const websiteConfigsValidation = {
  verifyId,
  websiteConfig
}
