import React from 'react'

import useDiscounts from '~/hooks/admin/useDiscount'
import {
  updateDiscount,
  deleteDiscount
} from '~/services/admin/discountService'
import { deleteColor } from '~/services/admin/ColorService.js'

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

  const {
    discounts,
    totalPages,
    loading,
    fetchDiscounts,
    saveDiscount,
    fetchDiscountById
  } = useDiscounts()

  React.useEffect(() => {
    fetchDiscounts(page, limit, filters)
  }, [page, limit, filters])

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
    try {
      const response = await updateDiscount(discountId, updatedData)
      if (response) {
        const updatedDiscount = await fetchDiscountById(discountId)
        if (updatedDiscount) {
          saveDiscount(updatedDiscount)
        }
      } else {
        console.log('Cập nhật không thành công')
      }
    } catch (error) {
      console.error('Lỗi:', error)
    }
  }

  const handleDeleteDiscount = async (discountId) => {
    try {
      const response = await deleteDiscount(discountId)
      if (response) {
        fetchDiscounts(page, limit, filters)
        // const deletedDiscount = await fetchDiscountById(discountId)
        // if (deletedDiscount) {
        //   saveDiscount(deletedDiscount)
        // }
      } else {
        console.log('Xóa không thành công')
      }
    } catch (error) {
      console.error('Lỗi:', error)
    }
  }

  // const handleDeleteColor = async (colorId) => {
  //   try {
  //     const result = await deleteColor(colorId)
  //     if (result) {
  //       const deletedColor = await getColorId(colorId)
  //       if (deletedColor) {
  //         saveColor(deletedColor)
  //       }
  //     } else {
  //       console.log('Xoá không thành công')
  //     }
  //   } catch (error) {
  //     console.error('Lỗi:', error)
  //   }
  // }
  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filters, newFilters)) {
      setPage(1)
      setFilters(newFilters)
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
          onAdded={() => fetchDiscounts(page, limit, filters)}
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
