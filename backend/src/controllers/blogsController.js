import { StatusCodes } from 'http-status-codes'

import { blogsService } from '~/services/blogsService'

const createBlog = async (req, res, next) => {
  try {
    const jwtDecoded = req.jwtDecoded

    const result = await blogsService.createBlog(req.body, jwtDecoded)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getBlogList = async (req, res, next) => {
  try {
    const queryString = req.query

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await blogsService.getBlogList(queryString)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getBlog = async (req, res, next) => {
  try {
    const blogId = req.params.blogId

    const result = await blogsService.getBlog(blogId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateBlog = async (req, res, next) => {
  try {
    const blogId = req.params.blogId

    const result = await blogsService.updateBlog(blogId, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteBlog = async (req, res, next) => {
  try {
    const blogId = req.params.blogId

    const result = await blogsService.deleteBlog(blogId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const restoreBlog = async (req, res, next) => {
  try {
    const blogId = req.params.blogId

    const result = await blogsService.restoreBlog(blogId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const blogsController = {
  createBlog,
  getBlogList,
  getBlog,
  updateBlog,
  deleteBlog,
  restoreBlog
}
