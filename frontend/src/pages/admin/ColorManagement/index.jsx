import React from 'react'
import ColorTable from './ColorTable'

import useColors from '~/hooks/admin/useColor'
import usePermissions from '~/hooks/usePermissions'
import { PermissionWrapper, RouteGuard } from '~/components/PermissionGuard'

// Lazy load các modal
const AddColorModal = React.lazy(() => import('./modal/AddColorModal'))
const ViewColorModal = React.lazy(() => import('./modal/ViewColorModal'))
const EditColorModal = React.lazy(() => import('./modal/EditColorModal'))
const DeleteColorModal = React.lazy(() => import('./modal/DeleteColorModal'))

const ColorManagement = () => {
  const [page, setPage] = React.useState(1)
  const [selectedColor, setSelectedColor] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)
  const [filters, setFilters] = React.useState({
    status: 'false',
    sort: 'newest'
  })
  const {
    colors,
    totalPages,
    fetchColors,
    Loading,
    remove,
    update,
    createNewColor,
    ROWS_PER_PAGE,
    setROWS_PER_PAGE
  } = useColors()
  const { hasPermission } = usePermissions()

  React.useEffect(() => {
    fetchColors(page, ROWS_PER_PAGE, filters)
  }, [page, ROWS_PER_PAGE, filters])

  const handleOpenModal = (type, color) => {
    if (!color || !color._id) return
    setSelectedColor(color)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setSelectedColor(null)
    setModalType(null)
  }

  const handleChangePage = (event, value) => setPage(value)

  const handleSave = async (data, type, id) => {
    try {
      if (type === 'add') {
        await createNewColor(data, filters)
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
    <RouteGuard requiredPermissions={['admin:access', 'color:use']}>
      <ColorTable
        colors={colors}
        loading={Loading}
        handleOpenModal={handleOpenModal}
        addColor={() => setModalType('add')}
        onFilters={handleFilter}
        fetchColors={fetchColors}
        page={page - 1}
        rowsPerPage={ROWS_PER_PAGE}
        total={totalPages}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setROWS_PER_PAGE(newLimit)
        }}
        // Truyền quyền xuống component con
        permissions={{
          canCreate: hasPermission('color:create'),
          canEdit: hasPermission('color:update'),
          canDelete: hasPermission('color:delete'),
          canView: hasPermission('color:read')
        }}
      />

      <React.Suspense fallback={<></>}>
        <PermissionWrapper requiredPermissions={['color:create']}>
          {modalType === 'add' && (
            <AddColorModal
              open
              onClose={handleCloseModal}
              onAdded={handleSave}
            />
          )}
        </PermissionWrapper>

        {modalType === 'view' && selectedColor && (
          <ViewColorModal
            open
            onClose={handleCloseModal}
            color={selectedColor}
          />
        )}

        <PermissionWrapper requiredPermissions={['color:update']}>
          {modalType === 'edit' && selectedColor && (
            <EditColorModal
              open
              onClose={handleCloseModal}
              color={selectedColor}
              onSave={handleSave}
            />
          )}
        </PermissionWrapper>

        <PermissionWrapper requiredPermissions={['color:delete']}>
          {modalType === 'delete' && selectedColor && (
            <DeleteColorModal
              open
              onClose={handleCloseModal}
              color={selectedColor}
              onDelete={handleSave}
            />
          )}
        </PermissionWrapper>
      </React.Suspense>

      {/*<ColorPagination*/}
      {/*  page={page}*/}
      {/*  totalPages={totalPages}*/}
      {/*  onPageChange={handleChangePage}*/}
      {/*/>*/}
    </RouteGuard>
  )
}

export default ColorManagement
