import React, { useState } from 'react'
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
import InventoryTable from './InventoryTable.jsx'
import useInventorys from '~/hooks/admin/Inventory/useInventorys.js'

const InventoryDashboard = () => {
  const [page] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [setSelectedInventory] = useState(null)
  const [setModalType] = useState(null)
  const [setOpenAdjustModal] = useState(false)
  const [setAdjustType] = useState('in')
  const [setSelectedInventoryId] = useState(null)

  const { inventories, loading, handleExport } = useInventorys(page)

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

  const handleExportExcel = async () => {
    await handleExport()
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
            📦 Quản lý Kho hàng 2
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
    </Box>
  )
}

export default InventoryDashboard
