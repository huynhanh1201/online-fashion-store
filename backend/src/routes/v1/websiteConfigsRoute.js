import express from 'express'

import { websiteConfigsValidation } from '~/validations/websiteConfigsValidation'
import { websiteConfigsController } from '~/controllers/websiteConfigsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  websiteConfigsValidation.websiteConfig,
  websiteConfigsController.createWebsiteConfig
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(websiteConfigsController.getWebsiteConfigList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:websiteConfigId').get(
  websiteConfigsValidation.verifyId,
  websiteConfigsController.getWebsiteConfig
)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:websiteConfigId').patch(
  websiteConfigsValidation.verifyId,
  websiteConfigsValidation.websiteConfig,
  websiteConfigsController.updateWebsiteConfig
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:websiteConfigId').delete(
  websiteConfigsValidation.verifyId,
  websiteConfigsController.deleteWebsiteConfig
)

export const websiteConfigsRoute = Router
