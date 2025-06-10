import express from 'express'

import { reviewsValidation } from '~/validations/reviewsValidation'
import { reviewsController } from '~/controllers/reviewsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(reviewsValidation.review, reviewsController.createReview)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(reviewsController.getReviewList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:reviewId').get(
  reviewsValidation.verifyId,
  reviewsController.getReview
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:reviewId').patch(
  reviewsValidation.verifyId,
  reviewsValidation.review,
  reviewsController.updateReview
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:reviewId').delete(
  reviewsValidation.verifyId,
  reviewsController.deleteReview
)

export const reviewsRoute = Router
