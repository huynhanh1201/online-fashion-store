import express from 'express'

import { inventoriesValidation } from '~/validations/inventoriesValidation'
import { inventoriesController } from '~/controllers/inventoriesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Danh sách Kho (Biến thể) sản phẩm
Router.route('/').get(
  authMiddleware.isAuthorized,
  inventoriesController.getInventoryList
)

// Lấy thông tin một Kho (Biến thể) sản phẩm.
Router.route('/:inventoryId').get(
  authMiddleware.isAuthorized,
  inventoriesValidation.verifyId,
  inventoriesController.getInventory
)

// Cập nhật thông tin Kho (Biến thể) sản phẩm
Router.route('/:inventoryId').patch(
  authMiddleware.isAuthorized,
  inventoriesValidation.verifyId,
  inventoriesValidation.inventory,
  inventoriesController.updateInventory
)

// Xoá Kho (Biến thể) sản phẩm (Xóa mềm)
Router.route('/:inventoryId').delete(
  authMiddleware.isAuthorized,
  inventoriesValidation.verifyId,
  inventoriesController.deleteInventory
)

export const inventoriesRoute = Router
