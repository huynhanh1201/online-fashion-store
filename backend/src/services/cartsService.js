import { StatusCodes } from 'http-status-codes'

import { CartModel } from '~/models/CartModel'
import ApiError from '~/utils/ApiError'

const createCart = async (reqJwtDecoded, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { _id: userId } = reqJwtDecoded
    const { cartItems } = reqBody

    // Lấy document giỏ hàng (nếu có)
    const userCart = await CartModel.findOne({ userId })

    // Lấy mảng các productId đã có
    const existingIds = userCart
      ? userCart.cartItems.map((ci) => ci.productId.toString())
      : []

    const updateOps = []
    const insertOps = []

    for (const item of cartItems) {
      if (existingIds.includes(item.productId)) {
        // 1. update quantity
        updateOps.push({
          updateOne: {
            filter: { userId, 'cartItems.productId': item.productId },
            update: { $inc: { 'cartItems.$.quantity': item.quantity } }
          }
        })
      } else {
        // 2. push item mới
        insertOps.push({
          updateOne: {
            filter: { userId },
            update: {
              $push: { cartItems: item },
              $setOnInsert: { userId }
            },
            upsert: true
          }
        })
      }
    }

    await CartModel.bulkWrite([...updateOps, ...insertOps])

    // Lấy giỏ hàng sau cập nhật
    const result = await CartModel.findOne({ userId })
    return result
  } catch (err) {
    throw err
  }
}

const getItemCartList = async (userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await CartModel.findOne({ userId })
      .populate('cartItems.productId')
      .lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateItemCart = async (userId, productId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const itemCart = await CartModel.findOneAndUpdate(
      {
        userId,
        'cartItems.productId': productId
      },
      {
        $set: {
          'cartItems.$.quantity': reqBody.quantity
        }
      },
      {
        new: true
      }
    ).populate('cartItems.productId')

    if (!itemCart) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'ID không tồn tại.')
    }

    return itemCart
  } catch (err) {
    throw err
  }
}

const deleteItemCart = async (userId, productId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedCart = await CartModel.findOneAndUpdate(
      {
        userId,
        'cartItems.productId': productId
      },
      {
        $pull: { cartItems: { productId } }
      },
      { new: true }
    )

    if (!updatedCart) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tồn tại ID.')
    }

    return updatedCart
  } catch (err) {
    throw err
  }
}

const deleteCart = async (userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedCart = await CartModel.findOneAndUpdate(
      {
        userId
      },
      {
        $set: { cartItems: [] }
      },
      { new: true }
    ).lean()

    if (!updatedCart) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tồn tại ID.')
    }

    return updatedCart
  } catch (err) {
    throw err
  }
}

export const cartsService = {
  createCart,
  getItemCartList,
  updateItemCart,
  deleteItemCart,
  deleteCart
}
