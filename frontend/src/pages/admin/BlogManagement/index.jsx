import React, { useState, useEffect } from 'react'
import {
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Box
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'react-toastify'
import BlogTable from './BlogTable'
import BlogModal from './modal/AddBlogModal'
import ViewBlogModal from './modal/ViewBlogModal'
import DeleteBlogModal from './modal/DeleteBlogModal'
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog
} from '~/services/admin/blogService'

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openBlogModal, setOpenBlogModal] = useState(false)
  const [blogModalMode, setBlogModalMode] = useState('add') // 'add' hoặc 'edit'
  const [openView, setOpenView] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [filters, setFilters] = React.useState(() => ({
    status: 'false',
    sort: 'newest'
  }))
  // Fetch blogs từ API
  const fetchBlogs = async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await getBlogs(page, limit, filters)
      console.log(response.data)
      setBlogs(response.blogs)
    } catch (error) {
      console.error('Lỗi khi tải danh sách blog:', error)
      setError('Không thể tải danh sách blog. Vui lòng thử lại.')
      toast.error('Không thể tải danh sách blog')
    } finally {
      setLoading(false)
    }
  }

  // Load blogs khi component mount
  useEffect(() => {
    fetchBlogs(page, limit, filters)
  }, [page, limit, filters])

  const handleBlogSave = async (blogData, isEditMode) => {
    try {
      if (isEditMode) {
        // Cập nhật blog
        const updatedBlog = await updateBlog(selectedBlog._id, blogData)
        toast.success('Cập nhật blog thành công!')
      } else {
        // Tạo blog mới
        const createdBlog = await createBlog(blogData)
        toast.success('Tạo blog thành công!')
      }

      setOpenBlogModal(false)
      setSelectedBlog(null)
      setBlogModalMode('add')
      // Refresh lại danh sách để đảm bảo dữ liệu mới nhất
      fetchBlogs(page, limit, filters)
    } catch (error) {
      console.error('Lỗi khi xử lý blog:', error)
      if (isEditMode) {
        toast.error('Không thể cập nhật blog. Vui lòng thử lại.')
      } else {
        toast.error('Không thể tạo blog. Vui lòng thử lại.')
      }
    }
  }

  const handleDelete = async () => {
    try {
      await deleteBlog(selectedBlog._id)
      toast.success('Xóa blog thành công!')
      setOpenDelete(false)
      setSelectedBlog(null)
      // Refresh lại danh sách
      fetchBlogs(page, limit, filters)
    } catch (error) {
      console.error('Lỗi khi xóa blog:', error)
      toast.error('Không thể xóa blog. Vui lòng thử lại.')
    }
  }

  const handlePageChange = (newPage) => {
    fetchBlogs(newPage, limit)
  }
  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filters, newFilters)) {
      setPage(1)
      setFilters(newFilters)
    }
  }
  // Function để tạo dữ liệu mẫu

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải danh sách blog...</Typography>
      </Paper>
    )
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant='contained' onClick={() => fetchBlogs()}>
            Thử lại
          </Button>
        </Box>
      </Paper>
    )
  }

  return (
    <>
      <BlogTable
        blogs={blogs}
        onAdd={() => {
          setBlogModalMode('add')
          setSelectedBlog(null)
          setOpenBlogModal(true)
        }}
        onEdit={(blog) => {
          setSelectedBlog(blog)
          setBlogModalMode('edit')
          setOpenBlogModal(true)
        }}
        onView={(blog) => {
          setSelectedBlog(blog)
          setOpenView(true)
        }}
        onDelete={(blog) => {
          setSelectedBlog(blog)
          setOpenDelete(true)
        }}
        onFilter={handleFilter}
        page={page - 1}
        rowsPerPage={limit}
        total={totalPages}
        onPageChange={handlePageChange}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setLimit(newLimit)
        }}
      />

      <BlogModal
        open={openBlogModal}
        onClose={() => {
          setOpenBlogModal(false)
          setSelectedBlog(null)
          setBlogModalMode('add')
        }}
        onSave={handleBlogSave}
        blogData={selectedBlog}
        mode={blogModalMode}
      />
      <ViewBlogModal
        open={openView}
        blog={selectedBlog}
        onClose={() => {
          setOpenView(false)
          setSelectedBlog(null)
        }}
      />
      <DeleteBlogModal
        open={openDelete}
        blog={selectedBlog}
        onClose={() => {
          setOpenDelete(false)
          setSelectedBlog(null)
        }}
        onConfirm={handleDelete}
      />
    </>
  )
}
