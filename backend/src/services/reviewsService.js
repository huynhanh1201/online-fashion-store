import { ReviewModel } from '~/models/ReviewModel'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'

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
