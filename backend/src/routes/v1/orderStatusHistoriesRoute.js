import express from 'express'

import { orderStatusHistoriesValidation } from '~/validations/orderStatusHistoriesValidation'
import { orderStatusHistoriesController } from '~/controllers/orderStatusHistoriesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Danh sách Đơn hàng
Router.route('/:orderId').get(
  authMiddleware.isAuthorized,
  orderStatusHistoriesValidation.verifyId,
  orderStatusHistoriesController.getOrderStatusHistoryList
)

export const orderStatusHistoriesRoute = Router
