import express from 'express'

import { couponsValidation } from '~/validations/couponsValidation'
import { couponsController } from '~/controllers/couponsController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { usersController } from '~/controllers/usersController'
import { rbacMiddleware } from '~/middlewares/rbacMiddleware'

const Router = express.Router()

// Tạo Mã giảm giá mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['coupon:read']),
  couponsValidation.coupon,
  couponsController.createCoupon
)

// Kiểm tra Mã giảm giá trước khi thanh toán
Router.route('/validate').post(
  authMiddleware.isAuthorized,
  couponsValidation.validate,
  couponsController.validateCoupon
)

// Danh sách Mã giảm giá
Router.route('/').get(couponsController.getCouponList)

// Lấy thông tin một Mã giảm giá.
Router.route('/:couponId').get(
  couponsValidation.verifyId,
  couponsController.getCoupon
)

// Cập nhật thông tin Mã giảm giá
Router.route('/:couponId').patch(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['coupon:update']),
  couponsValidation.verifyId,
  couponsValidation.coupon,
  couponsController.updateCoupon
)

// Xoá Mã giảm giá (Xóa mềm)
Router.route('/:couponId').delete(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['coupon:delete']),
  couponsValidation.verifyId,
  couponsController.deleteCoupon
)

// Khôi phục đã xóa
Router.route('/restore/:couponId').patch(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['coupon:update']),
  couponsController.restoreCoupons
)

export const couponsRoute = Router
