import express from 'express'

import { colorPalettesValidation } from '~/validations/colorPalettesValidation'
import { colorPalettesController } from '~/controllers/colorPalettesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  colorPalettesValidation.colorPalette,
  colorPalettesController.createColorPalette
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(
  authMiddleware.isAuthorized,
  colorPalettesController.getColorPaletteList
)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:colorPaletteId').get(
  authMiddleware.isAuthorized,
  colorPalettesValidation.verifyId,
  colorPalettesController.getColorPalette
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:colorPaletteId').patch(
  authMiddleware.isAuthorized,
  colorPalettesValidation.verifyId,
  colorPalettesValidation.colorPaletteUpadate,
  colorPalettesController.updateColorPalette
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:colorPaletteId').delete(
  authMiddleware.isAuthorized,
  colorPalettesValidation.verifyId,
  colorPalettesController.deleteColorPalette
)

export const colorPalettesRoute = Router
