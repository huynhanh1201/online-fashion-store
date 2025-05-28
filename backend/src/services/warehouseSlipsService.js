import { StatusCodes } from 'http-status-codes'

import { WarehouseSlipModel } from '~/models/WarehouseSlipsModel'
import generateSKU from '~/utils/generateSKU'
import { ProductModel } from '~/models/ProductModel'
import ApiError from '~/utils/ApiError'
import getDayNow from '~/utils/getDayNow'

const createWarehouseSlip = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const product = await ProductModel.findById(reqBody.productId)

    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm.')
    }

    const newWarehouseSlip = {
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

    const warehouseSlips = await WarehouseSlipModel.create(newWarehouseSlip)

    // Cập nhật số lượng tồn kho trong sản phẩm
    product.quantity += Number(reqBody.quantity)
    await product.save()

    return warehouseSlips
  } catch (err) {
    throw err
  }
}

const getWarehouseSlipList = async () => {
  const result = await WarehouseSlipModel.find({ destroy: false })
    .populate('productId')
    .lean()

  return result
}

const getWarehouseSlip = async (warehouseSlipId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await WarehouseSlipModel.findOne({
      _id: warehouseSlipId,
      destroy: false
    })
      .populate('productId')
      .lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateWarehouseSlip = async (warehouseSlipId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedWarehouseSlip = await WarehouseSlipModel.findOneAndUpdate(
      { _id: warehouseSlipId },
      reqBody,
      { new: true }
    )

    return updatedWarehouseSlip
  } catch (err) {
    throw err
  }
}

const deleteWarehouseSlip = async (warehouseSlipId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const warehouseSlipDeleted = await WarehouseSlipModel.findOneAndUpdate(
      { _id: warehouseSlipId },
      { destroy: true },
      { new: true }
    )

    return warehouseSlipDeleted
  } catch (err) {
    throw err
  }
}

const importStockWarehouseSlip = async (warehouseSlipId, reqBody, userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const importStockWarehouseSlip = await WarehouseSlipModel.findOneAndUpdate(
      { _id: warehouseSlipId },
      reqBody,
      { new: true }
    ).populate('productId')

    if (!importStockWarehouseSlip) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Không tìm thấy Kho (WarehouseSlips).'
      )
    }

    // Ghi lai lịch sử nhập kho
    const warehouseSlipLog = {
      warehouseSlipId: warehouseSlipId,
      productId: importStockWarehouseSlip.productId._id,
      variant: {
        sku: importStockWarehouseSlip.variant.sku,
        color: importStockWarehouseSlip.variant.color,
        size: importStockWarehouseSlip.variant.size
      },
      type: 'in',
      source: 'manual',
      amount: reqBody.quantity,
      importPrice: importStockWarehouseSlip.importPrice,
      exportPrice: importStockWarehouseSlip.exportPrice,
      note: `Nhập lô hàng ${importStockWarehouseSlip.productId.name} ${importStockWarehouseSlip.variant.color.name} size ${importStockWarehouseSlip.variant.size.name} ngày ${getDayNow()} `,
      userId: userId
    }

    await WarehouseSlipModel.create(warehouseSlipLog)

    return importStockWarehouseSlip
  } catch (err) {
    throw err
  }
}

const exportStockWarehouseSlip = async (warehouseSlipId, reqBody, userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const warehouseSlip =
      await WarehouseSlipModel.findById(warehouseSlipId).populate('productId')

    if (!warehouseSlip) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm.')
    }

    if (warehouseSlip.quantity < reqBody.quantity) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Số lượng xuất kho lớn hơn số lượng tồn kho.'
      )
    }

    const exportStockWarehouseSlip = await WarehouseSlipModel.findOneAndUpdate(
      { _id: warehouseSlipId },
      {
        quantity: warehouseSlip.quantity - reqBody.quantity
      },
      { new: true }
    )

    // Ghi lai lịch sử nhập kho
    const warehouseSlipLog = {
      warehouseSlipId: warehouseSlipId,
      productId: exportStockWarehouseSlip.productId._id,
      variant: {
        sku: exportStockWarehouseSlip.variant.sku,
        color: exportStockWarehouseSlip.variant.color,
        size: exportStockWarehouseSlip.variant.size
      },
      type: 'out',
      source: 'manual',
      amount: Number(reqBody.quantity) * -1,
      importPrice: exportStockWarehouseSlip.importPrice,
      exportPrice: exportStockWarehouseSlip.exportPrice,
      note: `Xuất lô hàng ${exportStockWarehouseSlip.productId.name} ${exportStockWarehouseSlip.variant.color.name} size ${exportStockWarehouseSlip.variant.size.name} ngày ${getDayNow()} `,
      userId: userId
    }

    await WarehouseSlipModel.create(warehouseSlipLog)

    return exportStockWarehouseSlip
  } catch (err) {
    throw err
  }
}

export const warehouseSlipsService = {
  createWarehouseSlip,
  getWarehouseSlipList,
  getWarehouseSlip,
  updateWarehouseSlip,
  deleteWarehouseSlip,
  importStockWarehouseSlip,
  exportStockWarehouseSlip
}
