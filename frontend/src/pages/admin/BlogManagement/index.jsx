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
import useBlog from '~/hooks/admin/useBlog'
export default function BlogManagementPage() {
  const [error, setError] = useState(null)
  const [openBlogModal, setOpenBlogModal] = useState(false)
  const [blogModalMode, setBlogModalMode] = useState('add') // 'add' hoặc 'edit'
  const [openView, setOpenView] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [filters, setFilters] = React.useState({
    status: 'draft',
    sort: 'newest'
  })
  // Fetch blogs từ API
  const {
    blogs,
    fetchBlogs,
    totalPages,
    loading,
    removeBlog,
    updateBlogById,
    addBlog
  } = useBlog()
  // Load blogs khi component mount
  useEffect(() => {
    fetchBlogs(page, limit, filters)
  }, [page, limit, filters])

  const handleBlogSave = async (blogData, isEditMode) => {
    try {
      if (isEditMode) {
        await updateBlogById(selectedBlog._id, blogData)
        toast.success('Cập nhật blog thành công!')
      } else {
        // Tạo blog mới
        await addBlog(blogData)
        toast.success('Tạo blog thành công!')
      }

      setOpenBlogModal(false)
      setSelectedBlog(null)
      setBlogModalMode('add')
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
      await removeBlog(selectedBlog._id)
      toast.success('Xóa blog thành công!')
      setOpenDelete(false)
      setSelectedBlog(null)
    } catch (error) {
      console.error('Lỗi khi xóa blog:', error)
      toast.error('Không thể xóa blog. Vui lòng thử lại.')
    }
  }

  const handleChangePage = (event, value) => setPage(value)
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
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setLimit(newLimit)
        }}
        loading={loading}
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
