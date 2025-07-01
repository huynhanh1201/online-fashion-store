import express from 'express'

import { paymentTransactionsValidation } from '~/validations/paymentTransactionsValidation'
import { paymentTransactionsController } from '~/controllers/paymentTransactionsController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { rbacMiddleware } from '~/middlewares/rbacMiddleware'

const Router = express.Router()

// Danh sách Giao dịch thanh toán theo Order
Router.route('/').get(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['payment:use']),
  paymentTransactionsController.getPaymentTransactionList
)

// Lấy thông tin một Giao dịch thanh toán.
Router.route('/:paymentTransactionId').get(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['payment:read']),
  paymentTransactionsValidation.verifyId,
  paymentTransactionsController.getPaymentTransaction
)

// Cập nhật thông tin Giao dịch thanh toán
Router.route('/:paymentTransactionId').patch(
  authMiddleware.isAuthorized,
  paymentTransactionsValidation.verifyId,
  paymentTransactionsValidation.paymentTransaction,
  paymentTransactionsController.updatePaymentTransaction
)

// Xoá Giao dịch thanh toán (Xóa mềm)
Router.route('/:paymentTransactionId').delete(
  authMiddleware.isAuthorized,
  paymentTransactionsValidation.verifyId,
  paymentTransactionsController.deletePaymentTransaction
)

export const paymentTransactionsRoute = Router
