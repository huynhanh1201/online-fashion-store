import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import passwordComplexity from 'joi-password-complexity'

import ApiError from '~/utils/ApiError'

const register = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    name: Joi.string() // Khai báo kiểu chuỗi
      .min(3) // Chuỗi tối thiểu 3 ký tự
      .max(50) // Chuỗi tối đa 50 ký tự
      .trim() // Loại bỏ khoảng trắng đầu/cuối trước khi validate
      .strict() // Không cho phép ký tự không hợp lệ
      .required(), // Bắt buộc phải có trường này

    email: Joi.string()
      .email({
        // Bắt buộc đúng định dạng email
        tlds: { allow: false }
      })
      .max(100) // Độ dài tối đa 100 ký tự
      .trim()
      .required(),

    password: passwordComplexity({
      // Dùng plugin để enforce độ mạnh mật khẩu
      min: 8, // Tối thiểu 8 ký tự
      max: 128, // Tối đa 128 ký tự
      lowerCase: 1, // Ít nhất 1 chữ thường
      upperCase: 1, // Ít nhất 1 chữ hoa
      numeric: 1, // Ít nhất 1 chữ số
      symbol: 1 // Ít nhất 1 ký tự đặc biệt
    }).required(), // Bắt buộc nhập mật khẩu

    confirmPassword: Joi.any()
      .valid(Joi.ref('password')) // Phải bằng password
      .required(), // Bắt buộc nhập lại

    role: Joi.string() // Khai báo kiểu chuỗi
      .min(1) // Chuỗi tối thiểu 3 ký tự
      .max(50) // Chuỗi tối đa 50 ký tự
      .trim() // Loại bỏ khoảng trắng đầu/cuối trước khi validate
      .strict() // Không cho phép ký tự không hợp lệ
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

const verify = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    email: Joi.string()
      .email({
        // Bắt buộc đúng định dạng email
        tlds: { allow: false }
      })
      .max(100) // Độ dài tối đa 100 ký tự
      .trim()
      .required(),

    token: Joi.string().required() // Bắt token
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

const login = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    email: Joi.string()
      .email({
        // Bắt buộc đúng định dạng email
        tlds: { allow: false }
      })
      .max(100) // Độ dài tối đa 100 ký tự
      .trim()
      .required(),

    password: passwordComplexity({
      // Dùng plugin để enforce độ mạnh mật khẩu
      min: 8, // Tối thiểu 8 ký tự
      max: 128, // Tối đa 128 ký tự
      lowerCase: 1, // Ít nhất 1 chữ thường
      upperCase: 1, // Ít nhất 1 chữ hoa
      numeric: 1, // Ít nhất 1 chữ số
      symbol: 1 // Ít nhất 1 ký tự đặc biệt
    }).required() // Bắt buộc nhập mật khẩu
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

export const authValidation = {
  register,
  verify,
  login
}
