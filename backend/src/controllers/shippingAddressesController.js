import { StatusCodes } from 'http-status-codes'

import { shippingAddressesService } from '~/services/shippingAddressesService'

const createShippingAddress = async (req, res, next) => {
  try {
    const result = await shippingAddressesService.createShippingAddress(
      req.jwtDecoded._id,
      req.body
    )

    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getShippingAddressList = async (req, res, next) => {
  try {
    const result = await shippingAddressesService.getShippingAddressList(
      req.jwtDecoded._id
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getShippingAddress = async (req, res, next) => {
  try {
    const shippingAddressId = req.params.shippingAddressId

    const result = await shippingAddressesService.getShippingAddress(
      req.jwtDecoded._id,
      shippingAddressId
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateShippingAddress = async (req, res, next) => {
  try {
    const shippingAddressId = req.params.shippingAddressId

    const result = await shippingAddressesService.updateShippingAddress(
      req.jwtDecoded._id,
      shippingAddressId,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteShippingAddress = async (req, res, next) => {
  try {
    const shippingAddressId = req.params.shippingAddressId

    const result = await shippingAddressesService.deleteShippingAddress(
      req.jwtDecoded._id,
      shippingAddressId
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const shippingAddressesController = {
  createShippingAddress,
  getShippingAddressList,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress
}
