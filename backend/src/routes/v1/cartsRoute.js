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
Router.route('/items').patch(
  authMiddleware.isAuthorized,
  cartsValidation.cart,
  cartsController.updateItemCart
)

// Xoá Item giỏ hàng
Router.route('/items').delete(
  authMiddleware.isAuthorized,
  cartsValidation.cartDeleteItem,
  cartsController.deleteItemCart
)

// Xoa Cart
Router.route('/').delete(
  authMiddleware.isAuthorized,
  cartsController.deleteCart
)

export const cartsRoute = Router
