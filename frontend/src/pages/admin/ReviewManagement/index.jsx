import React, { useEffect, useState } from 'react'
import ReviewTable from './ReviewTable'
import useReviews from '~/hooks/admin/useReview'
import ViewReviewModal from '~/pages/admin/ReviewManagement/modal/ViewReviewModal'
import DeleteReviewModal from '~/pages/admin/ReviewManagement/modal/DeleteReviewModal'
import RestoreReviewModal from '~/pages/admin/ReviewManagement/modal/RestoreReviewModal.jsx'
import usePermissions from '~/hooks/usePermissions'
import { RouteGuard, PermissionWrapper } from '~/components/PermissionGuard'

const ReviewManagement = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filter, setFilter] = useState({ destroy: 'false' })
  const [selectedReview, setSelectedReview] = useState(null)
  const [modalType, setModalType] = useState(null)
  const { reviews, fetchReview, loading, remove, totalPages, update, restore } =
    useReviews()
  const { hasPermission } = usePermissions()

  useEffect(() => {
    fetchReview(page, limit, filter)
  }, [page, limit, filter])

  const handleOpenModal = (type, review) => {
    setSelectedReview(review)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setSelectedReview(null)
    setModalType(null)
  }

  const handleSave = async (id, data) => {
    if (modalType === 'delete') await remove(id)
    else if (modalType === 'view') await update(id, data)
    else if (modalType === 'restore') await restore(id)
    handleCloseModal()
  }

  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filter, newFilters)) {
      setPage(1)
      setFilter(newFilters)
    }
  }
  const handleChangePage = (event, value) => setPage(value)
  return (
    <RouteGuard requiredPermissions={['review:use']}>
      <ReviewTable
        reviews={reviews}
        loading={loading}
        page={page - 1}
        rowsPerPage={limit}
        total={totalPages}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setLimit(newLimit)
        }}
        handleOpenModal={handleOpenModal}
        permissions={{
          canView: hasPermission('review:read'),
          canDelete: hasPermission('review:delete'),
          canRestore: hasPermission('review:restore')
        }}
        onFilter={handleFilter}
        filter={filter}
      />

      <React.Suspense fallback={null}>
        {modalType === 'view' && selectedReview && (
          <ViewReviewModal
            open
            onClose={handleCloseModal}
            review={selectedReview}
            onApprove={handleSave}
          />
        )}
        {modalType === 'delete' && selectedReview && (
          <DeleteReviewModal
            open
            onClose={handleCloseModal}
            review={selectedReview}
            onDelete={handleSave}
          />
        )}
        {modalType === 'restore' && selectedReview && (
          <RestoreReviewModal
            open
            onClose={handleCloseModal}
            review={selectedReview}
            onRestore={handleSave}
          />
        )}
      </React.Suspense>
    </RouteGuard>
  )
}

export default ReviewManagement
