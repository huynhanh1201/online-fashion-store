import { StatusCodes } from 'http-status-codes'

import { InventoryModel } from '~/models/InventoryModel'
import apiError from '~/utils/ApiError'
import getDateRange from '~/utils/getDateRange'

const handleCreateInventory = async () => {
  return 'Empty'
}

const getInventoryList = async (queryString) => {
  let {
    limit = 10,
    page = 1,
    warehouseId,
    variantId,
    status,
    filterTypeDate,
    startDate,
    endDate
  } = queryString

  const filter = {
    destroy: false
  }

  // Kiểm tra dữ liệu đầu vào của limit và page
  limit = Number(limit)
  page = Number(page)

  if (!limit || limit < 1) {
    throw new apiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Query string "limit" phải là số và lớn hơn 0'
    )
  }

  if (!page || page < 1) {
    throw new apiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Query string "page" phải là số và lớn hơn 0'
    )
  }

  // Kiểm tra dữ liệu của query string
  if (warehouseId) {
    filter['warehouseId'] = warehouseId
  }

  if (variantId) {
    filter['variantId'] = variantId
  }

  if (status) {
    filter['status'] = status
  }

  const dateRange = getDateRange(filterTypeDate, startDate, endDate)

  if (dateRange.startDate && dateRange.endDate) {
    filter['createdAt'] = {
      $gte: new Date(dateRange.startDate),
      $lte: new Date(dateRange.endDate)
    }
  }

  const result = await InventoryModel.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate([
      {
        path: 'variantId',
        select: 'name sku color size'
      },
      {
        path: 'warehouseId',
        select: 'name'
      }
    ])
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
      .populate([
        {
          path: 'variantId',
          select: 'name sku color size'
        },
        {
          path: 'warehouseId',
          select: 'name'
        }
      ])
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

export const inventoriesService = {
  getInventoryList,
  getInventory,
  updateInventory,
  deleteInventory,
  handleCreateInventory
}
