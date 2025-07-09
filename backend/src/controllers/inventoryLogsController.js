import { StatusCodes } from 'http-status-codes'

import { inventoryLogsService } from '~/services/inventoryLogsService'

const createInventoryLog = async (req, res, next) => {
  try {
    const result = await inventoryLogsService.createInventoryLog(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getInventoryLogList = async (req, res, next) => {
  try {
    const queryString = req.query
    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await inventoryLogsService.getInventoryLogList(queryString)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getInventoryLog = async (req, res, next) => {
  try {
    const inventoryLogId = req.params.inventoryLogId

    const result = await inventoryLogsService.getInventoryLog(inventoryLogId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateInventoryLog = async (req, res, next) => {
  try {
    const inventoryLogId = req.params.inventoryLogId

    const result = await inventoryLogsService.updateInventoryLog(
      inventoryLogId,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteInventoryLog = async (req, res, next) => {
  try {
    const inventoryLogId = req.params.inventoryLogId

    const result = await inventoryLogsService.deleteInventoryLog(inventoryLogId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const inventoryLogsController = {
  createInventoryLog,
  getInventoryLogList,
  getInventoryLog,
  updateInventoryLog,
  deleteInventoryLog
}
