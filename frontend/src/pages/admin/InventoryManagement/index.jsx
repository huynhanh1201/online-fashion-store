import React from 'react'
import { Typography } from '@mui/material'
import InventoryTable from './InventoryTable'
import InventoryPagination from './InventoryPagination'
import useInventories from '~/hooks/admin/useInventories'

// Lazy load các modal
const ViewInventoryModal = React.lazy(
  () => import('./modal/ViewInventoryModal')
)
const EditInventoryModal = React.lazy(
  () => import('./modal/EditInventoryModal')
)
const DeleteInventoryModal = React.lazy(
  () => import('./modal/DeleteInventoryModal')
)

const InventoryManagement = () => {
  const [page, setPage] = React.useState(1)
  const [selectedInventory, setSelectedInventory] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)

  const { inventories, totalPages, fetchInventories, loading } =
    useInventories()

  React.useEffect(() => {
    fetchInventories(page)
  }, [page])

  const handleOpenModal = (type, inventory) => {
    if (!inventory || !inventory._id) return
    setSelectedInventory(inventory)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setSelectedInventory(null)
    setModalType(null)
  }

  const handleChangePage = (event, value) => setPage(value)

  return (
    <>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Quản lý kho hàng
      </Typography>

      <InventoryTable
        inventories={inventories}
        loading={loading}
        handleOpenModal={handleOpenModal}
      />

      <React.Suspense fallback={<></>}>
        {modalType === 'view' && selectedInventory && (
          <ViewInventoryModal
            open
            onClose={handleCloseModal}
            inventory={selectedInventory}
          />
        )}
        {modalType === 'edit' && selectedInventory && (
          <EditInventoryModal
            open
            onClose={handleCloseModal}
            inventory={selectedInventory}
            onUpdated={() => fetchInventories(page)}
          />
        )}
        {modalType === 'delete' && selectedInventory && (
          <DeleteInventoryModal
            open
            onClose={handleCloseModal}
            inventory={selectedInventory}
            onDeleted={() => fetchInventories(page)}
          />
        )}
      </React.Suspense>

      <InventoryPagination
        page={page}
        totalPages={totalPages}
        onPageChange={handleChangePage}
      />
    </>
  )
}

export default InventoryManagement
