import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const inventoryId = req.params.inventoryId

  // Kiểm tra format ObjectId
  validObjectId(inventoryId, next)

  next()
}

const inventory = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    minQuantity: Joi.number().integer().min(0).required(),

    importPrice: Joi.number().min(0).required(),

    exportPrice: Joi.number().min(0).required(),

    status: Joi.string()
      .valid('in-stock', 'low-stock', 'out-of-stock')
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

export const inventoriesValidation = {
  verifyId,
  inventory
}
