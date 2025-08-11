import React from 'react'

import useDiscounts from '~/hooks/admin/useDiscount'
import usePermissions from '~/hooks/usePermissions'
import { RouteGuard, PermissionWrapper } from '~/components/PermissionGuard'

// Lazy load modals
const AddDiscountModal = React.lazy(
  () => import('~/pages/admin/DiscountManagement/modal/AddDiscountModal')
)
const ViewDiscountModal = React.lazy(
  () => import('~/pages/admin/DiscountManagement/modal/ViewDiscountModal')
)
const EditDiscountModal = React.lazy(
  () => import('~/pages/admin/DiscountManagement/modal/EditDiscountModal')
)
const DeleteDiscountModal = React.lazy(
  () => import('~/pages/admin/DiscountManagement/modal/DeleteDiscountModal')
)
const RestoreDiscountModal = React.lazy(
  () => import('~/pages/admin/DiscountManagement/modal/RestoreDiscountModal')
)

const DiscountTable = React.lazy(
  () => import('~/pages/admin/DiscountManagement/DiscountTable')
)
const DiscountPagination = React.lazy(
  () => import('~/pages/admin/DiscountManagement/DiscountPagination')
)

function DiscountManagement() {
  const { hasPermission } = usePermissions()
  const [page, setPage] = React.useState(1)
  const [filters, setFilters] = React.useState({
    status: 'true',
    sort: 'newest',
    destroy: 'false'
  })
  const [selectedDiscount, setSelectedDiscount] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)

  const {
    discounts,
    totalPages,
    loading,
    fetchDiscounts,
    add,
    remove,
    update,
    setROWS_PER_PAGE,
    ROWS_PER_PAGE,
    restore
  } = useDiscounts()

  React.useEffect(() => {
    fetchDiscounts(page, ROWS_PER_PAGE, filters)
  }, [page, ROWS_PER_PAGE, filters])
  const handleOpenModal = (type, discount) => {
    if (!discount || !discount._id) return

    // Kiểm tra quyền trước khi mở Chart
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

  const handleSave = async (data, type, id) => {
    try {
      if (type === 'add') {
        await add(data, filters)
      } else if (type === 'edit') {
        await update(id, data)
        fetchDiscounts(page, ROWS_PER_PAGE, filters)
      } else if (type === 'delete') {
        await remove(data)
      } else if (type === 'restore') {
        await restore(data)
      }
    } catch (error) {
      console.error('Lỗi:', error)
    }
  }

  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filters, newFilters)) {
      setPage(1)
      setFilters(newFilters)
    }
  }

  return (
    <RouteGuard requiredPermissions={['coupon:use']}>
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
        rowsPerPage={ROWS_PER_PAGE}
        total={totalPages}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setROWS_PER_PAGE(newLimit)
        }}
        permissions={{
          canCreate: hasPermission('coupon:create'),
          canEdit: hasPermission('coupon:update'),
          canDelete: hasPermission('coupon:delete'),
          canView: hasPermission('coupon:read'),
          canRestore: hasPermission('coupon:restore')
        }}
        filters={filters}
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

      <PermissionWrapper requiredPermissions={['coupon:restore']}>
        {modalType === 'restore' && selectedDiscount && (
          <RestoreDiscountModal
            open
            onClose={handleCloseModal}
            discount={selectedDiscount}
            onRestore={restore}
          />
        )}
      </PermissionWrapper>
    </RouteGuard>
  )
}

export default DiscountManagement
