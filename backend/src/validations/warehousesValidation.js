import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import ApiError from '~/utils/ApiError'
import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const warehouseId = req.params.warehouseId

  // Kiểm tra format ObjectId
  validObjectId(warehouseId, next)

  next()
}

const warehouse = async (req, res, next) => {
  // Xác thực dữ liệu đầu vào correctCondition: điều kiện đúng
  const correctCondition = Joi.object({
    name: Joi.string() // Tên kho là chuỗi
      .trim() // Loại bỏ khoảng trắng đầu/cuối
      .required(), // Bắt buộc

    address: Joi.string() // Địa chỉ chi tiết (số nhà, đường)
      .trim() // Loại bỏ khoảng trắng đầu/cuối
      .required(), // Bắt buộc

    ward: Joi.string() // Phường thuộc quận/huyện
      .trim() // Loại bỏ khoảng trắng đầu/cuối
      .required(), // Bắt buộc

    district: Joi.string() // Quận hoặc huyện
      .trim() // Loại bỏ khoảng trắng đầu/cuối
      .required(), // Bắt buộc

    city: Joi.string() // Thành phố hoặc tỉnh
      .trim() // Loại bỏ khoảng trắng đầu/cuối
      .required() // Bắt buộc
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

export const warehousesValidation = {
  verifyId,
  warehouse
}
