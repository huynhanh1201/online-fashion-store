import express from 'express'

import { blogsValidation } from '~/validations/blogsValidation'
import { blogsController } from '~/controllers/blogsController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { rbacMiddleware } from '~/middlewares/rbacMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['blog:create']),
  blogsValidation.blog,
  blogsController.createBlog
)

// Danh sách Màu sắc sản phẩm
Router.route('/').get(blogsController.getBlogList)

// Lấy thông tin một Màu sắc sản phẩm.
Router.route('/:blogId').get(blogsValidation.verifyId, blogsController.getBlog)

// Cập nhật thông tin Màu sắc sản phẩm
Router.route('/:blogId').patch(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['blog:update']),
  blogsValidation.verifyId,
  blogsValidation.blog,
  blogsController.updateBlog
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:blogId').delete(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['blog:delete']),
  blogsValidation.verifyId,
  blogsController.deleteBlog
)

// Khôi phục đã xóa
Router.route('/restore/:blogId').patch(
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission(['blog:update']),
  blogsController.restoreBlog
)

export const blogsRoute = Router
