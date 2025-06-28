import { StatusCodes } from 'http-status-codes'

import { categoriesService } from '~/services/categoriesService'

const createCategory = async (req, res, next) => {
  try {
    // Lấy Danh mục sản phẩm mới tạo từ tầng Service chuyển qua
    const result = await categoriesService.createCategory(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getCategoryList = async (req, res, next) => {
  try {
    const queryString = req.query
    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await categoriesService.getCategoryList(queryString)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId

    const result = await categoriesService.getCategory(categoryId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getCategoryBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug

    const result = await categoriesService.getCategoryBySlug(slug)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId

    const result = await categoriesService.updateCategory(categoryId, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId

    const result = await categoriesService.deleteCategory(categoryId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const categoriesController = {
  createCategory,
  getCategoryList,
  getCategory,
  getCategoryBySlug,
  updateCategory,
  deleteCategory
}
