// ✅ Đã chuẩn hóa giống CategoryManagement
import React from 'react'
import { RouteGuard, PermissionWrapper } from '~/components/PermissionGuard'
import { Typography, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import useColorPalettes from '~/hooks/admin/useColorPalettes'
import ColorPaletteTable from './ColorPaletteTable'

const AddColorModal = React.lazy(() => import('./modal/AddColorModal'))
const EditColorModal = React.lazy(() => import('./modal/EditColorModal'))
const DeleteColorModal = React.lazy(() => import('./modal/DeleteColorModal'))
const ViewColorModal = React.lazy(() => import('./modal/ViewColorModal'))

const ColorPaletteManagement = ({ productId = '6853ef5fa2331414899bfaf2' }) => {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [selected, setSelected] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)

  const {
    colorPalettes,
    totalPages,
    loading,
    fetchColorPalettes,
    addColorPalette,
    updateColorPalette,
    deleteColorPalette
  } = useColorPalettes({ productId })

  React.useEffect(() => {
    fetchColorPalettes(page, limit)
  }, [page, limit])

  const handleSave = async (data, type, id) => {
    if (type === 'add') await addColorPalette(data)
    else if (type === 'edit') await updateColorPalette(id, data)
    else if (type === 'delete') await deleteColorPalette(id)
    setModalType(null)
    setSelected(null)
  }

  const handleCloseModal = () => {
    setModalType(null)
    setSelected(null)
  }

  return (
    <RouteGuard requiredPermissions={['admin:access', 'color:read']}>
      <ColorPaletteTable
        colorPalettes={colorPalettes}
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
        addColor={() => setModalType('add')}
      />

      <React.Suspense fallback={null}>
        {modalType === 'view' && selected && (
          <ViewColorModal open color={selected} onClose={handleCloseModal} />
        )}
        <PermissionWrapper requiredPermissions={['color:create']}>
          {modalType === 'add' && (
            <AddColorModal
              open
              onClose={handleCloseModal}
              onAdded={handleSave}
            />
          )}
        </PermissionWrapper>
        <PermissionWrapper requiredPermissions={['color:update']}>
          {modalType === 'edit' && selected && (
            <EditColorModal
              open
              color={selected}
              onClose={handleCloseModal}
              onSave={handleSave}
            />
          )}
        </PermissionWrapper>
        <PermissionWrapper requiredPermissions={['color:delete']}>
          {modalType === 'delete' && selected && (
            <DeleteColorModal
              open
              color={selected}
              onClose={handleCloseModal}
              onDelete={handleSave}
            />
          )}
        </PermissionWrapper>
      </React.Suspense>
    </RouteGuard>
  )
}

export default ColorPaletteManagement
