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
      .allow('', null), // cho phép bỏ trống hoặc null

    image: Joi.string() // name bắt buộc, chuỗi
      .max(150) // tối đa 50 ký tự
      .trim() // loại bỏ khoảng trắng đầu/cuối
      .allow('', null),

    parent: Joi.string().length(24).hex().allow('', null), // parent là ObjectId, có thể null hoặc rỗng

    destroy: Joi.boolean(), // cho phép cập nhật trạng thái destroy

    banner: Joi.string() // name bắt buộc, chuỗi
      .max(150) // tối đa 50 ký tự
      .trim() // loại bỏ khoảng trắng đầu/cuối
      .allow('', null)
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

const categoryUpdate = async (req, res, next) => {
  // Validation cho việc cập nhật category (không yêu cầu name)
  const correctCondition = Joi.object({
    name: Joi.string().min(1).max(50).trim().optional(), // Không bắt buộc khi update

    description: Joi.string().max(500).trim().allow('', null).optional(),

    image: Joi.string().max(150).trim().allow('', null).optional(),

    parent: Joi.string().length(24).hex().allow('', null).optional(),

    destroy: Joi.boolean().optional(),

    banner: Joi.string() // name bắt buộc, chuỗi
      .max(150) // tối đa 50 ký tự
      .trim() // loại bỏ khoảng trắng đầu/cuối
      .allow('', null)
  })

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    })

    next()
  } catch (err) {
    const errorMessage = new Error(err).message
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    )
    next(customError)
  }
}

export const categoriesValidation = {
  verifyId,
  category,
  categoryUpdate
}
