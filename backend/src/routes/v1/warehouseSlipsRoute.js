import express from 'express'

import { warehouseSlipsValidation } from '~/validations/warehouseSlipsValidation'
import { warehouseSlipsController } from '~/controllers/warehouseSlipsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Kho (Biến thể) sản phẩm mới
Router.route('/').post(
  warehouseSlipsValidation.warehouseSlip,
  warehouseSlipsController.createWarehouseSlip
)

// Danh sách Kho (Biến thể) sản phẩm
Router.route('/').get(warehouseSlipsController.getWarehouseSlipList)

// Lấy thông tin một Kho (Biến thể) sản phẩm.
Router.route('/:warehouseSlipId').get(
  warehouseSlipsValidation.verifyId,
  warehouseSlipsController.getWarehouseSlip
)

// Cập nhật thông tin Kho (Biến thể) sản phẩm
Router.route('/:warehouseSlipId').patch(
  warehouseSlipsValidation.verifyId,
  warehouseSlipsValidation.warehouseSlipUpdate,
  warehouseSlipsController.updateWarehouseSlip
)

// Xoá Kho (Biến thể) sản phẩm (Xóa mềm)
Router.route('/:warehouseSlipId').delete(
  warehouseSlipsValidation.verifyId,
  warehouseSlipsController.deleteWarehouseSlip
)

// Nhập Kho (Biến thể) sản phẩm
Router.route('/:warehouseSlipId/in').post(
  authMiddleware.isAuthorized,
  warehouseSlipsValidation.verifyId,
  warehouseSlipsValidation.warehouseSlipInOutStock,
  warehouseSlipsController.importStockWarehouseSlip
)

// Xuất Kho (Biến thể) sản phẩm
Router.route('/:warehouseSlipId/out').post(
  authMiddleware.isAuthorized,
  warehouseSlipsValidation.verifyId,
  warehouseSlipsValidation.warehouseSlipInOutStock,
  warehouseSlipsController.exportStockWarehouseSlip
)

export const warehouseSlipsRoute = Router
