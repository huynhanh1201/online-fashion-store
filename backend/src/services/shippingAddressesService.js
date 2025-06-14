import { ShippingAddressModel } from '~/models/ShippingAddressModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createShippingAddress = async (userId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newShippingAddress = {
      userId: userId,
      fullName: reqBody.fullName,
      phone: reqBody.phone,
      address: reqBody.address,
      ward: reqBody.ward,
      district: reqBody.district,
      city: reqBody.city,
      wardId: reqBody.wardId,
      districtId: reqBody.districtId,
      cityId: reqBody.cityId
    }

    const ShippingAddress =
      await ShippingAddressModel.create(newShippingAddress)

    return ShippingAddress
  } catch (err) {
    throw err
  }
}

const getShippingAddressList = async (userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await ShippingAddressModel.find({ userId }).lean()

    return result
  } catch (err) {
    throw err
  }
}

const getShippingAddress = async (userId, shippingAddressId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await ShippingAddressModel.findOne({
      userId,
      _id: shippingAddressId
    }).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateShippingAddress = async (userId, shippingAddressId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedShippingAddress = await ShippingAddressModel.findOneAndUpdate(
      { userId, _id: shippingAddressId },
      reqBody,
      {
        new: true,
        runValidators: true
      }
    )

    return updatedShippingAddress
  } catch (err) {
    throw err
  }
}

const deleteShippingAddress = async (userId, shippingAddressId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const shippingAddressUpdated = await ShippingAddressModel.deleteOne({
      userId,
      _id: shippingAddressId
    })

    return shippingAddressUpdated
  } catch (err) {
    throw err
  }
}

const validateShippingAddress = async (userId, shippingAddressId, session) => {
  const address = await ShippingAddressModel.findOne({
    _id: shippingAddressId,
    userId
  }).session(session)

  if (!address) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Địa chỉ giao hàng không tồn tại.'
    )
  }

  return address
}

export const shippingAddressesService = {
  createShippingAddress,
  getShippingAddressList,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  validateShippingAddress
}
