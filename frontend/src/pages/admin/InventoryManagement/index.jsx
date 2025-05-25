import React, { useEffect } from 'react'
import { Typography, Button } from '@mui/material'
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
const AddInventoryModal = React.lazy(() => import('./modal/AddInventoryModal'))

const InventoryManagement = () => {
  const [page, setPage] = React.useState(1)
  const [selectedInventory, setSelectedInventory] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)
  const {
    inventories,
    totalPages,
    fetchInventories,
    loading,
    updateInventoryById,
    deleteInventoryById,
    createNewInventory
  } = useInventories(page)

  useEffect(() => {
    fetchInventories(page)
  }, [page])

  const handleOpenModal = (type, inventory) => {
    if (inventory && inventory._id) {
      setSelectedInventory(inventory) // Thiết lập selectedInventory cho các type khác
      setModalType(type)
    }
  }

  const handleCloseModal = () => {
    setSelectedInventory(null)
    setModalType(null)
  }

  const handleAddInventory = async (data) => {
    const result = await createNewInventory(data)
    if (result) handleCloseModal()
    return result
  }

  const updateInventory = async (id, data) => {
    const result = await updateInventoryById(id, data)
    if (result) await fetchInventories() // Giữ nguyên logic cũ
    return result
  }

  const deleteInventory = async (id) => {
    const result = await deleteInventoryById(id)
    handleCloseModal()
    if (result) await fetchInventories() // Giữ nguyên logic cũ
    return result
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
            onSave={updateInventory}
          />
        )}
        {modalType === 'delete' && selectedInventory && (
          <DeleteInventoryModal
            open
            onClose={handleCloseModal}
            inventory={selectedInventory}
            onDelete={deleteInventory}
          />
        )}
        {modalType === 'add' && selectedInventory && (
          <AddInventoryModal
            open
            onClose={handleCloseModal}
            onAdd={handleAddInventory}
            inventory={selectedInventory}
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
