import { ghnAxios } from '~/utils/axiosClient'

const getDelivery = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { numberItemOrder } = reqBody

    const length = 30
    const width = 20
    const height = 2 * numberItemOrder
    const weight = 300 * numberItemOrder

    const { data: dataResultGhn } = await ghnAxios.post('/shipping-order/fee', {
      ...reqBody,
      length,
      width,
      height,
      weight
    })

    const result = { totalFeeShipping: dataResultGhn.data.total }

    return result
  } catch (err) {
    throw err
  }
}

export const deliveriesService = {
  getDelivery
}
