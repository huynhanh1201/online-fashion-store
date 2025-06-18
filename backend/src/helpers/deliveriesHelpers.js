import { VariantModel } from '~/models/VariantModel'
import apiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const handleVariantItemsGHN = async (cartItems) => {
  /**
   * Input: cartItems
   * Output:  "items": [
   *     {
   *         "name": "TEST1",
   *         "quantity": 1,
   *         "length": 200,
   *         "width": 200,
   *         "height": 200,
   *         "weight": 1000
   *     }]
   * */

  const variantIds = getVariantIds(cartItems)

  const variants = await getVariants(variantIds)

  const variantMap = createVariantMap(variants)

  let prevLength = 0
  let prevWidth = 0

  const result = cartItems.map((item) => {
    const variant = variantMap[item.variantId]

    const length = Math.max(prevLength, variant.length)

    prevLength = length

    const width = Math.max(prevWidth, variant.width)

    prevLength = width

    return {
      name: variant.name,
      quantity: item.quantity,
      length: length,
      width: width,
      height: variant.height,
      weight: variant.weight * item.quantity
    }
  })

  return result
}

const getVariantIds = (cartItems) => {
  const result = cartItems.map((item) => {
    return item.variantId
  })

  return result
}

const getVariants = async (variantIds) => {
  const result = await VariantModel.find({ _id: { $in: variantIds } })
    .select('name packageSize')
    .lean()

  return result
}

const createVariantMap = (variants) => {
  const result = variants.reduce((acc, variant) => {
    return (
      (acc[variant._id] = {
        name: variant.name,
        length: variant.packageSize.length,
        width: variant.packageSize.width,
        height: variant.packageSize.height,
        weight: variant.packageSize.weight
      }),
      acc
    )
  }, {})

  return result
}

const calculateTotalWeight = (cartItems, variants) => {
  const variantMap = createVariantMap(variants)

  const result = cartItems.reduce((acc, item) => {
    const variant = variantMap[item.variantId]

    return acc + variant.weight * item.quantity
  }, 0)

  return result
}

const isShippingFeeValid = (clientFee, serverFee) => {
  if (clientFee !== serverFee) {
    throw new apiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Phí vận chuyển không hợp lệ.'
    )
  }
}

export const diliveriesHelpers = {
  handleVariantItemsGHN,
  getVariantIds,
  getVariants,
  createVariantMap,
  calculateTotalWeight,
  isShippingFeeValid
}
