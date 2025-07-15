import express from 'express'

import { sizePalettesValidation } from '~/validations/sizePalettesValidation'
import { sizePalettesController } from '~/controllers/sizePalettesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  sizePalettesValidation.sizePalette,
  sizePalettesController.createSizePalette
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(
  authMiddleware.isAuthorized,
  sizePalettesController.getSizePaletteList
)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:sizePaletteId').get(
  authMiddleware.isAuthorized,
  sizePalettesValidation.verifyId,
  sizePalettesController.getSizePalette
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:sizePaletteId').patch(
  authMiddleware.isAuthorized,
  sizePalettesValidation.verifyId,
  sizePalettesValidation.sizePaletteUpadate,
  sizePalettesController.updateSizePalette
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:sizePaletteId').delete(
  authMiddleware.isAuthorized,
  sizePalettesValidation.verifyId,
  sizePalettesController.deleteSizePalette
)

export const sizePalettesRoute = Router
