import express from 'express'

import { statisticsValidation } from '~/validations/statisticsValidation'
import { statisticsController } from '~/controllers/statisticsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/inventory').get(statisticsController.getInventoryStatistics)

export const statisticsRoute = Router
