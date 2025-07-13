import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const paymentTransactionId = req.params.paymentTransactionId

  // Kiểm tra format ObjectId
  validObjectId(paymentTransactionId, next)

  next()
}

const paymentTransaction = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    status: Joi.string().valid('Pending', 'Completed', 'Failed').required(),

    paidAt: Joi.date().allow(null),

    note: Joi.string().trim().allow('', null)
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

export const paymentTransactionsValidation = {
  verifyId,
  paymentTransaction
}
