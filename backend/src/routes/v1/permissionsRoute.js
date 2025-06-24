import express from 'express'

import { permissionsValidation } from '~/validations/permissionsValidation'
import { permissionsController } from '~/controllers/permissionsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  permissionsValidation.permission,
  permissionsController.createPermission
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(
  authMiddleware.isAuthorized,
  permissionsController.getPermissionList
)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:permissionId').get(
  authMiddleware.isAuthorized,
  permissionsValidation.verifyId,
  permissionsController.getPermission
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:permissionId').patch(
  authMiddleware.isAuthorized,
  permissionsValidation.verifyId,
  permissionsValidation.permission,
  permissionsController.updatePermission
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:permissionId').delete(
  authMiddleware.isAuthorized,
  permissionsValidation.verifyId,
  permissionsController.deletePermission
)

export const permissionsRoute = Router
