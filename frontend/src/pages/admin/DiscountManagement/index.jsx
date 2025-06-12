import React from 'react'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

import useDiscounts from '~/hooks/admin/useDiscount'
import {
  updateDiscount,
  deleteDiscount
} from '~/services/admin/discountService'

// Lazy load modals
const AddDiscountModal = React.lazy(() => import('./modal/AddDiscountModal'))
const ViewDiscountModal = React.lazy(() => import('./modal/ViewDiscountModal'))
const EditDiscountModal = React.lazy(() => import('./modal/EditDiscountModal'))
const DeleteDiscountModal = React.lazy(
  () => import('./modal/DeleteDiscountModal')
)

const DiscountTable = React.lazy(() => import('./DiscountTable'))
const DiscountPagination = React.lazy(() => import('./DiscountPagination'))

function DiscountManagement() {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [filters, setFilters] = React.useState({})
  const [selectedDiscount, setSelectedDiscount] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)

  const { discounts, totalPages, loading, fetchDiscounts } = useDiscounts()

  React.useEffect(() => {
    fetchDiscounts(page, limit, filters)
  }, [page, limit])

  const handleOpenModal = (type, discount) => {
    if (!discount || !discount._id) return
    setSelectedDiscount(discount)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setSelectedDiscount(null)
    setModalType(null)
  }

  const handleChangePage = (event, value) => setPage(value)

  const handleSaveDiscount = async (discountId, updatedData) => {
    const updated = await updateDiscount(discountId, updatedData)
    if (updated) await fetchDiscounts(page, limit)
  }

  const handleDeleteDiscount = async (discountId) => {
    const deleted = await deleteDiscount(discountId)
    if (deleted) await fetchDiscounts(page, limit)
  }
  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    if (Object.keys(newFilters).length > 0) {
      fetchDiscounts(1, limit, newFilters)
    }
  }

  return (
    <>
      <DiscountTable
        discounts={discounts}
        loading={loading}
        onAction={handleOpenModal}
        addDiscount={() => setModalType('add')}
        onFilter={handleFilter}
        fetchDiscounts={fetchDiscounts}
        page={page - 1}
        rowsPerPage={limit}
        total={totalPages}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setLimit(newLimit)
        }}
      />

      {modalType === 'add' && (
        <AddDiscountModal
          open
          onClose={handleCloseModal}
          onAdded={() => fetchDiscounts(page)}
        />
      )}

      {modalType === 'view' && selectedDiscount && (
        <ViewDiscountModal
          open
          onClose={handleCloseModal}
          discount={selectedDiscount}
        />
      )}

      {modalType === 'edit' && selectedDiscount && (
        <EditDiscountModal
          open
          onClose={handleCloseModal}
          discount={selectedDiscount}
          onSave={handleSaveDiscount}
        />
      )}

      {modalType === 'delete' && selectedDiscount && (
        <DeleteDiscountModal
          open
          onClose={handleCloseModal}
          discount={selectedDiscount}
          onDelete={handleDeleteDiscount}
        />
      )}

      {/*<DiscountPagination*/}
      {/*  page={page}*/}
      {/*  totalPages={totalPages}*/}
      {/*  onPageChange={handleChangePage}*/}
      {/*/>*/}
    </>
  )
}

export default DiscountManagement
