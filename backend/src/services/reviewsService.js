import { ReviewModel } from '~/models/ReviewModel'

const createReview = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newReview = {
      productId: reqBody.productId,
      userId: reqBody.userId,
      rating: reqBody.rating,
      comment: reqBody.comment,

      isVerified: true
    }

    const reviews = await ReviewModel.create(newReview)

    return reviews
  } catch (err) {
    throw err
  }
}

const getReviewList = async (queryString) => {
  const { productId, userId } = queryString

  const filter = {
    destroy: false
  }

  if (productId) filter.productId = productId

  if (userId) filter.userId = userId

  const result = await ReviewModel.find(filter)
    .lean()
    .populate({ path: 'userId', select: '_id name avatarUrl' })

  return result
}

const updateReview = async (reviewId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedReview = await ReviewModel.findOneAndUpdate(
      { _id: reviewId },
      reqBody,
      { new: true }
    )

    return updatedReview
  } catch (err) {
    throw err
  }
}

const deleteReview = async (reviewId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const reviewDeleted = await ReviewModel.findOneAndUpdate(
      { _id: reviewId },
      { destroy: true },
      { new: true }
    )

    return reviewDeleted
  } catch (err) {
    throw err
  }
}

export const reviewsService = {
  createReview,
  getReviewList,
  updateReview,
  deleteReview
}
