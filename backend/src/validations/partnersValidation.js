import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const partnerId = req.params.partnerId

  // Kiểm tra format ObjectId
  validObjectId(partnerId, next)

  next()
}

const partner = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    name: Joi.string().trim().required(),

    type: Joi.string().valid('supplier', 'customer', 'both').required(),

    contact: Joi.object({
      phone: Joi.string()
        .trim()
        .pattern(/^(?:\+84|0)(?:3[2-9]|5[2689]|7[06-9]|8[1-689]|9[0-9])\d{7}$/)
        .required(), // Bạn có thể dùng regex để kiểm tra định dạng SĐT VN nếu muốn
      email: Joi.string().trim().lowercase().email().required(),
      website: Joi.string().uri().trim().optional().allow(null, '')
    }).required(),

    taxCode: Joi.string().trim().optional().allow(null, ''),

    address: Joi.object({
      street: Joi.string().trim().optional().allow(null, ''),
      ward: Joi.string().trim().optional().allow(null, ''),
      district: Joi.string().trim().optional().allow(null, ''),
      city: Joi.string().trim().optional().allow(null, '')
    }).optional(),

    bankInfo: Joi.object({
      bankName: Joi.string().trim().optional().allow(null, ''),
      accountNumber: Joi.string().trim().optional().allow(null, ''),
      accountHolder: Joi.string().trim().optional().allow(null, '')
    }).optional(),

    note: Joi.string().optional().allow(null, '')
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

export const partnersValidation = {
  verifyId,
  partner
}
