import { OrderItemModel } from '~/models/OrderItemModel'

const getOrderItemList = async (orderId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await OrderItemModel.find({ orderId })
      .populate({
        path: 'productId',
        select: 'name image'
      })
      .lean()

    return result
  } catch (err) {
    throw err
  }
}

export const orderItemsService = {
  getOrderItemList
}
