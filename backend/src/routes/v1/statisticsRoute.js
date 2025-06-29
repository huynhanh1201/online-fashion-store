import express from 'express'

import { statisticsController } from '~/controllers/statisticsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Thống kê kho.
Router.route('/inventory').get(
  authMiddleware.isAuthorized,
  statisticsController.getInventoryStatistics
)

// Thống kê sản phẩm.
Router.route('/product').get(
  authMiddleware.isAuthorized,
  statisticsController.getProductStatistics
)

// Thống kê đơn hàng.
Router.route('/order').get(
  authMiddleware.isAuthorized,
  statisticsController.getOrderStatistics
)

// Thống kê tài chính.
Router.route('/finance').get(
  authMiddleware.isAuthorized,
  statisticsController.getFinanceStatistics
)

// Thống kê tài khoản.
Router.route('/user').get(
  authMiddleware.isAuthorized,
  statisticsController.getUserStatistics
)

export const statisticsRoute = Router
