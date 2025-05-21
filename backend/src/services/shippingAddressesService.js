import { ShippingAddressModel } from '~/models/ShippingAddressModel'

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
      city: reqBody.city
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
    const shippingAddressUpdated = await ShippingAddressModel.findOneAndUpdate(
      {
        userId,
        _id: shippingAddressId
      },
      {
        destroy: true
      },
      {
        new: true,
        runValidators: true
      }
    )

    return shippingAddressUpdated
  } catch (err) {
    throw err
  }
}

export const shippingAddressesService = {
  createShippingAddress,
  getShippingAddressList,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress
}
