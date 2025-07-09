import { StatusCodes } from 'http-status-codes'

import { batchesService } from '~/services/batchesService'

const getBatchList = async (req, res, next) => {
  try {
    const queryString = req.query

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await batchesService.getBatchList(queryString)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getBatch = async (req, res, next) => {
  try {
    const batchId = req.params.batchId

    const result = await batchesService.getBatch(batchId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateBatch = async (req, res, next) => {
  try {
    const batchId = req.params.batchId

    const result = await batchesService.updateBatch(batchId, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteBatch = async (req, res, next) => {
  try {
    const batchId = req.params.batchId

    const result = await batchesService.deleteBatch(batchId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const batchesController = {
  getBatchList,
  getBatch,
  updateBatch,
  deleteBatch
}
