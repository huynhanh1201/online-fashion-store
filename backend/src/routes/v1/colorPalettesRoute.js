import express from 'express'

import { colorPalettesValidation } from '~/validations/colorPalettesValidation'
import { colorPalettesController } from '~/controllers/colorPalettesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  colorPalettesValidation.colorPalette,
  colorPalettesController.createColorPalette
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(colorPalettesController.getColorPaletteList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:colorPaletteId').get(
  colorPalettesValidation.verifyId,
  colorPalettesController.getColorPalette
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:colorPaletteId').patch(
  colorPalettesValidation.verifyId,
  colorPalettesValidation.colorPaletteUpadate,
  colorPalettesController.updateColorPalette
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:colorPaletteId').delete(
  colorPalettesValidation.verifyId,
  colorPalettesController.deleteColorPalette
)

export const colorPalettesRoute = Router
