import { StatusCodes } from 'http-status-codes'

import { CategoryModel } from '~/models/CategoryModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import getDateRange from '~/utils/getDateRange'
import validatePagination from '~/utils/validatePagination'

const createCategory = async (reqBody) => {
  try {
    const newCategory = {
      name: reqBody.name,
      description: reqBody.description,
      slug: slugify(reqBody.name),
      destroy: false,
      image: reqBody.image || null,

      parent: reqBody.parent || null,

      banner: reqBody.banner || null
    }

    const category = await CategoryModel.create(newCategory)

    const categoryPopulated = await CategoryModel.findById(category._id)
      .populate({
        path: 'parent',
        select: 'name'
      })
      .lean()

    return categoryPopulated
  } catch (err) {
    throw new ApiError(StatusCodes.CONFLICT, 'Danh mục sản phẩm đã tồn tại!')
  }
}

const getCategoryList = async (queryString) => {
  let {
    page = 1,
    limit = 10,
    status,
    search,
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

  const [categories, total] = await Promise.all([
    CategoryModel.find(filter)
      .collation({ locale: 'vi', strength: 1 })
      .sort(sortField)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'parent',
        select: 'name slug'
      })
      .lean(),

    CategoryModel.countDocuments(filter)
  ])

  const result = {
    data: categories,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  return result
}

const getCategory = async (categoryId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await CategoryModel.findById(categoryId).lean()

    if (!result) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Không có dữ liệu Danh mục sản phẩm.'
      )
    }

    return result
  } catch (err) {
    throw err
  }
}

const updateCategory = async (categoryId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedCategory = await CategoryModel.findOneAndUpdate(
      { _id: categoryId },
      reqBody,
      { new: true }
    )
      .populate({
        path: 'parent',
        select: 'name'
      })
      .lean()

    return updatedCategory
  } catch (err) {
    throw err
  }
}

const deleteCategory = async (categoryId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const categoryUpdated = await CategoryModel.updateOne(
      { _id: categoryId },
      {
        destroy: true
      },
      {
        new: true
      }
    )
    if (!categoryUpdated) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Danh mục sản phẩm không tồn tại.'
      )
    }
    return categoryUpdated
  } catch (err) {
    throw err
  }
}

export const categoriesService = {
  createCategory,
  getCategoryList,
  getCategory,
  updateCategory,
  deleteCategory
}
