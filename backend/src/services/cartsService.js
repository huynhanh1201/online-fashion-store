import { StatusCodes } from 'http-status-codes'

import { CartModel } from '~/models/CartModel'
import ApiError from '~/utils/ApiError'

const createCart = async (reqJwtDecoded, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { _id: userId } = reqJwtDecoded

    // Lấy document giỏ hàng (nếu có)
    const userCart = await CartModel.findOne({ userId })

    // Nếu không có giỏ hàng, tạo mới
    if (!userCart) {
      const newCart = await CartModel.create({
        userId,
        cartItems: [reqBody]
      })

      return newCart
    }

    // Nếu có giỏ hàng, cập nhật các item trong giỏ hàng
    // Biến thể đã tồn tại

    const updateItemExists = await CartModel.updateOne(
      {
        userId, // nếu bạn đã biết _id của cart
        cartItems: {
          $elemMatch: {
            productId: reqBody.productId,
            color: reqBody.color,
            size: reqBody.size.toUpperCase()
          }
        }
      },
      {
        $inc: { 'cartItems.$.quantity': reqBody.quantity }
      }
    )

    if (updateItemExists.modifiedCount > 0) return updateItemExists

    // Biến thể chưa tồn tại

    const createItem = await CartModel.updateOne(
      { userId },
      {
        $push: { cartItems: reqBody }
      },
      {
        upsert: true
      }
    )
    return createItem
  } catch (err) {
    throw err
  }
}

const getItemCartList = async (userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await CartModel.findOne({ userId })
      .populate('cartItems.productId') // đảm bảo ref đúng
      .lean() // sau populate mới gọi lean

    return result
  } catch (err) {
    throw err
  }
}

const updateItemCart = async (userId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const itemCart = await CartModel.findOneAndUpdate(
      {
        userId,
        'cartItems.productId': reqBody.productId,
        'cartItems.color': reqBody.color,
        'cartItems.size': reqBody.size
      },
      {
        $inc: {
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

const deleteItemCart = async (userId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedCart = await CartModel.findOneAndUpdate(
      {
        userId,
        'cartItems.productId': reqBody.productId,
        'cartItems.color': reqBody.color,
        'cartItems.size': reqBody.size
      },
      {
        $pull: {
          cartItems: {
            productId: reqBody.productId,
            color: reqBody.color,
            size: reqBody.size
          }
        }
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
