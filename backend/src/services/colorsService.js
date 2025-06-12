import { ColorModel } from '~/models/ColorModel'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'
import { CategoryModel } from '~/models/CategoryModel'

const createColor = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newColor = {
      name: reqBody.name,
      destroy: false
    }

    const colors = await ColorModel.create(newColor)

    return colors
  } catch (err) {
    throw err
  }
}

const getColorList = async (queryString) => {
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

  const [colors, total] = await Promise.all([
    ColorModel.find(filter)
      .collation({ locale: 'vi', strength: 1 })
      .sort(sortField)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    ColorModel.countDocuments(filter)
  ])

  const result = {
    data: colors,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  return result
}

const getColor = async (colorId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await ColorModel.findById(colorId).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateColor = async (colorId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedColor = await ColorModel.findOneAndUpdate(
      { _id: colorId },
      reqBody,
      { new: true }
    )

    return updatedColor
  } catch (err) {
    throw err
  }
}

const deleteColor = async (colorId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const colorDeleted = await ColorModel.findOneAndUpdate(
      { _id: colorId },
      { destroy: true },
      { new: true }
    )

    return colorDeleted
  } catch (err) {
    throw err
  }
}

export const colorsService = {
  createColor,
  getColorList,
  getColor,
  updateColor,
  deleteColor
}
