import express from 'express'

import { variantsValidation } from '~/validations/variantsValidation'
import { variantsController } from '~/controllers/variantsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
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
  authMiddleware.isAuthorized,
  variantsValidation.verifyId,
  variantsValidation.variantUpdate,
  variantsController.updateVariant
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:variantId').delete(
  authMiddleware.isAuthorized,
  variantsValidation.verifyId,
  variantsController.deleteVariant
)

// Cập nhật discountPrice cho tất cả biến thể của một sản phẩm
Router.route('/product/:productId/discount-price').patch(
  variantsValidation.verifyProductId,
  variantsController.updateProductVariantsDiscountPrice
)

// Khôi phục discountPrice về giá ban đầu cho tất cả biến thể của một sản phẩm
Router.route('/product/:productId/restore-discount-price').patch(
  variantsValidation.verifyProductId,
  variantsController.restoreProductVariantsOriginalDiscountPrice
)

export const variantsRoute = Router
