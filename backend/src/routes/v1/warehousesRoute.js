import express from 'express'

import { warehousesValidation } from '~/validations/warehousesValidation'
import { warehousesController } from '~/controllers/warehousesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  warehousesValidation.warehouse,
  warehousesController.createWarehouse
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(warehousesController.getWarehouseList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:warehouseId').get(
  warehousesValidation.verifyId,
  warehousesController.getWarehouse
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:warehouseId').patch(
  warehousesValidation.verifyId,
  warehousesValidation.warehouse,
  warehousesController.updateWarehouse
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:warehouseId').delete(
  warehousesValidation.verifyId,
  warehousesController.deleteWarehouse
)

export const warehousesRoute = Router
