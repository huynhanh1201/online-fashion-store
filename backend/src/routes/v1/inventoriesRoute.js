import express from 'express'

import { inventoriesValidation } from '~/validations/inventoriesValidation'
import { inventoriesController } from '~/controllers/inventoriesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Danh sách Kho (Biến thể) sản phẩm
Router.route('/').get(inventoriesController.getInventoryList)

// Lấy thông tin một Kho (Biến thể) sản phẩm.
Router.route('/:inventoryId').get(
  inventoriesValidation.verifyId,
  inventoriesController.getInventory
)

// Cập nhật thông tin Kho (Biến thể) sản phẩm
Router.route('/:inventoryId').patch(
  inventoriesValidation.verifyId,
  inventoriesValidation.inventory,
  inventoriesController.updateInventory
)

// Xoá Kho (Biến thể) sản phẩm (Xóa mềm)
Router.route('/:inventoryId').delete(
  inventoriesValidation.verifyId,
  inventoriesController.deleteInventory
)

export const inventoriesRoute = Router
