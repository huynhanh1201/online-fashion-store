import { StatusCodes } from 'http-status-codes'

import { couponsService } from '~/services/couponsService'

const createCoupon = async (req, res, next) => {
  try {
    const result = await couponsService.createCoupon(req.body)

    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const validateCoupon = async (req, res, next) => {
  try {
    const result = await couponsService.validateCoupon(
      req.jwtDecoded._id,
      req.body
    )

    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getCouponList = async (req, res, next) => {
  try {
    const queryString = req.query

    const result = await couponsService.getCouponList(queryString)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getCoupon = async (req, res, next) => {
  try {
    const couponId = req.params.couponId

    const result = await couponsService.getCoupon(couponId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateCoupon = async (req, res, next) => {
  try {
    const couponId = req.params.couponId

    const result = await couponsService.updateCoupon(couponId, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteCoupon = async (req, res, next) => {
  try {
    const couponId = req.params.couponId

    const result = await couponsService.deleteCoupon(couponId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const couponsController = {
  createCoupon,
  validateCoupon,
  getCouponList,
  getCoupon,
  updateCoupon,
  deleteCoupon
}
