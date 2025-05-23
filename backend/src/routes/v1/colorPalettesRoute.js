import express from 'express'

import { colorPalettesValidation } from '~/validations/colorPalettesValidation'
import { colorPaletteController } from '~/controllers/colorPaletteController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  colorPalettesValidation.colorPalette,
  colorPaletteController.createColorPalette
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(colorPaletteController.getColorPaletteList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:colorPaletteId').get(
  colorPalettesValidation.verifyId,
  colorPaletteController.getColorPalette
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:colorPaletteId').patch(
  colorPalettesValidation.verifyId,
  colorPalettesValidation.colorPaletteUpadate,
  colorPaletteController.updateColorPalette
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:colorPaletteId').delete(
  colorPalettesValidation.verifyId,
  colorPaletteController.deleteColorPalette
)

export const colorPalettesRoute = Router
