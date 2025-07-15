import { CouponModel } from '~/models/CouponModel'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createCoupon = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newCoupon = {
      code: reqBody.code,
      type: reqBody.type,
      amount: reqBody.amount,
      minOrderValue: reqBody.minOrderValue,
      usageLimit: reqBody.usageLimit,
      usedCount: reqBody.usedCount,
      validFrom: reqBody.validFrom,
      validUntil: reqBody.validUntil,
      isActive: reqBody.isActive
    }

    const Coupon = await CouponModel.create(newCoupon)

    return Coupon
  } catch (err) {
    throw err
  }
}

const getCouponList = async (queryString) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let {
      page = 1,
      limit = 10,
      search,
      status,
      sort,
      filterTypeDate,
      startDate,
      endDate,
      type,
      destroy
    } = queryString

    // Kiểm tra dữ liệu đầu vào của limit và page
    validatePagination(page, limit)

    // Xử lý thông tin Filter
    const filter = {}

    if (destroy === 'true' || destroy === 'false') {
      destroy = JSON.parse(destroy)

      filter.destroy = destroy
    }

    if (type) filter.type = type.toLowerCase()

    if (status === 'true' || status === 'false') {
      status = JSON.parse(status)

      filter.isActive = status
    }

    if (search) {
      filter.code = { $regex: search, $options: 'i' }
    }

    const dateRange = getDateRange(filterTypeDate, startDate, endDate)

    if (dateRange.startDate && dateRange.endDate) {
      filter['createdAt'] = {
        $gte: new Date(dateRange.startDate),
        $lte: new Date(dateRange.endDate)
      }
    }

    const sortMap = {
      name_asc: { code: 1 },
      name_desc: { code: -1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 }
    }

    let sortField = {}

    if (sort) {
      sortField = sortMap[sort]
    }

    const [coupons, total] = await Promise.all([
      CouponModel.find(filter)
        .collation({ locale: 'vi', strength: 1 })
        .sort(sortField)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      CouponModel.countDocuments(filter)
    ])

    const result = {
      data: coupons,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }

    return result
  } catch (err) {
    throw err
  }
}

const getCoupon = async (couponId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await CouponModel.findById(couponId).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateCoupon = async (couponId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedCoupon = await CouponModel.findOneAndUpdate(
      { _id: couponId },
      reqBody,
      {
        new: true,
        runValidators: true
      }
    )

    return updatedCoupon
  } catch (err) {
    throw err
  }
}

const deleteCoupon = async (couponId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const couponDeleted = await CouponModel.updateOne(
      { _id: couponId },
      {
        destroy: true
      },
      {
        new: true,
        runValidators: true
      }
    )

    if (!couponDeleted) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Mã giảm giá không tồn tại.')
    }

    return couponDeleted
  } catch (err) {
    throw err
  }
}

const restoreCoupons = async (couponId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    console.log()
    const couponDeleted = await CouponModel.updateOne(
      { _id: couponId },
      {
        destroy: false
      },
      {
        new: true,
        runValidators: true
      }
    )

    if (!couponDeleted) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Mã giảm giá không tồn tại.')
    }

    return couponDeleted
  } catch (err) {
    throw err
  }
}

const validateCoupon = async (userId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const now = new Date()

    const coupon = await CouponModel.findOne({
      code: reqBody.couponCode,
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
      $expr: { $lte: ['$usedCount', '$usageLimit'] }
    })

    if (coupon && reqBody.cartTotal >= coupon.minOrderValue) {
      let discountAmount
      if (coupon.type === 'fixed') {
        discountAmount = coupon.amount
      } else if (coupon.type === 'percent') {
        discountAmount = reqBody.cartTotal * (coupon.amount / 100)
      }

      const newTotal = reqBody.cartTotal - discountAmount
      const message = `Áp dụng thành công mã ${coupon.code}`

      return {
        couponId: coupon._id,
        valid: true, // Mã hợp lệ
        discountAmount,
        newTotal,
        message
      }
    } else {
      return {
        valid: false, // Mã sai hoặc hết hạn
        message: 'Mã không hợp lệ hoặc đã hết hạn'
      }
    }
  } catch (err) {
    throw err
  }
}

export const couponsService = {
  createCoupon,
  validateCoupon,
  getCouponList,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  restoreCoupons
}
