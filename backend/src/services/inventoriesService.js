import { InventoryModel } from '~/models/InventoryModel'
import getDateRange from '~/utils/getDateRange'
import validatePagination from '~/utils/validatePagination'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { VariantModel } from '~/models/VariantModel'

const handleCreateInventory = async () => {
  return 'Empty'
}

const getInventoryList = async (queryString) => {
  // Cập nhật trạng thái của tồn kho
  await updateStatusInventoryAll()

  let {
    limit = 10,
    page = 1,
    warehouseId,
    variantId,
    statusInventory,
    filterTypeDate,
    startDate,
    endDate,
    status,
    sort
  } = queryString

  const filter = {
    destroy: false
  }

  // Kiểm tra dữ liệu đầu vào của limit và page
  validatePagination(page, limit)

  // Kiểm tra dữ liệu của query string

  if (status === 'true' || status === 'false') {
    status = JSON.parse(status)

    filter.destroy = status
  }

  if (warehouseId) {
    filter['warehouseId'] = warehouseId
  }

  if (variantId) {
    filter['variantId'] = variantId
  }

  if (statusInventory) {
    filter['status'] = statusInventory
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
    name_asc: { name: 1 },
    name_desc: { name: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 }
  }

  if (sort) {
    sortField = sortMap[sort]
  }

  const [inventories, total] = await Promise.all([
    InventoryModel.find(filter)
      .sort(sortField)
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
    }).populate([
      {
        path: 'variantId',
        select: 'name sku color size'
      },
      {
        path: 'warehouseId',
        select: 'name'
      }
    ])

    if (result.quantity === 0) result.status = 'out-of-stock'
    else if (result.quantity < result.minQuantity) result.status = 'low-stock'
    else result.status = 'in-stock'

    await result.save()

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
    const inventoryDeleted = await InventoryModel.updateOne(
      { _id: inventoryId },
      { destroy: true },
      { new: true }
    )

    if (!inventoryDeleted) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Tồn kho không tồn tại.')
    }

    return inventoryDeleted
  } catch (err) {
    throw err
  }
}

const updateStatusInventoryAll = async () => {
  await InventoryModel.updateMany(
    { quantity: 0 },
    { $set: { status: 'out-of-stock' } }
  )

  await InventoryModel.updateMany(
    {
      quantity: { $gt: 0 },
      $expr: { $lte: ['$quantity', '$minQuantity'] }
    },
    { $set: { status: 'low-stock' } }
  )

  await InventoryModel.updateMany(
    {
      $expr: { $gt: ['$quantity', '$minQuantity'] }
    },
    { $set: { status: 'in-stock' } }
  )
}

export const inventoriesService = {
  getInventoryList,
  getInventory,
  updateInventory,
  deleteInventory,
  handleCreateInventory,
  updateStatusInventoryAll
}
