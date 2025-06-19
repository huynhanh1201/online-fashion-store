import { ghnAxios } from '~/utils/axiosClient'
import { diliveriesHelpers } from '~/helpers/deliveriesHelpers'

const getDeliveryFee = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { to_district_id, to_ward_code, cartItems } = reqBody

    const variantIds = diliveriesHelpers.getVariantIds(cartItems)

    const variants = await diliveriesHelpers.getVariants(variantIds)

    const variantItemsGHN =
      await diliveriesHelpers.handleVariantItemsGHN(cartItems)

    const totalWeightOrder = diliveriesHelpers.calculateTotalWeight(
      cartItems,
      variants
    )

    const { data: dataResultGhn } = await ghnAxios.post('/shipping-order/fee', {
      service_type_id: 2,
      to_district_id,
      to_ward_code,
      weight: totalWeightOrder,
      items: variantItemsGHN
    })

    const result = { totalFeeShipping: dataResultGhn.data.total }

    return result
  } catch (err) {
    throw err
  }
}

const createDeliveryOrder = async (
  reqBody,
  cartItems,
  order,
  address,
  variantMap
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const variantIds = diliveriesHelpers.getVariantIds(cartItems)

    const variants = await diliveriesHelpers.getVariants(variantIds)

    const totalWeightOrder = diliveriesHelpers.calculateTotalWeight(
      cartItems,
      variants
    )

    const variantItemsGHN =
      await diliveriesHelpers.handleVariantItemsGHN(cartItems)

    const dataCreateDilivery = {
      to_name: address.fullName,
      to_phone: address.phone,
      to_address: address.address,
      to_ward_name: address.ward,
      to_district_name: address.district,
      to_province_name: address.city,

      service_type_id: 2,
      payment_type_id: reqBody.paymentMethod === 'COD' ? 2 : 1,
      required_note: 'KHONGCHOXEMHANG',

      items: variantItemsGHN,

      weight: totalWeightOrder,

      cod_amount: order.total
    }

    const result = await ghnAxios.post(
      '/shipping-order/create',
      dataCreateDilivery
    )

    const clientFee = reqBody.shippingFee

    const serverFee = result.data.data.total_fee

    diliveriesHelpers.isShippingFeeValid(clientFee, serverFee)

    return result
  } catch (err) {
    throw err
  }
}

const ghnWebhook = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { OrderCode, ClientOrderCode, Status, Type, Time, Description } =
      reqBody
  } catch (err) {
    throw err
  }
}

export const deliveriesService = {
  getDeliveryFee,
  createDeliveryOrder,
  ghnWebhook
}
