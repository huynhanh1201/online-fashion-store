import { StatusCodes } from 'http-status-codes'

import { cartsService } from '~/services/cartsService'

const createCart = async (req, res, next) => {
  try {
    // Lấy Danh mục sản phẩm mới tạo từ tầng Service chuyển qua
    const result = await cartsService.createCart(req.jwtDecoded, req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getItemCartList = async (req, res, next) => {
  try {
    // Lấy danh sách Giỏ hàng từ tầng Service chuyển qua
    const result = await cartsService.getItemCartList(req.jwtDecoded._id)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateItemCart = async (req, res, next) => {
  try {
    const result = await cartsService.updateItemCart(
      req.jwtDecoded._id,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteItemCart = async (req, res, next) => {
  try {
    const result = await cartsService.deleteItemCart(
      req.jwtDecoded._id,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteCart = async (req, res, next) => {
  try {
    const result = await cartsService.deleteCart(req.jwtDecoded._id)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const cartsController = {
  createCart,
  getItemCartList,
  updateItemCart,
  deleteItemCart,
  deleteCart
}
