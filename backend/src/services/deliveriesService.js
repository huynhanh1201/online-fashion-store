import { ghnAxios } from '~/utils/axiosClient'
import apiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

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

const createOrderDelivery = async (
  reqBody,
  order,
  address,
  variantItemsGHN,
  numberItemOrder
) => {
  try {
    // Tạo đơn hàng cho đơn vị vận chuyển (GHN)

    const length = 30
    const width = 20
    const height = 2 * numberItemOrder
    const weight = 300 * numberItemOrder

    const bodyReqCreateOrderGnh = {
      // Thông tin người nhận
      to_name: address.fullName,
      to_phone: address.phone,
      to_address: address.address,
      to_ward_name: address.ward,
      to_district_name: address.district,
      to_province_name: address.city,

      // Kích thước & cân nặng
      length,
      width,
      height,
      weight,

      // Dịch vụ giao hàng
      service_type_id: 2,
      payment_type_id: 1,
      cod_amount: reqBody.paymentMethod === 'COD' ? order.total : 0,
      required_note: 'KHONGCHOXEMHANG',

      // Quản lý đơn hàng
      client_order_code: order.code,

      items: variantItemsGHN
    }

    const result = await ghnAxios.post(
      '/shipping-order/create',
      bodyReqCreateOrderGnh
    )

    return result
  } catch (err) {
    throw new apiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Không thể tạo đơn hàng giao hàng.'
    )
  }
}

export const deliveriesService = {
  getDelivery,
  createOrderDelivery
}
