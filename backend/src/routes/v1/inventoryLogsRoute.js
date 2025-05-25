import express from 'express'

import { inventoryLogsValidation } from '~/validations/inventoryLogsValidation'
import { inventoryLogsController } from '~/controllers/inventoryLogsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  inventoryLogsValidation.inventoryLog,
  inventoryLogsController.createInventoryLog
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(inventoryLogsController.getInventoryLogList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:inventoryLogId').get(
  inventoryLogsValidation.verifyId,
  inventoryLogsController.getInventoryLog
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:inventoryLogId').patch(
  inventoryLogsValidation.verifyId,
  inventoryLogsValidation.inventoryLog,
  inventoryLogsController.updateInventoryLog
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:inventoryLogId').delete(
  inventoryLogsValidation.verifyId,
  inventoryLogsController.deleteInventoryLog
)

export const inventoryLogsRoute = Router
