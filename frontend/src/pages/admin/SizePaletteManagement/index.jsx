import React from 'react'
import { RouteGuard, PermissionWrapper } from '~/components/PermissionGuard'
import { Typography, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import useSizePalettes from '~/hooks/admin/useSizePalettes'
import SizePaletteTable from './SizePaletteTable'

const AddSizeModal = React.lazy(() => import('./modal/AddSizeModal'))
const EditSizeModal = React.lazy(() => import('./modal/EditSizeModal'))
const DeleteSizeModal = React.lazy(() => import('./modal/DeleteSizeModal'))
const ViewSizeModal = React.lazy(() => import('./modal/ViewSizeModal'))

const SizePaletteManagement = ({ productId = '6853ef5fa2331414899bfaf2' }) => {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [selected, setSelected] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)

  const {
    // sizePalettes,
    totalPages,
    loading,
    fetchSizePalettes,
    addSizePalette,
    updateSizePalette,
    deleteSizePalette
  } = useSizePalettes({ productId })

  React.useEffect(() => {
    fetchSizePalettes(page, limit)
  }, [page, limit])
  const sizePalettes = [
    {
      _id: '1',
      name: 'Size S',
      isActive: true,
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-01T12:00:00Z'
    }
  ]
  const handleSave = async (data, type, id) => {
    if (type === 'add') await addSizePalette(data)
    else if (type === 'edit') await updateSizePalette(id, data)
    else if (type === 'delete') await deleteSizePalette(id)
    setModalType(null)
    setSelected(null)
  }

  const handleCloseModal = () => {
    setModalType(null)
    setSelected(null)
  }

  return (
    <RouteGuard requiredPermissions={['admin:access', 'size:use']}>
      <SizePaletteTable
        sizePalettes={sizePalettes}
        loading={loading}
        page={page - 1}
        rowsPerPage={limit}
        total={totalPages}
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
        addSize={() => setModalType('add')}
      />

      <React.Suspense fallback={null}>
        {modalType === 'view' && selected && (
          <ViewSizeModal open size={selected} onClose={handleCloseModal} />
        )}
        <PermissionWrapper requiredPermissions={['size:create']}>
          {modalType === 'add' && (
            <AddSizeModal
              open
              onClose={handleCloseModal}
              onAdded={handleSave}
            />
          )}
        </PermissionWrapper>
        <PermissionWrapper requiredPermissions={['size:update']}>
          {modalType === 'edit' && selected && (
            <EditSizeModal
              open
              size={selected}
              onClose={handleCloseModal}
              onSave={handleSave}
            />
          )}
        </PermissionWrapper>
        <PermissionWrapper requiredPermissions={['size:delete']}>
          {modalType === 'delete' && selected && (
            <DeleteSizeModal
              open
              size={selected}
              onClose={handleCloseModal}
              onDelete={handleSave}
            />
          )}
        </PermissionWrapper>
      </React.Suspense>
    </RouteGuard>
  )
}

export default SizePaletteManagement
