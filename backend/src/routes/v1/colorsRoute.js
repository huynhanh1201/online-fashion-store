import express from 'express'

import { colorsValidation } from '~/validations/colorsValidation'
import { colorsController } from '~/controllers/colorsController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { usersController } from '~/controllers/usersController'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  colorsValidation.color,
  colorsController.createColor
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(
  authMiddleware.isAuthorized,
  colorsController.getColorList
)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:colorId').get(
  authMiddleware.isAuthorized,
  colorsValidation.verifyId,
  colorsController.getColor
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:colorId').patch(
  authMiddleware.isAuthorized,
  colorsValidation.verifyId,
  colorsValidation.color,
  colorsController.updateColor
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:colorId').delete(
  authMiddleware.isAuthorized,
  colorsValidation.verifyId,
  colorsController.deleteColor
)

// Khôi phục đã xóa
Router.route('/restore/:colorId').patch(
  authMiddleware.isAuthorized,
  colorsController.restoreColor
)

export const colorsRoute = Router
