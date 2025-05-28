import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material'
import {
  FilterList as FilterListIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material'
import InventoryTable from './InventoryTableApi'
import InventoryPagination from './InventoryPagination'
import useInventories from '~/hooks/admin/Inventory/useInventories'
import InventoryStatusCards from '~/components/dashboard/InventoryStatusCards.jsx'

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
const AdjustInventoryModal = React.lazy(
  () => import('./modal/AdjustInventoryModal')
)

const InventoryDashboard = () => {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedInventory, setSelectedInventory] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [openAdjustModal, setOpenAdjustModal] = useState(false)
  const [adjustType, setAdjustType] = useState('in')
  const [selectedInventoryId, setSelectedInventoryId] = useState(null)

  const {
    inventories,
    totalPages,
    fetchInventories,
    loading,
    updateInventoryById,
    deleteInventoryById,
    createNewInventory,
    handleExport,
    handleImport
  } = useInventories(page)

  useEffect(() => {
    fetchInventories(page)
  }, [page])

  const handleOpenModal = (type, inventory) => {
    if (!inventory || !inventory._id) return

    if (type === 'in' || type === 'out') {
      setAdjustType(type)
      setSelectedInventoryId(inventory._id)
      setSelectedInventory(inventory)
      setOpenAdjustModal(true)
      return
    }

    setSelectedInventory(inventory)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setSelectedInventory(null)
    setModalType(null)
    setOpenAdjustModal(false)
    fetchInventories(page)
  }

  const handleAddInventory = async (data) => {
    const result = await createNewInventory(data)
    if (result) handleCloseModal()
    return result
  }

  const updateInventory = async (id, data) => {
    const result = await updateInventoryById(id, data)
    if (result) await fetchInventories()
    return result
  }

  const deleteInventory = async (id) => {
    const result = await deleteInventoryById(id)
    if (result) {
      handleCloseModal()
      await fetchInventories()
    }
    return result
  }

  const handleAdjustSubmit = async (quantity) => {
    if (adjustType === 'in') {
      await handleImport(selectedInventoryId, quantity)
    } else {
      await handleExport(selectedInventoryId, quantity)
    }
    setOpenAdjustModal(false)
    fetchInventories(page)
  }

  const handleChangePage = (event, value) => {
    setPage(value)
  }

  const handleExportExcel = async () => {
    await handleExport()
  }

  // Tính tổng số lượng theo trạng thái
  const inventoryData = {
    inStock: inventories
      ? inventories.filter((item) => item.status === 'in-stock').length
      : 0,
    lowStock: inventories
      ? inventories.filter((item) => item.status === 'low-stock').length
      : 0,
    outOfStock: inventories
      ? inventories.filter((item) => item.status === 'out-of-stock').length
      : 0
  }

  // Lọc dữ liệu với kiểm tra undefined
  const filteredInventories = inventories
    ? inventories.filter((inventory) => {
        const sku = inventory.sku || ''
        const name = inventory.name || ''
        const matchesSearch =
          sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus =
          filterStatus === 'all' ||
          (inventory.status || '').toLowerCase() === filterStatus.toLowerCase()
        return matchesSearch && matchesStatus
      })
    : []

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: 'background.default',
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        mb={3}
      >
        <Box display='flex' alignItems='center' gap={1}>
          <Typography variant='h4' fontWeight='bold' color='primary'>
            📦 Quản lý Kho hàng
          </Typography>
        </Box>
        <Box display='flex' alignItems='center' gap={1}>
          <TextField
            size='small'
            placeholder='Tìm kiếm SKU hoặc tên...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 200 }}
          />
          <FormControl
            sx={{
              minWidth: 200,
              height: '40px',
              '& .MuiInputBase-root': {
                height: '40px',
                padding: '0 14px 0 0'
              }
            }}
            size='small'
          >
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value='all'>Tất cả trạng thái</MenuItem>
              <MenuItem value='in-stock'>Còn hàng</MenuItem>
              <MenuItem value='low-stock'>Cảnh báo</MenuItem>
              <MenuItem value='out-of-stock'>Hết hàng</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant='contained'
            color='primary'
            onClick={() => setModalType('add')}
            sx={{ px: 3 }}
          >
            + Tạo mới
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            startIcon={<FileDownloadIcon />}
            onClick={handleExportExcel}
          >
            Xuất Excel
          </Button>
        </Box>
      </Box>

      {/* Bảng dữ liệu */}
      {loading ? (
        <Box display='flex' justifyContent='center' my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <InventoryTable
            inventories={filteredInventories}
            loading={loading}
            handleOpenModal={handleOpenModal}
          />
          {/*<InventoryPagination*/}
          {/*  page={page}*/}
          {/*  totalPages={totalPages}*/}
          {/*  onPageChange={handleChangePage}*/}
          {/*/>*/}
        </>
      )}

      {/* Modal */}
      <React.Suspense
        fallback={
          <Box display='flex' justifyContent='center' my={4}>
            <CircularProgress />
          </Box>
        }
      >
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
        {modalType === 'add' && (
          <AddInventoryModal
            open
            onClose={handleCloseModal}
            onAdd={handleAddInventory}
          />
        )}
        {openAdjustModal && selectedInventory && (
          <AdjustInventoryModal
            open={openAdjustModal}
            onClose={() => setOpenAdjustModal(false)}
            onSubmit={handleAdjustSubmit}
            type={adjustType}
            inventory={selectedInventory}
          />
        )}
      </React.Suspense>
      {/*<InventoryStatusCards inventoryData={inventoryData} />*/}
    </Box>
  )
}

export default InventoryDashboard
