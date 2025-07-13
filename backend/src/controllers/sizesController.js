import { StatusCodes } from 'http-status-codes'

import { sizesService } from '~/services/sizesService'

const createSize = async (req, res, next) => {
  try {
    const result = await sizesService.createSize(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getSizeList = async (req, res, next) => {
  try {
    const queryString = req.query

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await sizesService.getSizeList(queryString)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getSize = async (req, res, next) => {
  try {
    const sizeId = req.params.sizeId

    const result = await sizesService.getSize(sizeId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateSize = async (req, res, next) => {
  try {
    const sizeId = req.params.sizeId

    const result = await sizesService.updateSize(sizeId, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteSize = async (req, res, next) => {
  try {
    const sizeId = req.params.sizeId

    const result = await sizesService.deleteSize(sizeId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const restoreSize = async (req, res, next) => {
  try {
    const sizeId = req.params.sizeId

    const result = await sizesService.restoreSize(sizeId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const sizesController = {
  createSize,
  getSizeList,
  getSize,
  updateSize,
  deleteSize,
  restoreSize
}
