import express from 'express'

import { orderItemsValidation } from '~/validations/orderItemsValidation'
import { orderItemsController } from '~/controllers/orderItemsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Danh sách Đơn hàng chi tiết
Router.route('/:orderId').get(
  authMiddleware.isAuthorized,
  orderItemsValidation.verifyId,
  orderItemsController.getOrderItemList
)

export const orderItemsRoute = Router
