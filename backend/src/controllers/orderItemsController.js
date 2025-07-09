import { StatusCodes } from 'http-status-codes'

import { orderItemsService } from '~/services/orderItemsService'

const getOrderItemList = async (req, res, next) => {
  try {
    const orderId = req.params.orderId

    const result = await orderItemsService.getOrderItemList(orderId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const orderItemsController = {
  getOrderItemList
}
