import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const blogId = req.params.blogId

  // Kiểm tra format ObjectId
  validObjectId(blogId, next)

  next()
}

const blog = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    title: Joi.string().trim().required(),
    excerpt: Joi.string().trim().allow('').default(''),
    content: Joi.string().required(),

    coverImage: Joi.string().uri().allow(null, '').default(null),
    images: Joi.array().items(Joi.string().uri()).default([]),

    tags: Joi.array().items(Joi.string()).default([]),

    category: Joi.string().allow(null, '').trim().default(null),
    type: Joi.string().valid('blog', 'policy').default('blog'),
    brand: Joi.string().allow(null, '').trim().default(null),

    status: Joi.string()
      .valid('draft', 'published', 'archived', 'active')
      .default('draft'),

    meta: Joi.object({
      title: Joi.string().allow('').default(''),
      description: Joi.string().allow('').default(''),
      keywords: Joi.array().items(Joi.string()).default([])
    }).default({})
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

export const blogsValidation = {
  verifyId,
  blog
}
