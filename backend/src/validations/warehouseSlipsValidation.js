import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const warehouseSlipId = req.params.warehouseSlipId

  // Kiểm tra format ObjectId
  validObjectId(warehouseSlipId, next)

  next()
}

const warehouseSlip = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    productId: Joi.string().length(24).hex().required(),

    variant: Joi.object({
      color: Joi.object({
        name: Joi.string().trim().required(),
        image: Joi.string().uri().optional()
      }).required(),
      size: Joi.object({
        name: Joi.string().trim().required()
      }).required(),
      sku: Joi.string().trim().required()
    }).required(),

    quantity: Joi.number().integer().min(0).required(),

    importPrice: Joi.number().min(0).required(),

    exportPrice: Joi.number().min(0).required(),

    minQuantity: Joi.number().integer().min(0).default(0),

    status: Joi.string()
      .valid('in-stock', 'out-of-stock', 'discontinued')
      .default('in-stock')
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

const warehouseSlipUpdate = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    importPrice: Joi.number().min(0).required(),

    exportPrice: Joi.number().min(0).required(),

    minQuantity: Joi.number().integer().min(0).required(),

    status: Joi.string()
      .valid('in-stock', 'out-of-stock', 'discontinued')
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

const warehouseSlipInOutStock = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    quantity: Joi.number().integer().min(0).required()
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

export const warehouseSlipsValidation = {
  verifyId,
  warehouseSlip,
  warehouseSlipUpdate,
  warehouseSlipInOutStock
}
