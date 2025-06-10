import { ReviewModel } from '~/models/ReviewModel'

const createReview = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newReview = {
      name: reqBody.name,
      destroy: false
    }

    const reviews = await ReviewModel.create(newReview)

    return reviews
  } catch (err) {
    throw err
  }
}

const getReviewList = async () => {
  const result = await ReviewModel.find({}).lean()

  return result
}

const getReview = async (reviewId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await ReviewModel.findById(reviewId).lean()

    return result
  } catch (err) {
    throw err
  }
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
  getReview,
  updateReview,
  deleteReview
}
