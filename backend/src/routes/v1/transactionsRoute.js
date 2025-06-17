import express from 'express'

import { transactionsController } from '~/controllers/transactionsController'

const Router = express.Router()

// Thanh toán VNPAY
Router.route('/vnpay_ipn').get(transactionsController.vnpayIPN)

Router.route('/vnpay_return').get(transactionsController.vnpayReturn)

export const transactionsRoute = Router
