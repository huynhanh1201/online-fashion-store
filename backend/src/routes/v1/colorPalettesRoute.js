import express from 'express'

import { colorPalettesValidation } from '~/validations/colorPalettesValidation'
import { colorPalettesController } from '~/controllers/colorPalettesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Danh mục sản phẩm mới
Router.route('/:colorPaletteId').post(
  colorPalettesValidation.colorPalette,
  colorPalettesController.createColorPalette
)

// Danh sách Danh mục sản phẩm
Router.route('/').get(colorPalettesController.getColorPaletteList)

// Lấy thông tin một Danh mục sản phẩm.
Router.route('/:colorPaletteId').get(
  colorPalettesValidation.verifyId,
  colorPalettesController.getColorPalette
)

// Cập nhật thông tin Danh mục sản phẩm
Router.route('/:colorPaletteId').patch(
  colorPalettesValidation.verifyId,
  colorPalettesValidation.colorPaletteUpadate,
  colorPalettesController.updateColorPalette
)

// Xoá Danh mục sản phẩm (Xóa mềm)
Router.route('/:colorPaletteId').delete(
  colorPalettesValidation.verifyId,
  colorPalettesController.deleteColorPalette
)

export const colorPalettesRoute = Router
