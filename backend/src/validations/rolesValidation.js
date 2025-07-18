import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const roleId = req.params.roleId

  // Kiểm tra format ObjectId
  validObjectId(roleId, next)

  next()
}

const role = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    name: Joi.string()
      .trim()
      .pattern(/^[a-zA-Z0-9_]+$/)
      .max(50)
      .required(),

    label: Joi.string().trim().max(100).required(),

    permissions: Joi.array()
      .items(
        Joi.string().pattern(/^[a-zA-Z]+:[a-zA-Z_]+$/) // VD: 'user:create', 'product:delete'
      )
      .default([])
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

export const rolesValidation = {
  verifyId,
  role
}
