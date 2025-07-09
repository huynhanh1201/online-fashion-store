import express from 'express'

import { warehouseSlipsValidation } from '~/validations/warehouseSlipsValidation'
import { warehouseSlipsController } from '~/controllers/warehouseSlipsController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { rbacMiddleware } from '~/middlewares/rbacMiddleware'

const Router = express.Router()

// Tạo Kho (Biến thể) sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['warehouseSlip:create']),
  warehouseSlipsValidation.warehouseSlip,
  warehouseSlipsController.createWarehouseSlip
)

// Danh sách Kho (Biến thể) sản phẩm
Router.route('/').get(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['warehouseSlip:use']),
  warehouseSlipsController.getWarehouseSlipList
)

// Lấy thông tin một Kho (Biến thể) sản phẩm.
Router.route('/:warehouseSlipId').get(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['warehouseSlip:read']),
  warehouseSlipsValidation.verifyId,
  warehouseSlipsController.getWarehouseSlip
)

// Cập nhật thông tin Kho (Biến thể) sản phẩm
Router.route('/:warehouseSlipId').patch(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['warehouseSlip:update']),
  warehouseSlipsValidation.verifyId,
  warehouseSlipsValidation.warehouseSlipUpdate,
  warehouseSlipsController.updateWarehouseSlip
)

// Xoá Kho (Biến thể) sản phẩm (Xóa mềm)
Router.route('/:warehouseSlipId').delete(
  authMiddleware.isAuthorized,
  warehouseSlipsValidation.verifyId,
  warehouseSlipsController.deleteWarehouseSlip
)

export const warehouseSlipsRoute = Router
