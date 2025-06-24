import express from 'express'

import { productsValidation } from '~/validations/productsValidation'
import { productsController } from '~/controllers/productsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  productsValidation.product,
  productsController.createProduct
)

// Danh sách Sản phẩm
Router.route('/').get(productsController.getProductList)

// Lấy các biến thể của một sản phẩm
Router.route('/:productId/variants').get(
  productsValidation.verifyId,
  productsController.getVariantOfProduct
)

// Lấy thông tin một Sản phẩm.
Router.route('/:productId').get(
  productsValidation.verifyId,
  productsController.getProduct
)

// Cập nhật thông tin Sản phẩm
Router.route('/:productId').patch(
  authMiddleware.isAuthorized,
  productsValidation.verifyId,
  productsValidation.product,
  productsController.updateProduct
)

// Xoá Sản phẩm (Xóa mềm)
Router.route('/:productId').delete(
  authMiddleware.isAuthorized,
  productsValidation.verifyId,
  productsController.deleteProduct
)

// Lấy danh sách sản phẩm theo Danh mục
Router.route('/category/:categoryId').get(
  productsController.getListProductOfCategory
)

export const productsRoute = Router
