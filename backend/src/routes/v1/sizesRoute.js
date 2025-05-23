import express from 'express'

import { sizesValidation } from '~/validations/sizesValidation'
import { sizesController } from '~/controllers/sizesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(sizesValidation.size, sizesController.createSize)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(sizesController.getSizeList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:sizeId').get(sizesValidation.verifyId, sizesController.getSize)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:sizeId').patch(
  sizesValidation.verifyId,
  sizesValidation.size,
  sizesController.updateSize
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:sizeId').delete(
  sizesValidation.verifyId,
  sizesController.deleteSize
)

export const sizesRoute = Router
