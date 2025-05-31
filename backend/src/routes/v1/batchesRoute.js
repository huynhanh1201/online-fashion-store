import express from 'express'

import { batchesValidation } from '~/validations/batchesValidation'
import { batchesController } from '~/controllers/batchesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Danh sách Kho (Biến thể) sản phẩm
Router.route('/').get(batchesController.getBatchList)

// Lấy thông tin một Kho (Biến thể) sản phẩm.
Router.route('/:batchId').get(
  batchesValidation.verifyId,
  batchesController.getBatch
)

// Cập nhật thông tin Kho (Biến thể) sản phẩm
Router.route('/:batchId').patch(
  batchesValidation.verifyId,
  batchesValidation.batch,
  batchesController.updateBatch
)

// Xoá Kho (Biến thể) sản phẩm (Xóa mềm)
Router.route('/:batchId').delete(
  batchesValidation.verifyId,
  batchesController.deleteBatch
)

export const batchesRoute = Router
