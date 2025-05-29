import { StatusCodes } from 'http-status-codes'

import { warehouseSlipsService } from '~/services/warehouseSlipsService'

const createWarehouseSlip = async (req, res, next) => {
  try {
    const jwtDecoded = req.jwtDecoded

    const result = await warehouseSlipsService.createWarehouseSlip(
      req.body,
      jwtDecoded
    )

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getWarehouseSlipList = async (req, res, next) => {
  try {
    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await warehouseSlipsService.getWarehouseSlipList()

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getWarehouseSlip = async (req, res, next) => {
  try {
    const warehouseSlipId = req.params.warehouseSlipId

    const result = await warehouseSlipsService.getWarehouseSlip(warehouseSlipId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateWarehouseSlip = async (req, res, next) => {
  try {
    const warehouseSlipId = req.params.warehouseSlipId

    const result = await warehouseSlipsService.updateWarehouseSlip(
      warehouseSlipId,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteWarehouseSlip = async (req, res, next) => {
  try {
    const warehouseSlipId = req.params.warehouseSlipId

    const result =
      await warehouseSlipsService.deleteWarehouseSlip(warehouseSlipId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const warehouseSlipsController = {
  createWarehouseSlip,
  getWarehouseSlipList,
  getWarehouseSlip,
  updateWarehouseSlip,
  deleteWarehouseSlip
}
