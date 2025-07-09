import { InventoryLogModel } from '~/models/InventoryLogModel'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'

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
  let {
    page = 1,
    limit = 10,
    type,
    search,
    sort,
    filterTypeDate,
    startDate,
    endDate
  } = queryString

  // Kiểm tra dữ liệu đầu vào của limit và page

  validatePagination(page, limit)

  const filter = {}

  // Kiểm tra data query string

  if (type) {
    filter['type'] = type
  }

  if (search) {
    filter.source = { $regex: search, $options: 'i' }
  }

  const dateRange = getDateRange(filterTypeDate, startDate, endDate)

  if (dateRange.startDate && dateRange.endDate) {
    filter['createdAt'] = {
      $gte: new Date(dateRange.startDate),
      $lte: new Date(dateRange.endDate)
    }
  }

  let sortField = {}

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 }
  }

  if (sort) {
    sortField = sortMap[sort]
  }

  const [inventoryLogs, total] = await Promise.all([
    InventoryLogModel.find(filter)
      .sort(sortField)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'inventoryId',
        populate: [
          {
            path: 'variantId',
            select: 'name sku price', // Chỉ lấy thông tin cần thiết của variant
            model: 'Variant' // Đảm bảo Mongoose biết đúng Chart
          },
          {
            path: 'warehouseId', // Bước 3: trong Inventory, populate warehouseId
            select: 'name',
            model: 'Warehouse'
          }
        ],
        select: 'variantId warehouseId'
      })
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
            model: 'Variant' // Đảm bảo Mongoose biết đúng Chart
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
    const inventoryLogDeleted = await InventoryLogModel.updateOne(
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
