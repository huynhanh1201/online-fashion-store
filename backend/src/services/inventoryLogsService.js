import { InventoryLogModel } from '~/models/InventoryLogModel'
import apiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { InventoryModel } from '~/models/InventoryModel'

const createInventoryLog = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newInventoryLog = {
      name: reqBody.name,
      destroy: false
    }

    const inventoryLogs = await InventoryLogModel.create(newInventoryLog)

    return inventoryLogs
  } catch (err) {
    throw err
  }
}

const getInventoryLogList = async (queryString) => {
  let { page = 1, limit = 10, inventoryId, batchId, type, source } = queryString

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

  const filter = {}

  // Kiểm tra data query string

  if (inventoryId) {
    filter['inventoryId'] = inventoryId
  }

  if (batchId) {
    filter['batchId'] = batchId
  }

  if (type) {
    filter['type'] = type
  }

  if (source) {
    filter['source'] = source
  }

  const [inventoryLogs, total] = await Promise.all([
    InventoryLogModel.find(filter)
      .populate({
        path: 'inventoryId',
        populate: [
          {
            path: 'variantId',
            select: 'name sku price', // Chỉ lấy thông tin cần thiết của variant
            model: 'Variant' // Đảm bảo Mongoose biết đúng modal
          },
          {
            path: 'warehouseId', // Bước 3: trong Inventory, populate warehouseId
            select: 'name',
            model: 'Warehouse'
          }
        ],
        select: 'variantId warehouseId'
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    InventoryLogModel.countDocuments(filter)
  ])

  const result = {
    data: inventoryLogs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  return result
}

const getInventoryLog = async (inventoryLogId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await InventoryLogModel.findById(inventoryLogId)
      .populate({
        path: 'inventoryId',
        populate: [
          {
            path: 'variantId',
            select: 'name sku price', // Chỉ lấy thông tin cần thiết của variant
            model: 'Variant' // Đảm bảo Mongoose biết đúng modal
          },
          {
            path: 'warehouseId', // Bước 3: trong Inventory, populate warehouseId
            select: 'name',
            model: 'Warehouse'
          }
        ],
        select: 'variantId warehouseId'
      })
      .lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateInventoryLog = async (inventoryLogId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedInventoryLog = await InventoryLogModel.findOneAndUpdate(
      { _id: inventoryLogId },
      reqBody,
      { new: true }
    )

    return updatedInventoryLog
  } catch (err) {
    throw err
  }
}

const deleteInventoryLog = async (inventoryLogId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const inventoryLogDeleted = await InventoryLogModel.findOneAndUpdate(
      { _id: inventoryLogId },
      { destroy: true },
      { new: true }
    )

    return inventoryLogDeleted
  } catch (err) {
    throw err
  }
}

export const inventoryLogsService = {
  createInventoryLog,
  getInventoryLogList,
  getInventoryLog,
  updateInventoryLog,
  deleteInventoryLog
}
