import express from 'express'

import { rolesValidation } from '~/validations/rolesValidation'
import { rolesController } from '~/controllers/rolesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  rolesValidation.role,
  rolesController.createRole
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(authMiddleware.isAuthorized, rolesController.getRoleList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:roleId').get(
  authMiddleware.isAuthorized,
  rolesValidation.verifyId,
  rolesController.getRole
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:roleId').patch(
  authMiddleware.isAuthorized,
  rolesValidation.verifyId,
  rolesValidation.role,
  rolesController.updateRole
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:roleId').delete(
  authMiddleware.isAuthorized,
  rolesValidation.verifyId,
  rolesController.deleteRole
)

// Khôi phục đã xóa
Router.route('/restore/:roleId').patch(
  authMiddleware.isAuthorized,
  rolesController.restoreRole
)

export const rolesRoute = Router
