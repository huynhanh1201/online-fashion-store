import express from 'express'

import { inventoriesValidation } from '~/validations/inventoriesValidation'
import { inventoriesController } from '~/controllers/inventoriesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  inventoriesValidation.inventory,
  inventoriesController.createInventory
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(inventoriesController.getInventoryList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:inventoryId').get(
  inventoriesValidation.verifyId,
  inventoriesController.getInventory
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:inventoryId').patch(
  inventoriesValidation.verifyId,
  inventoriesValidation.inventory,
  inventoriesController.updateInventory
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:inventoryId').delete(
  inventoriesValidation.verifyId,
  inventoriesController.deleteInventory
)

export const inventoriesRoute = Router
