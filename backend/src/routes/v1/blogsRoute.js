import express from 'express'

import { blogsValidation } from '~/validations/blogsValidation'
import { blogsController } from '~/controllers/blogsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tạo Màu sắc sản phẩm mới
Router.route('/').post(
  authMiddleware.isAuthorized,
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
  blogsValidation.verifyId,
  blogsValidation.blog,
  blogsController.updateBlog
)

// Xoá Màu sắc sản phẩm (Xóa mềm)
Router.route('/:blogId').delete(
  authMiddleware.isAuthorized,
  blogsValidation.verifyId,
  blogsController.deleteBlog
)

export const blogsRoute = Router
