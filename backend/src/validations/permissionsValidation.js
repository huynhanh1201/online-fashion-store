import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const permissionId = req.params.permissionId

  // Kiểm tra format ObjectId
  validObjectId(permissionId, next)

  next()
}

const permission = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    key: Joi.string()
      .trim()
      .pattern(/^[a-z]+:[a-z]+$/) // pattern gợi ý: "user:create"
      .required(),

    label: Joi.string().trim().required(),

    group: Joi.string().trim().required()
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

export const permissionsValidation = {
  verifyId,
  permission
}
