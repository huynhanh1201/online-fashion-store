import { BatchModel } from '~/models/BatchModel'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const getBatchList = async (queryString) => {
  let {
    page = 1,
    limit = 10,
    search,
    status,
    sort,
    filterTypeDate,
    startDate,
    endDate,
    variantId,
    warehouseId
  } = queryString

  // Kiểm tra dữ liệu đầu vào của limit và page
  validatePagination(page, limit)

  // Xử lý thông tin Filter
  const filter = {}

  if (variantId) filter.variantId = variantId

  if (warehouseId) filter.warehouseId = warehouseId

  if (status === 'true' || status === 'false') {
    status = JSON.parse(status)

    filter.destroy = status
  }

  if (search) {
    filter.batchCode = { $regex: search, $options: 'i' }
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

  const [batches, total] = await Promise.all([
    BatchModel.find(filter)
      .collation({ locale: 'vi', strength: 1 })
      .sort(sortField)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate([
        {
          path: 'variantId',
          select: 'name'
        },
        {
          path: 'warehouseId',
          select: 'name'
        }
      ])
      .lean(),

    BatchModel.countDocuments(filter)
  ])

  const result = {
    data: batches,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  return result
}

const getBatch = async (batchId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await BatchModel.findOne({
      _id: batchId,
      destroy: false
    })
      .populate([
        {
          path: 'variantId',
          select: 'name'
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

const updateBatch = async (batchId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedBatch = await BatchModel.findOneAndUpdate(
      { _id: batchId },
      reqBody,
      { new: true }
    )

    return updatedBatch
  } catch (err) {
    throw err
  }
}

const deleteBatch = async (batchId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const batchDeleted = await BatchModel.updateOne(
      { _id: batchId },
      { destroy: true },
      { new: true }
    )

    if (!batchDeleted) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Lô hàng không tồn tại.')
    }

    return batchDeleted
  } catch (err) {
    throw err
  }
}

export const batchesService = {
  getBatchList,
  getBatch,
  updateBatch,
  deleteBatch
}
