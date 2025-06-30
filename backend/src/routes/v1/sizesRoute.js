import express from 'express'

import { sizesValidation } from '~/validations/sizesValidation'
import { sizesController } from '~/controllers/sizesController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { usersController } from '~/controllers/usersController'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  sizesValidation.size,
  sizesController.createSize
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(authMiddleware.isAuthorized, sizesController.getSizeList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:sizeId').get(
  authMiddleware.isAuthorized,
  sizesValidation.verifyId,
  sizesController.getSize
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:sizeId').patch(
  authMiddleware.isAuthorized,
  sizesValidation.verifyId,
  sizesValidation.size,
  sizesController.updateSize
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:sizeId').delete(
  authMiddleware.isAuthorized,
  sizesValidation.verifyId,
  sizesController.deleteSize
)

// Khôi phục đã xóa
Router.route('/restore/:sizeId').patch(
  authMiddleware.isAuthorized,
  sizesController.restoreSize
)

export const sizesRoute = Router
