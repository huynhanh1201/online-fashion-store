import express from 'express'

import { sizePalettesValidation } from '~/validations/sizePalettesValidation'
import { sizePalettesController } from '~/controllers/sizePalettesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  sizePalettesValidation.sizePalette,
  sizePalettesController.createSizePalette
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(sizePalettesController.getSizePaletteList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:sizePaletteId').get(
  sizePalettesValidation.verifyId,
  sizePalettesController.getSizePalette
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:sizePaletteId').patch(
  sizePalettesValidation.verifyId,
  sizePalettesValidation.sizePaletteUpadate,
  sizePalettesController.updateSizePalette
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:sizePaletteId').delete(
  sizePalettesValidation.verifyId,
  sizePalettesController.deleteSizePalette
)

export const sizePalettesRoute = Router
