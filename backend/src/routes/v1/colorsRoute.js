import express from 'express'

import { colorsValidation } from '~/validations/colorsValidation'
import { colorsController } from '~/controllers/colorsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(colorsValidation.color, colorsController.createColor)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(colorsController.getColorList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:colorId').get(
  colorsValidation.verifyId,
  colorsController.getColor
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:colorId').patch(
  colorsValidation.verifyId,
  colorsValidation.color,
  colorsController.updateColor
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:colorId').delete(
  colorsValidation.verifyId,
  colorsController.deleteColor
)

export const colorsRoute = Router
