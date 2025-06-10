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
      from_district_id: 1442,
      from_ward_code: '21211',
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

const createOrderDelivery = async (data) => {
  try {
    const result = await ghnAxios.post('/shipping-order/create', data)

    return result
  } catch (err) {
    console.error('GHN Error code:', err.response?.status)
    console.error(
      'GHN Error body:',
      JSON.stringify(err.response?.data, null, 2)
    )
  }
}

export const deliveriesService = {
  getDelivery,
  createOrderDelivery
}
