import express from 'express'

import { warehousesValidation } from '~/validations/warehousesValidation'
import { warehousesController } from '~/controllers/warehousesController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { rbacMiddleware } from '~/middlewares/rbacMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['warehouse:create']),
  warehousesValidation.warehouse,
  warehousesController.createWarehouse
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['warehouse:use']),
  warehousesController.getWarehouseList
)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:warehouseId').get(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['warehouse:read']),
  warehousesValidation.verifyId,
  warehousesController.getWarehouse
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:warehouseId').patch(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['warehouse:update']),
  warehousesValidation.verifyId,
  warehousesValidation.warehouse,
  warehousesController.updateWarehouse
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:warehouseId').delete(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['warehouse:delete']),
  warehousesValidation.verifyId,
  warehousesController.deleteWarehouse
)

export const warehousesRoute = Router
