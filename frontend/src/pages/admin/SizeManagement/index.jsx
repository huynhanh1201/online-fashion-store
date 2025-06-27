import React from 'react'

import SizeTable from './SizeTable.jsx'

import useSizes from '~/hooks/admin/useSize'
import usePermissions from '~/hooks/usePermissions'
import { PermissionWrapper, RouteGuard } from '~/components/PermissionGuard'

// Lazy load các modal
const AddSizeModal = React.lazy(() => import('./modal/AddSizeModal'))
const ViewSizeModal = React.lazy(() => import('./modal/ViewSizeModal'))
const EditSizeModal = React.lazy(() => import('./modal/EditSizeModal'))
const DeleteSizeModal = React.lazy(() => import('./modal/DeleteSizeModal'))

const SizeManagement = () => {
  const [page, setPage] = React.useState(1)
  const [filters, setFilters] = React.useState({
    status: 'false',
    sort: 'newest'
  }) // Bộ lọc tìm kiếm
  const [selectedSize, setSelectedSize] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)

  const {
    sizes,
    totalPages,
    fetchSizes,
    Loading,
    Save,
    remove,
    update,
    createNewSize,
    ROWS_PER_PAGE,
    setROWS_PER_PAGE
  } = useSizes()
  const { hasPermission } = usePermissions()

  React.useEffect(() => {
    fetchSizes(page, ROWS_PER_PAGE, filters)
  }, [page, ROWS_PER_PAGE, filters])

  const handleOpenModal = (type, size) => {
    if (!size || !size._id) return

    // Kiểm tra quyền trước khi mở modal
    if (type === 'edit' && !hasPermission('size:update')) return
    if (type === 'delete' && !hasPermission('size:delete')) return
    if (type === 'view' && !hasPermission('size:read')) return

    setSelectedSize(size)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setSelectedSize(null)
    setModalType(null)
  }

  const handleChangePage = (event, value) => setPage(value)

  const handleSave = async (data, type, id) => {
    try {
      if (type === 'add') {
        await createNewSize(data, filters)
      } else if (type === 'edit') {
        await update(id, data)
      } else if (type === 'delete') {
        await remove(data)
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
    <RouteGuard requiredPermissions={['admin:access', 'size:read']}>
      <SizeTable
        sizes={sizes}
        loading={Loading}
        handleOpenModal={handleOpenModal}
        addSize={() => {
          if (hasPermission('size:create')) {
            setModalType('add')
          }
        }}
        onFilters={handleFilter}
        page={page - 1}
        rowsPerPage={ROWS_PER_PAGE}
        total={totalPages}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setROWS_PER_PAGE(newLimit)
        }}
        fetchSizes={fetchSizes}
        // Truyền quyền xuống component con
        permissions={{
          canCreate: hasPermission('size:create'),
          canEdit: hasPermission('size:update'),
          canDelete: hasPermission('size:delete'),
          canView: hasPermission('size:read')
        }}
      />

      <React.Suspense fallback={<></>}>
        <PermissionWrapper requiredPermissions={['size:create']}>
          {modalType === 'add' && (
            <AddSizeModal
              open
              onClose={handleCloseModal}
              onAdded={handleSave}
            />
          )}
        </PermissionWrapper>

        {modalType === 'view' && selectedSize && (
          <ViewSizeModal open onClose={handleCloseModal} size={selectedSize} />
        )}

        <PermissionWrapper requiredPermissions={['size:update']}>
          {modalType === 'edit' && selectedSize && (
            <EditSizeModal
              open
              onClose={handleCloseModal}
              size={selectedSize}
              onSave={handleSave}
            />
          )}
        </PermissionWrapper>

        <PermissionWrapper requiredPermissions={['size:delete']}>
          {modalType === 'delete' && selectedSize && (
            <DeleteSizeModal
              open
              onClose={handleCloseModal}
              size={selectedSize}
              onDelete={handleSave}
            />
          )}
        </PermissionWrapper>
      </React.Suspense>

      {/*<SizePagination
        page={page}
        totalPages={totalPages}
        onPageChange={handleChangePage}
      />*/}
    </RouteGuard>
  )
}

export default SizeManagement
