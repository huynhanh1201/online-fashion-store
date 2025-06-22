import express from 'express'

import { rolesValidation } from '~/validations/rolesValidation'
import { rolesController } from '~/controllers/rolesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(rolesValidation.role, rolesController.createRole)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(rolesController.getRoleList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:roleId').get(rolesValidation.verifyId, rolesController.getRole)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:roleId').patch(
  rolesValidation.verifyId,
  rolesValidation.role,
  rolesController.updateRole
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:roleId').delete(
  rolesValidation.verifyId,
  rolesController.deleteRole
)

export const rolesRoute = Router
