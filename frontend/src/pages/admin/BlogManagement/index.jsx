// index.jsx
import React from 'react'
import { Typography, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import BlogTable from './BlogTable.jsx'

const AddBlogModal = React.lazy(() => import('./modal/AddBlogModal.jsx'))
const EditBlogModal = React.lazy(() => import('./modal/EditBlogModal.jsx'))
const ViewBlogModal = React.lazy(() => import('./modal/ViewBlogModal.jsx'))
const DeleteBlogModal = React.lazy(() => import('./modal/DeleteBlogModal.jsx'))

const BlogManagement = () => {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [blogs, setBlogs] = React.useState([
    {
      _id: '665abf9f42e1a15b9ce4d123',
      title: '5 cách tăng hiệu quả bán hàng online',
      content: 'Trong thời đại số, bán hàng online là một lợi thế lớn...',
      image:
        'https://res.cloudinary.com/demo/image/upload/v1718435600/sample-blog.jpg',
      isActive: true,
      createdAt: '2025-06-10T09:30:00.000Z',
      updatedAt: '2025-06-18T14:45:00.000Z'
    },
    {
      _id: '665ac1de52e1a15b9ce4d124',
      title: 'Làm sao để tăng tương tác trên mạng xã hội?',
      content:
        'Tăng tương tác mạng xã hội là chìa khóa để lan tỏa thương hiệu...',
      image:
        'https://res.cloudinary.com/demo/image/upload/v1718435601/post2.jpg',
      isActive: false,
      createdAt: '2025-06-12T08:00:00.000Z',
      updatedAt: '2025-06-18T14:45:00.000Z'
    }
  ])
  const [selected, setSelected] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)

  const fetchBlogs = async (page, limit) => {
    // Gọi API lấy bài viết ở đây
    // setBlogs(data)
  }

  React.useEffect(() => {
    fetchBlogs(page, limit)
  }, [page, limit])

  const handleCloseModal = () => {
    setModalType(null)
    setSelected(null)
  }

  return (
    <>
      <BlogTable
        blogs={blogs}
        page={page - 1}
        rowsPerPage={limit}
        total={50} // Giả định tạm
        onPageChange={(e, newPage) => setPage(newPage + 1)}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setLimit(newLimit)
        }}
        onEdit={(item) => {
          setSelected(item)
          setModalType('edit')
        }}
        onDelete={(item) => {
          setSelected(item)
          setModalType('delete')
        }}
        onView={(item) => {
          setSelected(item)
          setModalType('view')
        }}
        addPost={() => setModalType('add')}
      />

      <React.Suspense fallback={null}>
        {modalType === 'add' && (
          <AddBlogModal open onClose={handleCloseModal} />
        )}
        {modalType === 'edit' && selected && (
          <EditBlogModal open post={selected} onClose={handleCloseModal} />
        )}
        {modalType === 'view' && selected && (
          <ViewBlogModal open post={selected} onClose={handleCloseModal} />
        )}
        {modalType === 'delete' && selected && (
          <DeleteBlogModal open post={selected} onClose={handleCloseModal} />
        )}
      </React.Suspense>
    </>
  )
}

export default BlogManagement
