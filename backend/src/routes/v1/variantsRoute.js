import express from 'express'

import { variantsValidation } from '~/validations/variantsValidation'
import { variantsController } from '~/controllers/variantsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  variantsValidation.variant,
  variantsController.createVariant
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(variantsController.getVariantList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:variantId').get(
  variantsValidation.verifyId,
  variantsController.getVariant
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:variantId').patch(
  variantsValidation.verifyId,
  variantsValidation.variantUpdate,
  variantsController.updateVariant
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:variantId').delete(
  variantsValidation.verifyId,
  variantsController.deleteVariant
)

export const variantsRoute = Router
