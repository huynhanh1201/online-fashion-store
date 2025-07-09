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
    type: Joi.string().valid('import', 'export').required(),

    date: Joi.date().iso().required(),

    partnerId: Joi.string().length(24).hex().required(),

    warehouseId: Joi.string().length(24).hex().required(),

    items: Joi.array()
      .items(
        Joi.object({
          variantId: Joi.string().length(24).hex().required(),
          quantity: Joi.number().min(0).required(),
          unit: Joi.string().trim().required()
        })
      )
      .min(1)
      .required(),

    note: Joi.string().trim().allow('').default('')
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

export const warehouseSlipsValidation = {
  verifyId,
  warehouseSlip,
  warehouseSlipUpdate
}
