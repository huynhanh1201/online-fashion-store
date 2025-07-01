import express from 'express'

import { reviewsValidation } from '~/validations/reviewsValidation'
import { reviewsController } from '~/controllers/reviewsController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { usersController } from '~/controllers/usersController'
import { rbacMiddleware } from '~/middlewares/rbacMiddleware'

const Router = express.Router()

// Tạo Đánh giá mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['review:create']),
  reviewsValidation.review,
  reviewsController.createReview
)

// Danh sách Đánh giá
Router.route('/').get(reviewsController.getReviewList)

// Cập nhật thông tin Đánh giá
Router.route('/:reviewId').patch(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['review:update']),
  reviewsValidation.verifyId,
  reviewsValidation.reviewUpdate,
  reviewsController.updateReview
)

// Xoá Đánh giá (Xóa mềm)
Router.route('/:reviewId').delete(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['review:delete']),
  reviewsValidation.verifyId,
  reviewsController.deleteReview
)

// Khôi phục đã xóa
Router.route('/restore/:reviewId').patch(
  authMiddleware.isAuthorized,
  reviewsController.restoreReview
)

export const reviewsRoute = Router
