import { ReviewModel } from '~/models/ReviewModel'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'
import { ProductModel } from '~/models/ProductModel'
import mongoose from 'mongoose'

const createReview = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newReview = {
      productId: reqBody.productId,
      userId: reqBody.userId,
      rating: reqBody.rating,
      comment: reqBody.comment,

      isVerified: true,

      orderId: reqBody.orderId,

      images: reqBody.images,
      videos: reqBody.videos,

      moderationStatus: 'pending'
    }

    const reviews = await ReviewModel.create(newReview)

    await updateProductRating(reqBody.productId)

    return reviews
  } catch (err) {
    throw err
  }
}

const getReviewList = async (queryString) => {
  let {
    page = 1,
    limit = 10,
    sort,
    filterTypeDate,
    startDate,
    endDate,
    productId,
    moderationStatus,
    userId
  } = queryString

  validatePagination(page, limit)

  // Xử lý thông tin Filter
  const filter = {}

  if (productId) filter.productId = productId

  if (moderationStatus) filter.moderationStatus = moderationStatus

  const dateRange = getDateRange(filterTypeDate, startDate, endDate)

  if (dateRange.startDate && dateRange.endDate) {
    filter['createdAt'] = {
      $gte: new Date(dateRange.startDate),
      $lte: new Date(dateRange.endDate)
    }
  }

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 }
  }

  let sortField = {}

  if (sort) {
    sortField = sortMap[sort]
  }

  const [categories, total] = await Promise.all([
    ReviewModel.find(filter)
      .sort(sortField)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate([
        { path: 'userId', select: '_id name avatarUrl' },
        { path: 'productId', select: 'name' }
      ])
      .lean(),

    ReviewModel.countDocuments(filter)
  ])

  const result = {
    data: categories,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  return result
}

const updateReview = async (reviewId, reqBody, jwtDecoded) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const infoUpdate = {
      moderationStatus: reqBody.moderationStatus,
      moderatedAt: new Date(),
      moderatedBy: {
        _id: jwtDecoded._id,
        name: jwtDecoded.name,
        role: jwtDecoded.role,
        email: jwtDecoded.email
      }
    }

    const updatedReview = await ReviewModel.findOneAndUpdate(
      { _id: reviewId },
      infoUpdate,
      { new: true }
    )
      .populate([
        { path: 'userId', select: '_id name avatarUrl' },
        { path: 'productId', select: 'name' }
      ])
      .lean()

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

    await updateProductRating(reviewDeleted.productId)

    return reviewDeleted
  } catch (err) {
    throw err
  }
}

const updateProductRating = async (productId) => {
  const stats = await ReviewModel.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$productId',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ])

  const { avgRating = 0, totalReviews = 0 } = stats[0] || {}

  await ProductModel.findByIdAndUpdate(productId, {
    avgRating: Math.round(avgRating * 10) / 10, // làm tròn 1 chữ số
    totalReviews
  })
}

export const reviewsService = {
  createReview,
  getReviewList,
  updateReview,
  deleteReview
}
