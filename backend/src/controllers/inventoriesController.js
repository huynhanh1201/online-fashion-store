import { StatusCodes } from 'http-status-codes'

import { inventoriesService } from '~/services/inventoriesService'

const createInventory = async (req, res, next) => {
  try {
    const result = await inventoriesService.createInventory(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getInventoryList = async (req, res, next) => {
  try {
    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await inventoriesService.getInventoryList()

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getInventory = async (req, res, next) => {
  try {
    const inventoryId = req.params.inventoryId

    const result = await inventoriesService.getInventory(inventoryId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateInventory = async (req, res, next) => {
  try {
    const inventoryId = req.params.inventoryId

    const result = await inventoriesService.updateInventory(
      inventoryId,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteInventory = async (req, res, next) => {
  try {
    const inventoryId = req.params.inventoryId

    const result = await inventoriesService.deleteInventory(inventoryId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const importStockInventory = async (req, res, next) => {
  try {
    const inventoryId = req.params.inventoryId

    const result = await inventoriesService.importStockInventory(
      inventoryId,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const exportStockInventory = async (req, res, next) => {
  try {
    const inventoryId = req.params.inventoryId

    const result = await inventoriesService.exportStockInventory(
      inventoryId,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const inventoriesController = {
  createInventory,
  getInventoryList,
  getInventory,
  updateInventory,
  deleteInventory,
  importStockInventory,
  exportStockInventory
}
