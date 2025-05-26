import { StatusCodes } from 'http-status-codes'

import { InventoryModel } from '~/models/InventoryModel'
import generateSKU from '~/utils/generateSKU'
import { ProductModel } from '~/models/ProductModel'
import ApiError from '~/utils/ApiError'
import { InventoryLogModel } from '~/models/InventoryLogModel'
import getDayNow from '~/utils/getDayNow'

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

    // Cập nhật số lượng tồn kho trong sản phẩm
    product.qauntity += reqBody.quantity
    await product.save()

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

const importStockInventory = async (inventoryId, reqBody, userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const importStockInventory = await InventoryModel.findOneAndUpdate(
      { _id: inventoryId },
      reqBody,
      { new: true }
    ).populate('productId')

    if (!importStockInventory) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Không tìm thấy Kho (Inventories).'
      )
    }

    // Ghi lai lịch sử nhập kho
    const inventoryLog = {
      inventoryId: inventoryId,
      productId: importStockInventory.productId._id,
      variant: {
        sku: importStockInventory.variant.sku,
        color: importStockInventory.variant.color,
        size: importStockInventory.variant.size
      },
      type: 'in',
      source: 'manual',
      amount: reqBody.quantity,
      importPrice: importStockInventory.importPrice,
      exportPrice: importStockInventory.exportPrice,
      note: `Nhập lô hàng ${importStockInventory.productId.name} ${importStockInventory.variant.color.name} size ${importStockInventory.variant.size.name} ngày ${getDayNow()} `,
      userId: userId
    }

    await InventoryLogModel.create(inventoryLog)

    return importStockInventory
  } catch (err) {
    throw err
  }
}

const exportStockInventory = async (inventoryId, reqBody, userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const inventory =
      await InventoryModel.findById(inventoryId).populate('productId')

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

    // Ghi lai lịch sử nhập kho
    const inventoryLog = {
      inventoryId: inventoryId,
      productId: exportStockInventory.productId._id,
      variant: {
        sku: exportStockInventory.variant.sku,
        color: exportStockInventory.variant.color,
        size: exportStockInventory.variant.size
      },
      type: 'out',
      source: 'manual',
      amount: Number(reqBody.quantity) * -1,
      importPrice: exportStockInventory.importPrice,
      exportPrice: exportStockInventory.exportPrice,
      note: `Xuất lô hàng ${exportStockInventory.productId.name} ${exportStockInventory.variant.color.name} size ${exportStockInventory.variant.size.name} ngày ${getDayNow()} `,
      userId: userId
    }

    await InventoryLogModel.create(inventoryLog)

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
