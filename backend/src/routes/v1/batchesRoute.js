import express from 'express'

import { batchesValidation } from '~/validations/batchesValidation'
import { batchesController } from '~/controllers/batchesController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { rbacMiddleware } from '~/middlewares/rbacMiddleware'

const Router = express.Router()

// Danh sách Kho (Biến thể) sản phẩm
Router.route('/').get(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['batch:use']),
  batchesController.getBatchList
)

// Lấy thông tin một Kho (Biến thể) sản phẩm.
Router.route('/:batchId').get(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['batch:read']),
  batchesValidation.verifyId,
  batchesController.getBatch
)

// Cập nhật thông tin Kho (Biến thể) sản phẩm
Router.route('/:batchId').patch(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['batch:update']),
  batchesValidation.verifyId,
  batchesValidation.batch,
  batchesController.updateBatch
)

// Xoá Kho (Biến thể) sản phẩm (Xóa mềm)
Router.route('/:batchId').delete(
  authMiddleware.isAuthorized,
  batchesValidation.verifyId,
  batchesController.deleteBatch
)

export const batchesRoute = Router
