import { StatusCodes } from 'http-status-codes'

import { CategoryModel } from '~/models/CategoryModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { ProductModel } from '~/models/ProductModel'
import mongoose from 'mongoose'
import apiError from '~/utils/ApiError'

const createCategory = async (reqBody) => {
  try {
    const newCategory = {
      name: reqBody.name,
      description: reqBody.description,
      slug: slugify(reqBody.name),
      destroy: false
    }

    const category = await CategoryModel.create(newCategory)

    return category
  } catch (err) {
    throw new ApiError(StatusCodes.CONFLICT, 'Danh mục sản phẩm đã tồn tại!')
  }
}

const getCategoryList = async (queryString) => {
  let { page = 1, limit = 10, status, sort } = queryString

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

  // Xử lý thông tin Filter
  const filter = {}

  if (status === 'true' || status === 'false') {
    status = JSON.parse(status)

    filter.destroy = status
  }

  const sortMap = {
    name_asc: { name: 1 },
    name_desc: { name: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 }
  }

  let sortFiled = null

  if (sort) {
    sortFiled = sortMap[sort]
  }

  const result = await CategoryModel.find(filter)
    .collation({ locale: 'vi', strength: 1 })
    .sort(sortFiled || {})
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

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

    return updatedCategory
  } catch (err) {
    throw err
  }
}

const deleteCategory = async (categoryId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const isProductExist = await ProductModel.exists({
      categoryId: categoryId,
      destroy: false
    })

    if (isProductExist) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Không thể xóa DANH MỤC SẢN PHẨM khi vẫn còn SẢN PHẨM hoạt động.'
      )
    }

    const categoryUpdated = await CategoryModel.findOneAndUpdate(
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
