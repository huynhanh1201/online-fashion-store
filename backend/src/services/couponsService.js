import { CouponModel } from '~/models/CouponModel'

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

const getCouponList = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await CouponModel.find({}).lean()

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
    const couponUpdated = await CouponModel.findOneAndDelete({ _id: couponId })

    return couponUpdated
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
  deleteCoupon
}
