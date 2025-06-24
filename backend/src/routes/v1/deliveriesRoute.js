import express from 'express'

import { deliveriesValidation } from '~/validations/deliveriesValidation'
import { deliveriesController } from '~/controllers/deliveriesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tính phí giao hàng
Router.route('/calculate-fee').post(
  authMiddleware.isAuthorized,
  deliveriesValidation.deliveryGHN,
  deliveriesController.getDeliveryFee
)

Router.route('/webhook/ghn').post(deliveriesController.getDeliveryFee)

export const deliveriesRoute = Router
