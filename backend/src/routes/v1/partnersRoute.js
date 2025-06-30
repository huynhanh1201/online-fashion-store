import express from 'express'

import { partnersValidation } from '~/validations/partnersValidation'
import { partnersController } from '~/controllers/partnersController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { usersController } from '~/controllers/usersController'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  partnersValidation.partner,
  partnersController.createPartner
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(
  authMiddleware.isAuthorized,
  partnersController.getPartnerList
)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:partnerId').get(
  authMiddleware.isAuthorized,
  partnersValidation.verifyId,
  partnersController.getPartner
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:partnerId').patch(
  authMiddleware.isAuthorized,
  partnersValidation.verifyId,
  partnersValidation.partner,
  partnersController.updatePartner
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:partnerId').delete(
  authMiddleware.isAuthorized,
  partnersValidation.verifyId,
  partnersController.deletePartner
)

// Khôi phục đã xóa
Router.route('/restore/:partnerId').patch(
  authMiddleware.isAuthorized,
  partnersController.restorePartner
)

export const partnersRoute = Router
