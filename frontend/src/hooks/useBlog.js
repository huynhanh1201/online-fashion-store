import React from 'react'
import {
  getPublicBlogs,
  getPublicBlogById,
  getLatestBlogs,
  getBlogsByCategory
} from '~/services/blogService.js'

const useBlog = () => {
  const [blogs, setBlogs] = React.useState([])
  const [currentBlog, setCurrentBlog] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [totalPages, setTotalPages] = React.useState(0)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)

  // Lấy danh sách blogs
  const fetchBlogs = React.useCallback(async (filters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const response = await getPublicBlogs(filters)

      setBlogs(response.data || [])
      setTotalPages(response.meta?.totalPages || 0)
      setCurrentPage(response.meta?.currentPage || 1)
      setTotal(response.meta?.total || 0)

      return response.data || []
    } catch (err) {
      console.error('Error fetching blogs:', err)
      setError('Không thể tải danh sách bài viết')
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Lấy blog theo ID
  const fetchBlogById = React.useCallback(async (blogId) => {
    try {
      setLoading(true)
      setError(null)

      const response = await getPublicBlogById(blogId)
      console.log('API Response:', response)

      // Handle both direct data and wrapped response
      const blogData = response?.data || response
      console.log('Blog Data:', blogData)

      setCurrentBlog(blogData)
      return blogData
    } catch (err) {
      console.error('Error fetching blog by ID:', err)
      setError('Không thể tải bài viết')
      setCurrentBlog(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Lấy blogs mới nhất
  const fetchLatestBlogs = React.useCallback(async (limit = 6) => {
    try {
      setLoading(true)
      setError(null)

      const response = await getLatestBlogs(limit)

      setBlogs(response.data || [])
      setTotal(response.meta?.total || 0)

      return response.data || []
    } catch (err) {
      console.error('Error fetching latest blogs:', err)
      setError('Không thể tải bài viết mới nhất')
      setBlogs([])
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Lấy blogs theo category
  const fetchBlogsByCategory = async (category, filters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const response = await getBlogsByCategory(category, filters)

      setBlogs(response.data || [])
      setTotalPages(response.meta?.totalPages || 0)
      setCurrentPage(response.meta?.currentPage || 1)
      setTotal(response.meta?.total || 0)

      return response.data || []
    } catch (err) {
      console.error('Error fetching blogs by category:', err)
      setError('Không thể tải bài viết theo danh mục')
      setBlogs([])
      return []
    } finally {
      setLoading(false)
    }
  }

  // Fetch blogs with pagination for "Load More" functionality
  const fetchBlogsWithPagination = React.useCallback(async (page = 1, limit = 6) => {
    try {
      setError(null)

      const response = await getPublicBlogs({ page, limit })

      const newBlogs = response.data || []
      const totalPages = response.meta?.totalPages || 0
      const total = response.meta?.total || 0

      return {
        blogs: newBlogs,
        totalPages,
        total,
        hasMore: page < totalPages
      }
    } catch (err) {
      console.error('Error fetching blogs with pagination:', err)
      setError('Không thể tải thêm bài viết')
      return {
        blogs: [],
        totalPages: 0,
        total: 0,
        hasMore: false
      }
    }
  }, [])

  // Append more blogs to existing list
  const appendBlogs = React.useCallback((newBlogs) => {
    setBlogs(prevBlogs => [...prevBlogs, ...newBlogs])
  }, [])

  // Reset state
  const resetBlogState = () => {
    setBlogs([])
    setCurrentBlog(null)
    setError(null)
    setTotalPages(0)
    setCurrentPage(1)
    setTotal(0)
  }

  return {
    // State
    blogs,
    currentBlog,
    loading,
    error,
    totalPages,
    currentPage,
    total,

    // Actions
    fetchBlogs,
    fetchBlogById,
    fetchLatestBlogs,
    fetchBlogsByCategory,
    fetchBlogsWithPagination,
    appendBlogs,
    resetBlogState
  }
}

export default useBlog