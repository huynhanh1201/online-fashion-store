import React from 'react'

import useDiscounts from '~/hooks/admin/useDiscount'
import {
  updateDiscount,
  deleteDiscount
} from '~/services/admin/discountService'
import usePermissions from '~/hooks/usePermissions'
import { RouteGuard, PermissionWrapper } from '~/components/PermissionGuard'

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
  const { hasPermission } = usePermissions()
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [filters, setFilters] = React.useState({
    status: 'false',
    sort: 'newest'
  })
  const [selectedDiscount, setSelectedDiscount] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)

  const {
    discounts,
    totalPages,
    loading,
    fetchDiscounts,
    saveDiscount,
    fetchDiscountById,
    add,
    remove,
    update
  } = useDiscounts()

  React.useEffect(() => {
    fetchDiscounts(page, limit, filters)
  }, [page, limit, filters])

  const handleOpenModal = (type, discount) => {
    if (!discount || !discount._id) return

    // Kiểm tra quyền trước khi mở modal
    if (type === 'edit' && !hasPermission('coupon:update')) return
    if (type === 'delete' && !hasPermission('coupon:delete')) return
    if (type === 'view' && !hasPermission('coupon:read')) return

    setSelectedDiscount(discount)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setSelectedDiscount(null)
    setModalType(null)
  }

  const handleChangePage = (event, value) => setPage(value)

  // const handleSaveDiscount = async (discountId, updatedData) => {
  //   try {
  //     const response = await updateDiscount(discountId, updatedData)
  //     if (response) {
  //       const updatedDiscount = await fetchDiscountById(discountId)
  //       if (updatedDiscount) {
  //         saveDiscount(updatedDiscount)
  //       }
  //     } else {
  //       console.log('Cập nhật không thành công')
  //     }
  //   } catch (error) {
  //     console.error('Lỗi:', error)
  //   }
  // }
  //
  // const handleDeleteDiscount = async (discountId) => {
  //   try {
  //     const response = await deleteDiscount(discountId)
  //     if (response) {
  //       fetchDiscounts(page, limit, filters)
  //       // const deletedDiscount = await fetchDiscountById(discountId)
  //       // if (deletedDiscount) {
  //       //   saveDiscount(deletedDiscount)
  //       // }
  //     } else {
  //       console.log('Xóa không thành công')
  //     }
  //   } catch (error) {
  //     console.error('Lỗi:', error)
  //   }
  // }

  const handleSave = async (data, type, id) => {
    try {
      if (type === 'add') {
        await add(data, filters)
      } else if (type === 'edit') {
        await update(id, data)
      } else if (type === 'delete') {
        await remove(data)
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
    <RouteGuard requiredPermissions={['admin:access', 'coupon:read']}>
      <DiscountTable
        discounts={discounts}
        loading={loading}
        onAction={handleOpenModal}
        addDiscount={() => {
          if (hasPermission('coupon:create')) {
            setModalType('add')
          }
        }}
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
        permissions={{
          canCreate: hasPermission('coupon:create'),
          canEdit: hasPermission('coupon:update'),
          canDelete: hasPermission('coupon:delete'),
          canView: hasPermission('coupon:read')
        }}
      />

      <PermissionWrapper requiredPermissions={['coupon:create']}>
        {modalType === 'add' && (
          <AddDiscountModal
            open
            onClose={handleCloseModal}
            onAdded={handleSave}
          />
        )}
      </PermissionWrapper>

      <PermissionWrapper requiredPermissions={['coupon:read']}>
        {modalType === 'view' && selectedDiscount && (
          <ViewDiscountModal
            open
            onClose={handleCloseModal}
            discount={selectedDiscount}
          />
        )}
      </PermissionWrapper>

      <PermissionWrapper requiredPermissions={['coupon:update']}>
        {modalType === 'edit' && selectedDiscount && (
          <EditDiscountModal
            open
            onClose={handleCloseModal}
            discount={selectedDiscount}
            onSave={handleSave}
          />
        )}
      </PermissionWrapper>

      <PermissionWrapper requiredPermissions={['coupon:delete']}>
        {modalType === 'delete' && selectedDiscount && (
          <DeleteDiscountModal
            open
            onClose={handleCloseModal}
            discount={selectedDiscount}
            onDelete={handleSave}
          />
        )}
      </PermissionWrapper>

      {/*<DiscountPagination*/}
      {/*  page={page}*/}
      {/*  totalPages={totalPages}*/}
      {/*  onPageChange={handleChangePage}*/}
      {/*/>*/}
    </RouteGuard>
  )
}

export default DiscountManagement
