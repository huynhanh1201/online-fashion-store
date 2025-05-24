import { StatusCodes } from 'http-status-codes'

import { InventoryModel } from '~/models/InventoryModel'
import generateSKU from '~/utils/generateSKU'
import { ProductModel } from '~/models/ProductModel'
import ApiError from '~/utils/ApiError'

const createInventory = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const product = await ProductModel.findById(reqBody.productId)

    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm.')
    }

    const newInventory = {
      productId: reqBody.productId,
      variant: {
        color: {
          name: reqBody.variant.color.name,
          image: reqBody.variant.color.image
        },
        size: {
          name: reqBody.variant.size.name
        },
        sku: generateSKU(
          product.name,
          reqBody.variant.color.name,
          reqBody.variant.size.name
        )
      },
      quantity: reqBody.quantity,
      importPrice: reqBody.importPrice,
      exportPrice: reqBody.exportPrice,
      minQuantity: reqBody.minQuantity,
      status: reqBody.status,

      destroy: false
    }

    const inventories = await InventoryModel.create(newInventory)

    return inventories
  } catch (err) {
    throw err
  }
}

const getInventoryList = async () => {
  const result = await InventoryModel.find({ destroy: false })
    .populate('productId')
    .lean()

  return result
}

const getInventory = async (inventoryId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await InventoryModel.findOne({
      _id: inventoryId,
      destroy: false
    })
      .populate('productId')
      .lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateInventory = async (inventoryId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedInventory = await InventoryModel.findOneAndUpdate(
      { _id: inventoryId },
      reqBody,
      { new: true }
    )

    return updatedInventory
  } catch (err) {
    throw err
  }
}

const deleteInventory = async (inventoryId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const inventoryDeleted = await InventoryModel.findOneAndUpdate(
      { _id: inventoryId },
      { destroy: true },
      { new: true }
    )

    return inventoryDeleted
  } catch (err) {
    throw err
  }
}

const importStockInventory = async (inventoryId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const importStockInventory = await InventoryModel.findOneAndUpdate(
      { _id: inventoryId },
      reqBody,
      { new: true }
    )

    return importStockInventory
  } catch (err) {
    throw err
  }
}

const exportStockInventory = async (inventoryId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const inventory = await InventoryModel.findById(inventoryId)

    if (!inventory) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm.')
    }

    if (inventory.quantity < reqBody.quantity) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Số lượng xuất kho lớn hơn số lượng tồn kho.'
      )
    }

    const exportStockInventory = await InventoryModel.findOneAndUpdate(
      { _id: inventoryId },
      {
        quantity: inventory.quantity - reqBody.quantity
      },
      { new: true }
    )

    return exportStockInventory
  } catch (err) {
    throw err
  }
}

export const inventoriesService = {
  createInventory,
  getInventoryList,
  getInventory,
  updateInventory,
  deleteInventory,
  importStockInventory,
  exportStockInventory
}
