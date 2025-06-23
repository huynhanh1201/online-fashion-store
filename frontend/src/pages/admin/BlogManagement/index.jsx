import React, { useState, useEffect } from 'react'
import { Typography, Button, Paper, CircularProgress, Alert, Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'react-toastify'
import BlogTable from './BlogTable'
import AddBlogModal from './modal/AddBlogModal'
import EditBlogModal from './modal/EditBlogModal'
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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openView, setOpenView] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)

  // Fetch blogs từ API
  const fetchBlogs = async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await getBlogs(page, limit, filters)
      setBlogs(response.blogs)
      setPagination({
        page: response.currentPage,
        limit,
        total: response.total,
        totalPages: response.totalPages
      })
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
    fetchBlogs()
  }, [])

  const handleAdd = async (newBlogData) => {
    try {
      const createdBlog = await createBlog(newBlogData)
      toast.success('Tạo blog thành công!')
      setOpenAdd(false)
      // Refresh lại danh sách để đảm bảo dữ liệu mới nhất
      fetchBlogs(pagination.page, pagination.limit)
    } catch (error) {
      console.error('Lỗi khi tạo blog:', error)
      toast.error('Không thể tạo blog. Vui lòng thử lại.')
    }
  }

  const handleEdit = async (updatedBlogData) => {
    try {
      const updatedBlog = await updateBlog(selectedBlog._id, updatedBlogData)
      toast.success('Cập nhật blog thành công!')
      setOpenEdit(false)
      setSelectedBlog(null)
      // Refresh lại danh sách
      fetchBlogs(pagination.page, pagination.limit)
    } catch (error) {
      console.error('Lỗi khi cập nhật blog:', error)
      toast.error('Không thể cập nhật blog. Vui lòng thử lại.')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteBlog(selectedBlog._id)
      toast.success('Xóa blog thành công!')
      setOpenDelete(false)
      setSelectedBlog(null)
      // Refresh lại danh sách
      fetchBlogs(pagination.page, pagination.limit)
    } catch (error) {
      console.error('Lỗi khi xóa blog:', error)
      toast.error('Không thể xóa blog. Vui lòng thử lại.')
    }
  }

  const handlePageChange = (newPage) => {
    fetchBlogs(newPage, pagination.limit)
  }

  const handleSearch = (searchTerm) => {
    fetchBlogs(1, pagination.limit, { search: searchTerm })
  }

  const handleFilter = (filters) => {
    fetchBlogs(1, pagination.limit, filters)
  }

  // Function để tạo dữ liệu mẫu
  const createSampleData = async () => {
    try {
      // Import dữ liệu mẫu
      const { createSampleBlogs } = await import('~/utils/blogSampleData')
      const sampleBlogs = createSampleBlogs()
      
      let successCount = 0
      let errorCount = 0
      
      for (const blogData of sampleBlogs) {
        try {
          await createBlog(blogData)
          successCount++
          console.log(`✅ Tạo thành công: ${blogData.title}`)
        } catch (error) {
          errorCount++
          console.error(`❌ Lỗi khi tạo: ${blogData.title}`, error)
        }
      }
      
      if (successCount > 0) {
        toast.success(`Tạo thành công ${successCount} bài viết mẫu!`)
        fetchBlogs(pagination.page, pagination.limit)
      }
      
      if (errorCount > 0) {
        toast.warning(`Có ${errorCount} bài viết không tạo được`)
      }
      
    } catch (error) {
      console.error('Lỗi khi tạo dữ liệu mẫu:', error)
      toast.error('Không thể tạo dữ liệu mẫu')
    }
  }

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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={() => fetchBlogs()}>
            Thử lại
          </Button>
          <Button variant="outlined" onClick={createSampleData}>
            Tạo dữ liệu mẫu
          </Button>
        </Box>
      </Paper>
    )
  }

  return (
    <>
      <BlogTable
        blogs={blogs}
        pagination={pagination}
        onAdd={() => setOpenAdd(true)}
        onEdit={(blog) => {
          setSelectedBlog(blog)
          setOpenEdit(true)
        }}
        onView={(blog) => {
          setSelectedBlog(blog)
          setOpenView(true)
        }}
        onDelete={(blog) => {
          setSelectedBlog(blog)
          setOpenDelete(true)
        }}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onCreateSample={createSampleData}
      />

      <AddBlogModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={handleAdd}
      />
      <EditBlogModal
        open={openEdit}
        blog={selectedBlog}
        onClose={() => {
          setOpenEdit(false)
          setSelectedBlog(null)
        }}
        onSave={handleEdit}
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