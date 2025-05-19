import express from 'express'

import { authMiddleware } from '~/middlewares/authMiddleware'
import { cartsValidation } from '~/validations/cartsValidation'
import { cartsController } from '~/controllers/cartsController'

const Router = express.Router()

// Tạo Giỏ hàng mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  cartsValidation.cart,
  cartsController.createCart
)

// Danh sách Item giỏ hàng
Router.route('/').get(
  authMiddleware.isAuthorized,
  cartsController.getItemCartList
)

// Cập nhật thông tin Item giỏ hàng
Router.route('/items/:productId').patch(
  authMiddleware.isAuthorized,
  cartsValidation.verifyId,
  cartsValidation.cartItem,
  cartsController.updateItemCart
)

// Xoá Item giỏ hàng
Router.route('/items/:productId').delete(
  authMiddleware.isAuthorized,
  cartsValidation.verifyId,
  cartsController.deleteItemCart
)

// Xoa Cart
Router.route('/').delete(
  authMiddleware.isAuthorized,
  cartsController.deleteCart
)

export const cartsRoute = Router
