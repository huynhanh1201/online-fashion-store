import express from 'express'

import { inventoriesValidation } from '~/validations/inventoriesValidation'
import { inventoriesController } from '~/controllers/inventoriesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Kho (Biến thể) sản phẩm mới
Router.route('/').post(
  inventoriesValidation.inventory,
  inventoriesController.createInventory
)

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
  inventoriesValidation.inventoryUpdate,
  inventoriesController.updateInventory
)

// Xoá Kho (Biến thể) sản phẩm (Xóa mềm)
Router.route('/:inventoryId').delete(
  inventoriesValidation.verifyId,
  inventoriesController.deleteInventory
)

// Nhập Kho (Biến thể) sản phẩm
Router.route('/:inventoryId/in').post(
  inventoriesValidation.verifyId,
  inventoriesValidation.inventoryInOutStock,
  inventoriesController.importStockInventory
)

// Xuất Kho (Biến thể) sản phẩm
Router.route('/:inventoryId/out').post(
  inventoriesValidation.verifyId,
  inventoriesValidation.inventoryInOutStock,
  inventoriesController.exportStockInventory
)

export const inventoriesRoute = Router
