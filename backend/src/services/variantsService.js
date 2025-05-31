import { StatusCodes } from 'http-status-codes'

import ApiError from '~/utils/ApiError'
import { VariantModel } from '~/models/VariantModel'
import { ProductModel } from '~/models/ProductModel'
import generateSKU from '~/utils/generateSKU'

const createVariant = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await ProductModel.findById(reqBody.productId)

    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại')
    }

    // Kiểm tra xem SKU đã tồn tại chưa
    const newSku = generateSKU(
      product.productCode,
      reqBody.color.name,
      reqBody.size.name
    )
    const existsVariant = await VariantModel.exists({ sku: newSku })
    if (existsVariant) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Màu sắc và kích thước này đã tồn tại cho sản phẩm này'
      )
    }

    const newVariant = {
      productId: reqBody.productId,
      color: {
        name: reqBody.color.name,
        image: reqBody.color.image
      },
      size: {
        name: reqBody.size.name
      },
      importPrice: reqBody.overridePrice
        ? reqBody.importPrice
        : product.importPrice,
      exportPrice: reqBody.overridePrice
        ? reqBody.exportPrice
        : product.exportPrice,
      overridePrice: reqBody.overridePrice,

      productCode: product.productCode,
      sku: newSku,
      name: `${product.name} ${reqBody.color.name} size ${reqBody.size.name}`,
      destroy: false
    }

    const variants = await VariantModel.create(newVariant)

    return variants
  } catch (err) {
    throw err
  }
}

const getVariantList = async () => {
  const result = await VariantModel.find({ destroy: false }).lean()

  return result || []
}

const getVariant = async (variantId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await VariantModel.findById(variantId).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateVariant = async (variantId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateOps = {
      importPrice: reqBody.importPrice,
      exportPrice: reqBody.exportPrice,
      overridePrice: reqBody.overridePrice,
      destroy: reqBody.destroy
    }

    // Nếu có ảnh color mới
    if (reqBody.color && reqBody.color.image) {
      updateOps['color.image'] = reqBody.color.image
    }

    const updatedVariant = await VariantModel.findByIdAndUpdate(
      { _id: variantId },
      { $set: updateOps },
      { new: true }
    )
    return updatedVariant
  } catch (err) {
    throw err
  }
}

const deleteVariant = async (variantId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const variantDeleted = await VariantModel.findOneAndUpdate(
      { _id: variantId },
      { destroy: true },
      { new: true }
    )

    return variantDeleted
  } catch (err) {
    throw err
  }
}

export const variantsService = {
  createVariant,
  getVariantList,
  getVariant,
  updateVariant,
  deleteVariant
}
