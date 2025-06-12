import { StatusCodes } from 'http-status-codes'

import { inventoriesService } from '~/services/inventoriesService'

const getInventoryList = async (req, res, next) => {
  try {
    const querySting = req.query

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await inventoriesService.getInventoryList(querySting)

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

export const inventoriesController = {
  getInventoryList,
  getInventory,
  updateInventory,
  deleteInventory
}
