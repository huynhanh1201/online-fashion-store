import { InventoryModel } from '~/models/InventoryModel'
import getDateRange from '~/utils/getDateRange'
import validatePagination from '~/utils/validatePagination'

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
  validatePagination(page, limit)

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

  const [inventories, total] = await Promise.all([
    InventoryModel.find(filter)
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
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    InventoryModel.countDocuments(filter)
  ])

  const result = {
    data: inventories,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

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
