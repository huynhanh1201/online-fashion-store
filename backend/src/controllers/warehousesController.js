import { StatusCodes } from 'http-status-codes'

import { warehousesService } from '~/services/warehousesService'

const createWarehouse = async (req, res, next) => {
  try {
    const result = await warehousesService.createWarehouse(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getWarehouseList = async (req, res, next) => {
  try {
    const queryString = req.query

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await warehousesService.getWarehouseList(queryString)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getWarehouse = async (req, res, next) => {
  try {
    const warehouseId = req.params.warehouseId

    const result = await warehousesService.getWarehouse(warehouseId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateWarehouse = async (req, res, next) => {
  try {
    const warehouseId = req.params.warehouseId

    const result = await warehousesService.updateWarehouse(
      warehouseId,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteWarehouse = async (req, res, next) => {
  try {
    const warehouseId = req.params.warehouseId

    const result = await warehousesService.deleteWarehouse(warehouseId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const warehousesController = {
  createWarehouse,
  getWarehouseList,
  getWarehouse,
  updateWarehouse,
  deleteWarehouse
}
