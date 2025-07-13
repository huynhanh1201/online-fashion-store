import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const couponId = req.params.couponId

  // Kiểm tra format ObjectId
  validObjectId(couponId, next)

  next()
}

const coupon = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    code: Joi.string() // Mã giảm giá
      .alphanum() // chỉ gồm chữ và số
      .min(3) // tối thiểu 3 ký tự
      .max(20) // tối đa 20 ký tự
      .trim() // loại bỏ khoảng trắng đầu/cuối
      .uppercase() // chuyển về chữ hoa
      .required(), // bắt buộc

    type: Joi.string() // Loại giảm
      .valid('percent', 'fixed') // chỉ chấp nhận hai giá trị này
      .required(), // bắt buộc

    amount: Joi.number() // Giá trị giảm
      .min(0) // không âm
      .required(), // bắt buộc

    minOrderValue: Joi.number() // Đơn tối thiểu để áp dụng
      .min(0) // không âm
      .default(0), // mặc định 0 nếu không truyền

    usageLimit: Joi.number() // Số lần tối đa có thể dùng
      .integer() // phải là số nguyên
      .min(0) // không âm
      .default(0), // mặc định 0 nếu không truyền

    usedCount: Joi.number() // Đếm số lần đã dùng mã
      .integer()
      .min(0)
      .default(0), // mặc định 0

    validFrom: Joi.date() // Ngày bắt đầu hiệu lực
      .required(), // bắt buộc

    validUntil: Joi.date() // Ngày kết thúc hiệu lực
      .greater(Joi.ref('validFrom')) // phải sau validFrom
      .required(), // bắt buộc

    isActive: Joi.boolean() // Mã đang bật/tắt
      .default(true) // mặc định true
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

const validate = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    couponCode: Joi.string()
      .alphanum() // Chỉ cho phép chữ và số:contentReference[oaicite:0]{index.jsx=0}
      .uppercase() // Ép về chữ in hoa (nếu muốn tự động convert):contentReference[oaicite:1]{index.jsx=1}
      .max(20) // Độ dài tối đa 20 ký tự (ví dụ):contentReference[oaicite:3]{index.jsx=3}
      .required(),

    cartTotal: Joi.number()
      .integer() // Bắt buộc là số nguyên:contentReference[oaicite:4]{index.jsx=4}
      .min(0) // Giá trị tối thiểu là 0 (không âm):contentReference[oaicite:5]{index.jsx=5}
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

export const couponsValidation = {
  verifyId,
  coupon,
  validate
}
