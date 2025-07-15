import { OrderStatusHistoryModel } from '~/models/OrderStatusHistoryModel'

const getOrderStatusHistoryList = async (orderId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await OrderStatusHistoryModel.find({ orderId }).lean()

    return result
  } catch (err) {
    throw err
  }
}

export const orderStatusHistoriesService = {
  getOrderStatusHistoryList
}
