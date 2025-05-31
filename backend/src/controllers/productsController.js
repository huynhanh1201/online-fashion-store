import { StatusCodes } from 'http-status-codes'

import { productsService } from '~/services/productsService'

const createProduct = async (req, res, next) => {
  try {
    // Lấy Danh mục sản phẩm mới tạo từ tầng Service chuyển qua
    const result = await productsService.createProduct(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getProductList = async (req, res, next) => {
  try {
    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await productsService.getProductList(req.query)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId

    const result = await productsService.getProduct(productId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId

    const result = await productsService.updateProduct(productId, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId

    const result = await productsService.deleteProduct(productId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getListProductOfCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId

    const result = await productsService.getListProductOfCategory(categoryId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getVariantOfProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId

    const result = await productsService.getVariantOfProduct(productId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const productsController = {
  createProduct,
  getProductList,
  getProduct,
  updateProduct,
  deleteProduct,
  getListProductOfCategory,
  getVariantOfProduct
}
