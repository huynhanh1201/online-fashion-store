import express from 'express'

import { reviewsValidation } from '~/validations/reviewsValidation'
import { reviewsController } from '~/controllers/reviewsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Đánh giá mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  reviewsValidation.review,
  reviewsController.createReview
)

// Danh sách Đánh giá
Router.route('/').get(reviewsController.getReviewList)

// Cập nhật thông tin Đánh giá
Router.route('/:reviewId').patch(
  authMiddleware.isAuthorized,
  reviewsValidation.verifyId,
  reviewsValidation.reviewUpdate,
  reviewsController.updateReview
)

// Xoá Đánh giá (Xóa mềm)
Router.route('/:reviewId').delete(
  authMiddleware.isAuthorized,
  reviewsValidation.verifyId,
  reviewsController.deleteReview
)

export const reviewsRoute = Router
