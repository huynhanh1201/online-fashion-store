import { StatusCodes } from 'http-status-codes'

import { reviewsService } from '~/services/reviewsService'

const createReview = async (req, res, next) => {
  try {
    const result = await reviewsService.createReview(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getReviewList = async (req, res, next) => {
  try {
    const queryString = req.query

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await reviewsService.getReviewList(queryString)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateReview = async (req, res, next) => {
  try {
    const jwtDecoded = req.jwtDecoded
    const reviewId = req.params.reviewId

    const result = await reviewsService.updateReview(
      reviewId,
      req.body,
      jwtDecoded
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId

    const result = await reviewsService.deleteReview(reviewId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const reviewsController = {
  createReview,
  getReviewList,
  updateReview,
  deleteReview
}
