import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const variantId = req.params.variantId

  // Kiểm tra format ObjectId
  validObjectId(variantId, next)

  next()
}

const variant = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    productId: Joi.string().length(24).hex().required(),

    color: Joi.object({
      name: Joi.string().trim().required(),
      image: Joi.string().uri().allow(null, '')
    }).required(),

    size: Joi.object({
      name: Joi.string().trim().required()
    }).required(),

    importPrice: Joi.number().min(0).default(0),

    exportPrice: Joi.number().min(0).default(0),

    overridePrice: Joi.boolean().default(false),

    overridePackageSize: Joi.boolean().default(false),

    packageSize: Joi.object({
      length: Joi.number().positive(),

      width: Joi.number().positive(),

      height: Joi.number().positive(),

      weight: Joi.number().positive()
    })
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

const variantUpdate = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    color: Joi.object({
      image: Joi.string().uri().allow(null, '')
    }),

    importPrice: Joi.number().min(0).default(0),

    exportPrice: Joi.number().min(0).default(0),

    overridePrice: Joi.boolean().default(false),

    overridePackageSize: Joi.boolean().default(false),

    packageSize: Joi.object({
      length: Joi.number().positive(),

      width: Joi.number().positive(),

      height: Joi.number().positive(),

      weight: Joi.number().positive()
    })
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

export const variantsValidation = {
  verifyId,
  variant,
  variantUpdate
}
