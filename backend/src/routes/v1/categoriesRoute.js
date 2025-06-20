import express from 'express'

import { categoriesValidation } from '~/validations/categoriesValidation'
import { categoriesController } from '~/controllers/categoriesController'
import { authMiddleware } from '~/middlewares/authMiddleware'

import { rbacMiddleware } from '~/middlewares/rbacMiddleware'

const Router = express.Router()

// Tạo Danh mục sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  // rbacMiddleware.isValidPermission(['category:create']),
  categoriesValidation.category,
  categoriesController.createCategory
)

// Danh sách Danh mục sản phẩm
Router.route('/').get(categoriesController.getCategoryList)

// Lấy thông tin một Danh mục sản phẩm.
Router.route('/:categoryId').get(
  categoriesValidation.verifyId,
  categoriesController.getCategory
)

// Cập nhật thông tin Danh mục sản phẩm
Router.route('/:categoryId').patch(
  categoriesValidation.verifyId,
  categoriesValidation.category,
  categoriesController.updateCategory
)

// Xoá Danh mục sản phẩm (Xóa mềm)
Router.route('/:categoryId').delete(
  categoriesValidation.verifyId,
  categoriesController.deleteCategory
)

export const categoriesRoute = Router
