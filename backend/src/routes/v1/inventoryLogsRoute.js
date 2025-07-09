import express from 'express'

import { inventoryLogsValidation } from '~/validations/inventoryLogsValidation'
import { inventoryLogsController } from '~/controllers/inventoryLogsController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { rbacMiddleware } from '~/middlewares/rbacMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  inventoryLogsValidation.inventoryLog,
  inventoryLogsController.createInventoryLog
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['inventoryLog:use']),
  inventoryLogsController.getInventoryLogList
)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:inventoryLogId').get(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['inventoryLog:read']),
  inventoryLogsValidation.verifyId,
  inventoryLogsController.getInventoryLog
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:inventoryLogId').patch(
  authMiddleware.isAuthorized,
  inventoryLogsValidation.verifyId,
  inventoryLogsValidation.inventoryLog,
  inventoryLogsController.updateInventoryLog
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:inventoryLogId').delete(
  authMiddleware.isAuthorized,
  inventoryLogsValidation.verifyId,
  inventoryLogsController.deleteInventoryLog
)

export const inventoryLogsRoute = Router
