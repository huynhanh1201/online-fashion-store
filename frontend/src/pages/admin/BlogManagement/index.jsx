import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import BlogTable from './BlogTable'
import BlogModal from './modal/AddBlogModal'
import ViewBlogModal from './modal/ViewBlogModal'
import DeleteBlogModal from './modal/DeleteBlogModal'
import RestoreBlogModal from './modal/RestoreBlogModal'
import useBlog from '~/hooks/admin/useBlog'
import { RouteGuard } from '~/components/PermissionGuard'
export default function BlogManagementPage() {
  const [openBlogModal, setOpenBlogModal] = useState(false)
  const [blogModalMode, setBlogModalMode] = useState('add') // 'add' hoặc 'edit'
  const [openView, setOpenView] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openRestore, setOpenRestore] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [page, setPage] = React.useState(1)
  const [filters, setFilters] = React.useState({
    sort: 'newest',
    destroy: 'false'
  })
  // Fetch blogs từ API
  const {
    blogs,
    fetchBlogs,
    totalPages,
    loading,
    removeBlog,
    updateBlogById,
    addBlog,
    ROWS_PER_PAGE,
    setROWS_PER_PAGE,
    restore
  } = useBlog()
  // Load blogs khi component mount
  useEffect(() => {
    fetchBlogs(page, ROWS_PER_PAGE, filters)
  }, [page, ROWS_PER_PAGE, filters])

  const handleBlogSave = async (blogData, isEditMode) => {
    try {
      if (isEditMode) {
        await updateBlogById(selectedBlog._id, blogData)
      } else {
        // Tạo blog mới
        await addBlog(blogData)
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

  const handleRestore = async () => {
    try {
      await restore(selectedBlog._id)
      toast.success('Khôi phục blog thành công!')
      setOpenRestore(false)
      setSelectedBlog(null)
    } catch (error) {
      console.error('Lỗi khi khôi phục blog:', error)
      toast.error('Không thể khôi phục blog. Vui lòng thử lại.')
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

  return (
    <RouteGuard requiredPermissions={['admin:access', 'blog:use']}>
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
        onRestore={(blog) => {
          setSelectedBlog(blog)
          setOpenRestore(true)
        }}
        onFilter={handleFilter}
        page={page - 1}
        rowsPerPage={ROWS_PER_PAGE}
        total={totalPages}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setROWS_PER_PAGE(newLimit)
        }}
        loading={loading}
        filters={filters}
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
      <RestoreBlogModal
        open={openRestore}
        blog={selectedBlog}
        onClose={() => {
          setOpenRestore(false)
          setSelectedBlog(null)
        }}
        onConfirm={handleRestore}
      />
    </RouteGuard>
  )
}
