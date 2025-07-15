import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const productId = req.params.productId

  // Kiểm tra format ObjectId
  validObjectId(productId, next)

  next()
}

const product = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    name: Joi.string() // name bắt buộc, chuỗi
      .min(1) // tối thiểu 3 ký tự
      .max(100) // tối đa 100 ký tự
      .trim() // loại bỏ khoảng trắng đầu/cuối
      .required(), // bắt buộc :contentReference[oaicite:0]{index.jsx=0}

    description: Joi.string() // description không bắt buộc
      .trim()
      .allow('', null), // cho phép bỏ trống hoặc null :contentReference[oaicite:1]{index.jsx=1}

    image: Joi.array() // image là mảng
      .items(
        Joi.string()
          .uri() // mỗi phần tử phải là URI hợp lệ :contentReference[oaicite:3]{index.jsx=3}
          .trim()
      )
      .min(1) // ít nhất 1 ảnh
      .required(), // bắt buộc

    categoryId: Joi.string().length(24).hex().required(),

    importPrice: Joi.number() // price bắt buộc, số
      .min(0) // không âm :contentReference[oaicite:2]{index.jsx=2}
      .required(),

    exportPrice: Joi.number() // price bắt buộc, số
      .min(0) // không âm :contentReference[oaicite:2]{index.jsx=2}
      .required(),

    packageSize: Joi.object({
      length: Joi.number().positive().required(),

      width: Joi.number().positive().required(),

      height: Joi.number().positive().required(),

      weight: Joi.number().positive().required()
    }),

    status: Joi.string().valid('draft', 'active', 'inactive').default('draft')
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

export const productsValidation = {
  verifyId,
  product
}
