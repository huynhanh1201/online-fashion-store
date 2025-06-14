import { InventoryModel } from '~/models/InventoryModel'
import getDateRange from '~/utils/getDateRange'
import validatePagination from '~/utils/validatePagination'
import apiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const handleCreateInventory = async () => {
  return 'Empty'
}

const getInventoryList = async (queryString) => {
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

const validateInventory = async (cartItems, session) => {
  const updatedInventories = []
  let variantIds = []
  let numberItemOrder = 0

  for (const item of cartItems) {
    const { variantId, quantity } = item

    const inventory = await InventoryModel.findOneAndUpdate(
      {
        variantId,
        quantity: { $gte: quantity }
      },
      {
        $inc: { quantity: -quantity }
      },
      {
        new: true,
        session
      }
    )

    if (!inventory) {
      throw new apiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Biến thể của sản phẩm không đủ tồn kho để đặt hàng (yêu cầu: ${quantity})`
      )
    }

    updatedInventories.push(inventory)

    numberItemOrder += quantity

    // Lấy mảng variantId
    if (variantIds.includes(variantId)) continue
    variantIds.push(variantId)
  }

  return { updatedInventories, numberItemOrder, variantIds }
}

export const inventoriesService = {
  getInventoryList,
  getInventory,
  updateInventory,
  deleteInventory,
  handleCreateInventory,
  validateInventory
}
