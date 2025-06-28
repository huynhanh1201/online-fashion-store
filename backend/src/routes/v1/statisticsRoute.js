import express from 'express'

import { statisticsController } from '~/controllers/statisticsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Thống kê kho.
Router.route('/inventory').get(
  authMiddleware.isAuthorized,
  statisticsController.getInventoryStatistics
)

// Thống sản phẩm.
Router.route('/product').get(
  authMiddleware.isAuthorized,
  statisticsController.getProductStatistics
)

export const statisticsRoute = Router
