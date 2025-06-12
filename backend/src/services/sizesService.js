import { SizeModel } from '~/models/SizeModel'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'

const createSize = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newSize = {
      name: reqBody.name,
      destroy: false
    }

    const sizes = await SizeModel.create(newSize)

    return sizes
  } catch (err) {
    throw err
  }
}

const getSizeList = async (queryString) => {
  let {
    page = 1,
    limit = 10,
    search,
    status,
    sort,
    filterTypeDate,
    startDate,
    endDate
  } = queryString

  // Kiểm tra dữ liệu đầu vào của limit và page
  validatePagination(page, limit)

  // Xử lý thông tin Filter
  const filter = {}

  if (status === 'true' || status === 'false') {
    status = JSON.parse(status)

    filter.destroy = status
  }

  if (search) {
    filter.name = { $regex: search, $options: 'i' }
  }

  const dateRange = getDateRange(filterTypeDate, startDate, endDate)

  if (dateRange.startDate && dateRange.endDate) {
    filter['createdAt'] = {
      $gte: new Date(dateRange.startDate),
      $lte: new Date(dateRange.endDate)
    }
  }

  const sortMap = {
    name_asc: { name: 1 },
    name_desc: { name: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 }
  }

  let sortField = {}

  if (sort) {
    sortField = sortMap[sort]
  }

  const [sizes, total] = await Promise.all([
    SizeModel.find(filter)
      .collation({ locale: 'vi', strength: 1 })
      .sort(sortField)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    SizeModel.countDocuments(filter)
  ])

  const result = {
    data: sizes,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  return result
}

const getSize = async (sizeId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await SizeModel.findById(sizeId).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateSize = async (sizeId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedSize = await SizeModel.findOneAndUpdate(
      { _id: sizeId },
      reqBody,
      { new: true }
    )

    return updatedSize
  } catch (err) {
    throw err
  }
}

const deleteSize = async (sizeId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const sizeDeleted = await SizeModel.findOneAndUpdate(
      { _id: sizeId },
      { destroy: true },
      { new: true }
    )

    return sizeDeleted
  } catch (err) {
    throw err
  }
}

export const sizesService = {
  createSize,
  getSizeList,
  getSize,
  updateSize,
  deleteSize
}
