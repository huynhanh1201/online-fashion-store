// // index.jsx
// import React from 'react'
// import { Typography, Paper } from '@mui/material'
// import AddIcon from '@mui/icons-material/Add'
// import Button from '@mui/material/Button'
// import BlogTable from './BlogTable.jsx'
//
// const AddBlogModal = React.lazy(() => import('./modal/AddBlogModal.jsx'))
// const EditBlogModal = React.lazy(() => import('./modal/EditBlogModal.jsx'))
// const ViewBlogModal = React.lazy(() => import('./modal/ViewBlogModal.jsx'))
// const DeleteBlogModal = React.lazy(() => import('./modal/DeleteBlogModal.jsx'))
//
// const BlogManagement = () => {
//   const [page, setPage] = React.useState(1)
//   const [limit, setLimit] = React.useState(10)
//   const [blogs, setBlogs] = React.useState([
//     {
//       _id: '665abf9f42e1a15b9ce4d123',
//       title: '5 cách tăng hiệu quả bán hàng online',
//       content: 'Trong thời đại số, bán hàng online là một lợi thế lớn...',
//       image:
//         'https://res.cloudinary.com/demo/image/upload/v1718435600/sample-blog.jpg',
//       isActive: true,
//       createdAt: '2025-06-10T09:30:00.000Z',
//       updatedAt: '2025-06-18T14:45:00.000Z'
//     },
//     {
//       _id: '665ac1de52e1a15b9ce4d124',
//       title: 'Làm sao để tăng tương tác trên mạng xã hội?',
//       content:
//         'Tăng tương tác mạng xã hội là chìa khóa để lan tỏa thương hiệu...',
//       image:
//         'https://res.cloudinary.com/demo/image/upload/v1718435601/post2.jpg',
//       isActive: false,
//       createdAt: '2025-06-12T08:00:00.000Z',
//       updatedAt: '2025-06-18T14:45:00.000Z'
//     }
//   ])
//   const [selected, setSelected] = React.useState(null)
//   const [modalType, setModalType] = React.useState(null)
//
//   const fetchBlogs = async (page, limit) => {
//     // Gọi API lấy bài viết ở đây
//     // setBlogs(data)
//   }
//
//   React.useEffect(() => {
//     fetchBlogs(page, limit)
//   }, [page, limit])
//
//   const handleCloseModal = () => {
//     setModalType(null)
//     setSelected(null)
//   }
//
//   return (
//     <>
//       <BlogTable
//         blogs={blogs}
//         page={page - 1}
//         rowsPerPage={limit}
//         total={50} // Giả định tạm
//         onPageChange={(e, newPage) => setPage(newPage + 1)}
//         onChangeRowsPerPage={(newLimit) => {
//           setPage(1)
//           setLimit(newLimit)
//         }}
//         onEdit={(item) => {
//           setSelected(item)
//           setModalType('edit')
//         }}
//         onDelete={(item) => {
//           setSelected(item)
//           setModalType('delete')
//         }}
//         onView={(item) => {
//           setSelected(item)
//           setModalType('view')
//         }}
//         addPost={() => setModalType('add')}
//       />
//
//       <React.Suspense fallback={null}>
//         {modalType === 'add' && (
//           <AddBlogModal open onClose={handleCloseModal} />
//         )}
//         {modalType === 'edit' && selected && (
//           <EditBlogModal open post={selected} onClose={handleCloseModal} />
//         )}
//         {modalType === 'view' && selected && (
//           <ViewBlogModal open post={selected} onClose={handleCloseModal} />
//         )}
//         {modalType === 'delete' && selected && (
//           <DeleteBlogModal open post={selected} onClose={handleCloseModal} />
//         )}
//       </React.Suspense>
//     </>
//   )
// }
//
// export default BlogManagement

// src/pages/admin/blogs/index.jsx
import React, { useState } from 'react'
import { Typography, Button, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import BlogTable from './BlogTable'
import AddBlogModal from './modal/AddBlogModal'
import EditBlogModal from './modal/EditBlogModal'
import ViewBlogModal from './modal/ViewBlogModal'
import DeleteBlogModal from './modal/DeleteBlogModal'

const mockBlogs = [
  {
    _id: '1',
    title: 'Thời trang mùa hè 2025',
    slug: 'thoi-trang-mua-he-2025',
    excerpt: 'Khám phá những xu hướng thời trang hot nhất mùa hè năm nay...',
    content: '<p>Nội dung chi tiết bài viết về thời trang hè 2025...</p>',
    coverImage: 'https://example.com/cover1.jpg',
    images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
    author: {
      name: 'Nguyễn Văn A',
      avatar: 'https://example.com/avatar1.jpg',
      id: 'user1'
    },
    tags: ['váy', 'mùa hè', 'gucci'],
    category: 'Trang phục',
    brand: 'Gucci',
    publishedAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-06-10T00:00:00.000Z',
    status: 'published',
    meta: {
      title: 'Thời trang hè 2025',
      description: 'Tổng hợp những xu hướng hot nhất mùa hè 2025',
      keywords: ['thời trang', 'mùa hè', 'gucci']
    },
    views: 1234,
    likes: 120
  },
  {
    _id: '2',
    title: 'Phụ kiện nổi bật cho mùa lễ hội',
    slug: 'phu-kien-noi-bat-cho-mua-le-hoi',
    excerpt:
      'Gợi ý những phụ kiện bạn không thể bỏ qua cho các bữa tiệc cuối năm...',
    content: '<p>Chi tiết về các loại phụ kiện nổi bật trong mùa lễ hội...</p>',
    coverImage: 'https://example.com/cover2.jpg',
    images: ['https://example.com/img3.jpg'],
    author: {
      name: 'Trần Thị B',
      avatar: 'https://example.com/avatar2.jpg',
      id: 'user2'
    },
    tags: ['phụ kiện', 'lễ hội'],
    category: 'Phụ kiện',
    brand: 'Zara',
    publishedAt: '2025-05-20T00:00:00.000Z',
    updatedAt: '2025-05-25T00:00:00.000Z',
    status: 'draft',
    meta: {
      title: 'Phụ kiện mùa lễ hội',
      description: 'Tăng sức hút với những phụ kiện nổi bật',
      keywords: ['phụ kiện', 'zara', 'lễ hội']
    },
    views: 800,
    likes: 90
  }
]

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState(mockBlogs)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openView, setOpenView] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)

  const handleAdd = (newBlog) => {
    setBlogs([newBlog, ...blogs])
    setOpenAdd(false)
  }

  const handleEdit = (updatedBlog) => {
    setBlogs(blogs.map((b) => (b._id === updatedBlog._id ? updatedBlog : b)))
    setOpenEdit(false)
  }

  const handleDelete = (id) => {
    setBlogs(blogs.filter((b) => b._id !== id))
    setOpenDelete(false)
  }

  return (
    <>
      <BlogTable
        blogs={blogs}
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
      />

      <AddBlogModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={handleAdd}
      />
      <EditBlogModal
        open={openEdit}
        blog={selectedBlog}
        onClose={() => setOpenEdit(false)}
        onSave={handleEdit}
      />
      <ViewBlogModal
        open={openView}
        blog={selectedBlog}
        onClose={() => setOpenView(false)}
      />
      <DeleteBlogModal
        open={openDelete}
        blog={selectedBlog}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => handleDelete(selectedBlog._id)}
      />
    </>
  )
}
