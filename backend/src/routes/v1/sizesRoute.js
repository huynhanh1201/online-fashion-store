import express from 'express'

import { sizesValidation } from '~/validations/sizesValidation'
import { sizesController } from '~/controllers/sizesController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { usersController } from '~/controllers/usersController'
import { rbacMiddleware } from '~/middlewares/rbacMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['size:create']),
  sizesValidation.size,
  sizesController.createSize
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['size:use']),
  sizesController.getSizeList
)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:sizeId').get(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['size:read']),
  sizesValidation.verifyId,
  sizesController.getSize
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:sizeId').patch(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['size:update']),
  sizesValidation.verifyId,
  sizesValidation.size,
  sizesController.updateSize
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:sizeId').delete(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['size:delete']),
  sizesValidation.verifyId,
  sizesController.deleteSize
)

// Khôi phục đã xóa
Router.route('/restore/:sizeId').patch(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['size:update']),
  sizesController.restoreSize
)

export const sizesRoute = Router
