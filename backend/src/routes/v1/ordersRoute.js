import express from 'express'

import { ordersValidation } from '~/validations/ordersValidation'
import { ordersController } from '~/controllers/ordersController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { rbacMiddleware } from '~/middlewares/rbacMiddleware'

const Router = express.Router()

// Tạo Đơn hàng mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['order:create']),
  ordersValidation.order,
  ordersController.createOrder
)

// Danh sách Đơn hàng
Router.route('/').get(
  authMiddleware.isAuthorized,
  authMiddleware.isAuthorized,
  ordersController.getOrderList
)

// Lấy thông tin một Đơn hàng.
Router.route('/:orderId').get(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['order:read']),
  ordersValidation.verifyId,
  ordersController.getOrder
)

// Cập nhật thông tin Đơn hàng
Router.route('/:orderId').patch(
  authMiddleware.isAuthorized,
  ordersValidation.verifyId,
  ordersValidation.updateOrder,
  ordersController.updateOrder
)

// Xoá Đơn hàng (Xóa mềm)
Router.route('/:orderId').delete(
  authMiddleware.isAuthorized,
  ordersValidation.verifyId,
  ordersController.deleteOrder
)

export const ordersRoute = Router
