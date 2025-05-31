import express from 'express'

import { partnersValidation } from '~/validations/partnersValidation'
import { partnersController } from '~/controllers/partnersController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  partnersValidation.partner,
  partnersController.createPartner
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(partnersController.getPartnerList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:partnerId').get(
  partnersValidation.verifyId,
  partnersController.getPartner
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:partnerId').patch(
  partnersValidation.verifyId,
  partnersValidation.partner,
  partnersController.updatePartner
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:partnerId').delete(
  partnersValidation.verifyId,
  partnersController.deletePartner
)

export const partnersRoute = Router
