import { StatusCodes } from 'http-status-codes'

import { orderStatusHistoriesService } from '~/services/orderStatusHistoriesService'

const getOrderStatusHistoryList = async (req, res, next) => {
  try {
    const { orderId } = req.params

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result =
      await orderStatusHistoriesService.getOrderStatusHistoryList(orderId)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const orderStatusHistoriesController = {
  getOrderStatusHistoryList
}
