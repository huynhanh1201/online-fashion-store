import { StatusCodes } from 'http-status-codes'

import { variantsService } from '~/services/variantsService'

const createVariant = async (req, res, next) => {
  try {
    const result = await variantsService.createVariant(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getVariantList = async (req, res, next) => {
  try {
    const queryString = req.query

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await variantsService.getVariantList(queryString)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getVariant = async (req, res, next) => {
  try {
    const variantId = req.params.variantId

    const result = await variantsService.getVariant(variantId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateVariant = async (req, res, next) => {
  try {
    const variantId = req.params.variantId

    const result = await variantsService.updateVariant(variantId, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteVariant = async (req, res, next) => {
  try {
    const variantId = req.params.variantId

    const result = await variantsService.deleteVariant(variantId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const variantsController = {
  createVariant,
  getVariantList,
  getVariant,
  updateVariant,
  deleteVariant
}
