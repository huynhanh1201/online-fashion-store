import React from 'react'
import ReviewTable from './ReviewTable'

// Lazy load các modal
const ViewReviewModal = React.lazy(() => import('./modal/ViewReviewModal'))
const DeleteReviewModal = React.lazy(() => import('./modal/DeleteReviewModal'))

const mockData = [
  {
    id: 'r1',
    productId: 'p1001',
    user: {
      userId: 'u123',
      fullName: 'Nguyễn Văn A',
      email: 'vana@gmail.com'
    },
    rating: 4,
    comment: 'Sản phẩm tốt, giao hàng nhanh.',
    images: [
      'https://cdn.example.com/review/image1.jpg',
      'https://cdn.example.com/review/image2.jpg'
    ],
    status: 'approved',
    createdAt: '2025-06-10T09:30:00.000Z',
    updatedAt: '2025-06-11T10:00:00.000Z'
  },
  {
    id: 'r2',
    productId: 'p1002',
    user: {
      userId: 'u124',
      fullName: 'Trần Thị B',
      email: 'thib@example.com'
    },
    rating: 2,
    comment: 'Sản phẩm không giống hình.',
    images: [],
    status: 'pending',
    createdAt: '2025-06-15T15:45:00.000Z',
    updatedAt: '2025-06-15T15:45:00.000Z'
  }
]

const ProductReviewManagement = () => {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [filters, setFilters] = React.useState({})
  const [selectedReview, setSelectedReview] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)
  const [reviews, setReviews] = React.useState(mockData)

  const totalPages = Math.ceil(reviews.length / limit)
  const loading = false

  const handleChangePage = (_, value) => setPage(value)

  const handleOpenModal = (type, review) => {
    if (!review || !review.id) return
    setSelectedReview(review)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setSelectedReview(null)
    setModalType(null)
  }

  const handleDeleteReview = (reviewId) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId))
    handleCloseModal()
  }

  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filters, newFilters)) {
      setPage(1)
      setFilters(newFilters)
      // Có thể lọc thực tế từ mockData ở đây nếu muốn
    }
  }

  return (
    <>
      <ReviewTable
        reviews={reviews.slice((page - 1) * limit, page * limit)}
        loading={loading}
        handleOpenModal={handleOpenModal}
        onFilter={handleFilter}
        page={page - 1}
        rowsPerPage={limit}
        total={reviews.length}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setLimit(newLimit)
        }}
      />

      <React.Suspense fallback={<></>}>
        {modalType === 'view' && selectedReview && (
          <ViewReviewModal
            open
            onClose={handleCloseModal}
            review={selectedReview}
          />
        )}
        {modalType === 'delete' && selectedReview && (
          <DeleteReviewModal
            open
            onClose={handleCloseModal}
            review={selectedReview}
            onDelete={() => handleDeleteReview(selectedReview.id)}
          />
        )}
      </React.Suspense>
    </>
  )
}

export default ProductReviewManagement
