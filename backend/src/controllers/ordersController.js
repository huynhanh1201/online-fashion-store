import { StatusCodes } from 'http-status-codes'

import { ordersService } from '~/services/ordersService'

const createOrder = async (req, res, next) => {
  try {
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    // Lấy Danh mục sản phẩm mới tạo từ tầng Service chuyển qua
    const result = await ordersService.createOrder(
      req.jwtDecoded._id,
      req.body,
      ipAddr
    )

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getOrderList = async (req, res, next) => {
  try {
    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await ordersService.getOrderList()

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId

    const result = await ordersService.getOrder(orderId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId

    const result = await ordersService.updateOrder(
      req.jwtDecoded._id,
      orderId,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId

    const result = await ordersService.deleteOrder(orderId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

// Thanh toán VNPAY

const vnpayIPN = async (req, res, next) => {
  try {
    const result = await ordersService.vnpayIPN(req)

    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

const vnpayReturn = async (req, res, next) => {
  try {
    const result = await ordersService.vnpayReturn(req)

    res.redirect(result)
    // res.status(200).json({ code: resultCode })
  } catch (err) {
    next(err)
  }
}

export const ordersController = {
  createOrder,
  getOrderList,
  getOrder,
  updateOrder,
  deleteOrder,
  vnpayIPN,
  vnpayReturn
}
