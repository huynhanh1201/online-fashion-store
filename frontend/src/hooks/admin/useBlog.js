import React, { useState } from 'react'
import {
  getBlogs,
  updateBlog,
  deleteBlog,
  createBlog,
  RestoreBlog
} from '~/services/admin/blogService.js'

const useBlog = () => {
  const [blogs, setBlogs] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [totalPages, setTotalPages] = React.useState(0)
  const [ROWS_PER_PAGE, setROWS_PER_PAGE] = useState(10)
  const fetchBlogs = async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true)
      const buildQuery = (input) => {
        const query = { page, limit, ...input }
        Object.keys(query).forEach((key) => {
          if (
            query[key] === '' ||
            query[key] === undefined ||
            query[key] === null
          ) {
            delete query[key]
          }
        })
        return query
      }
      const query = buildQuery(filters)
      const response = await getBlogs(query)

      // Filter out policies (blogs with type='policy')
      const filteredBlogs = response.blogs.filter(
        (blog) => blog.type !== 'policy'
      )

      setBlogs(filteredBlogs)
      setTotalPages(response.total)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }
  const addBlog = async (data, filters = {}) => {
    try {
      const newBlog = await createBlog(data)
      if (!newBlog) {
        console.error('Tạo blog thất bại')
        return null
      }

      // Chỉ thêm vào state nếu không phải là policy
      if (newBlog.type !== 'policy') {
        setBlogs((prev) => {
          const sort = filters?.sort
          let updated = [...prev]

          if (sort === 'newest') {
            updated = [newBlog, ...prev].slice(0, ROWS_PER_PAGE)
          } else if (sort === 'oldest') {
            if (prev.length < ROWS_PER_PAGE) {
              updated = [...prev, newBlog]
            }
          } else {
            updated = [newBlog, ...prev].slice(0, ROWS_PER_PAGE)
          }

          return updated
        })

        setTotalPages((prev) => prev + 1)
      }

      return newBlog
    } catch (err) {
      console.error('Lỗi khi thêm blog:', err)
      return null
    }
  }

  const updateBlogById = async (id, data) => {
    try {
      const updated = await updateBlog(id, data)
      if (!updated) {
        console.error('Cập nhật blog thất bại')
        return null
      }

      // Nếu blog được cập nhật thành policy, loại khỏi danh sách
      if (updated.type === 'policy') {
        setBlogs((prev) => prev.filter((b) => b._id !== updated._id))
        setTotalPages((prev) => Math.max(1, prev - 1))
      } else {
        setBlogs((prev) =>
          prev.map((b) => (b._id === updated._id ? updated : b))
        )
      }

      return updated
    } catch (err) {
      console.error('Lỗi khi cập nhật blog:', err)
      return null
    }
  }

  const removeBlog = async (id) => {
    try {
      const result = await deleteBlog(id)
      if (!result) {
        console.error('Xoá blog thất bại')
        return null
      }
      setBlogs((prev) => prev.filter((b) => b._id !== id))
      setTotalPages((prev) => Math.max(1, prev - 1))
      return true
    } catch (err) {
      console.error('Lỗi khi xoá blog:', err)
      return false
    }
  }

  const restore = async (id) => {
    try {
      const restored = await RestoreBlog(id)
      if (!restored) {
        console.error('Khôi phục blog thất bại')
        return null
      }
      setBlogs((prev) => prev.filter((b) => b._id !== id))
      setTotalPages((prev) => Math.max(1, prev - 1))
      return restored
    } catch (err) {
      console.error('Lỗi khi khôi phục blog:', err)
      return null
    }
  }

  return {
    ROWS_PER_PAGE,
    setROWS_PER_PAGE,
    blogs,
    loading,
    totalPages,
    fetchBlogs,
    addBlog,
    removeBlog,
    updateBlogById,
    restore
  }
}

export default useBlog
