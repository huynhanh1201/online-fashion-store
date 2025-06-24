import express from 'express'

import { shippingAddressesValidation } from '~/validations/shippingAddressesValidation'
import { shippingAddressesController } from '~/controllers/shippingAddressesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Đơn hàng chi tiết mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  authMiddleware.isAuthorized,
  shippingAddressesValidation.shippingAddress,
  shippingAddressesController.createShippingAddress
)

// Danh sách Đơn hàng chi tiết
Router.route('/').get(
  authMiddleware.isAuthorized,
  authMiddleware.isAuthorized,
  shippingAddressesController.getShippingAddressList
)

// Lấy thông tin một Đơn hàng chi tiết.
Router.route('/:shippingAddressId').get(
  authMiddleware.isAuthorized,
  shippingAddressesValidation.verifyId,
  shippingAddressesController.getShippingAddress
)

// Cập nhật thông tin Đơn hàng chi tiết
Router.route('/:shippingAddressId').patch(
  authMiddleware.isAuthorized,
  shippingAddressesValidation.verifyId,
  shippingAddressesValidation.shippingAddress,
  shippingAddressesController.updateShippingAddress
)

// Xoá Đơn hàng chi tiết (Xóa mềm)
Router.route('/:shippingAddressId').delete(
  authMiddleware.isAuthorized,
  shippingAddressesValidation.verifyId,
  shippingAddressesController.deleteShippingAddress
)

export const shippingAddressesRoute = Router
