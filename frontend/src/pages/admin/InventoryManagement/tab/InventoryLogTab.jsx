// InventoryLogTab.js
import React, { useState, useEffect } from 'react'
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Box,
  IconButton,
  Chip
} from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import ViewInventoryLogModal from '../modal/InventoryLog/ViewInventoryLogModal'

const InventoryLogTab = ({
  data,
  variants,
  warehouses,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  refreshInventoryLogs,
  inventories,
  fetchInventories,
  fetchVariants,
  batches,
  fetchBatches,
  total
}) => {
  const [filterInventory, setFilterInventory] = useState('all')
  const [filterBatchId, setFilterBatchId] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterSource, setFilterSource] = useState('all')
  const [openViewModal, setOpenViewModal] = useState(false) // State cho modal xem
  const [selectedLog, setSelectedLog] = useState(null) // State cho bản ghi được chọn

  useEffect(() => {
    refreshInventoryLogs(page, rowsPerPage)
    fetchInventories()
    fetchVariants()
    fetchBatches()
  }, [page, rowsPerPage])
  const handleViewLog = (log) => {
    setSelectedLog(log)
    setOpenViewModal(true)
  }
  const enrichedInventoryLogs = (data || []).map((log) => {
    return {
      ...log,
      batchName:
        batches.find((batch) => batch._id === log.batchId)?.batchCode || 'N/A',
      variantName: log.inventoryId.variantId?.name || 'N/A',
      warehouse: log.inventoryId.warehouseId?.name || 'N/A',
      typeLabel: log.type === 'in' ? 'Nhập' : 'Xuất',
      createdAtFormatted: new Date(log.createdAt).toLocaleDateString('vi-VN'),
      createdByName: log.createdBy?.name || 'N/A'
    }
  })

  const filteredInventoryLogs = enrichedInventoryLogs.filter((log) => {
    const inventoryMatch =
      filterInventory === 'all' ||
      log.inventoryId === filterInventory ||
      log.inventoryId?._id === filterInventory

    const typeMatch = filterType === 'all' || log.type === filterType

    const batchMatch = filterBatchId === 'all' || log.batchId === filterBatchId

    const sourceMatch = filterSource === 'all' || log.source === filterSource

    return typeMatch && batchMatch && sourceMatch && inventoryMatch
  })

  const handleFilterChange = (type, value) => {
    const newInventoryId = type === 'inventoryId' ? value : filterInventory
    const newType = type === 'type' ? value : filterType
    const newBatchId = type === 'batchId' ? value : filterBatchId
    const newSource = type === 'source' ? value : filterSource

    if (type === 'inventoryId') setFilterInventory(value)
    if (type === 'type') setFilterType(value)
    if (type === 'batchId') setFilterBatchId(value)
    if (type === 'source') setFilterSource(value)

    const filters = {}
    if (newInventoryId !== 'all') filters.inventoryId = newInventoryId
    if (newType !== 'all') filters.type = newType
    if (newBatchId !== 'all') filters.batchId = newBatchId
    if (newSource !== 'all') filters.source = newSource

    refreshInventoryLogs(page > 0 ? page : 1, 10, filters)
  }
  const inventoryLogColumns = [
    { id: 'source', label: 'Mã phiếu', minWidth: 130 },
    { id: 'variantName', label: 'Biến thể', minWidth: 150 },
    { id: 'warehouse', label: 'Kho', minWidth: 100 },
    { id: 'typeLabel', label: 'Loại', minWidth: 100, align: 'center' },
    {
      id: 'amount',
      label: 'Số lượng',
      minWidth: 100,
      align: 'right',
      format: (value) => `${value.toLocaleString('vi-VN')}`
    },
    {
      id: 'importPrice',
      label: 'Giá nhập',
      minWidth: 100,
      align: 'right',
      format: (value) => `${value.toLocaleString('vi-VN')}đ`
    },
    {
      id: 'exportPrice',
      label: 'Giá xuất',
      minWidth: 100,
      align: 'right',
      format: (value) => `${value.toLocaleString('vi-VN')}đ`
    },
    {
      id: 'createdByName',
      label: 'Người thực hiện',
      minWidth: 120,
      align: 'center'
    },
    { id: 'createdAtFormatted', label: 'Ngày thực hiện', minWidth: 150 },
    { id: 'action', label: 'Hành động', minWidth: 100, align: 'center' }
  ]
  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label='inventory log table'>
          <TableHead>
            <TableRow sx={{ paddingBottom: '0' }}>
              <TableCell
                colSpan={inventoryLogColumns.length}
                sx={{ borderBottom: 'none', paddingBottom: '0' }}
              >
                <Typography variant='h6' sx={{ fontWeight: '800' }}>
                  Lịch sử biến động kho
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={inventoryLogColumns.length}>
                <Box display='flex' gap={2} alignItems='center'>
                  <FormControl
                    variant='outlined'
                    size='small'
                    sx={{ minWidth: 120 }}
                  >
                    <InputLabel id='inventory-select-label'>
                      Tồn theo kho
                    </InputLabel>
                    <Select
                      labelId='inventory-select-label'
                      value={filterInventory}
                      onChange={(e) =>
                        handleFilterChange('inventoryId', e.target.value)
                      }
                      label='Tồn theo kho'
                    >
                      <MenuItem value='all'>Tất cả</MenuItem>
                      {inventories.map((inventory) => (
                        <MenuItem key={inventory._id} value={inventory._id}>
                          {inventory.variantId.name} -{' '}
                          {inventory.warehouseId.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    variant='outlined'
                    size='small'
                    sx={{ minWidth: 120 }}
                  >
                    <InputLabel id='type-select-label'>Loại</InputLabel>
                    <Select
                      labelId='type-select-label'
                      value={filterType}
                      onChange={(e) =>
                        handleFilterChange('type', e.target.value)
                      }
                      label='Loại'
                    >
                      <MenuItem value='all'>Tất cả</MenuItem>
                      <MenuItem value='in'>Nhập</MenuItem>
                      <MenuItem value='out'>Xuất</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel>Lô hàng</InputLabel>
                    <Select
                      value={filterBatchId}
                      onChange={(e) => setFilterBatchId(e.target.value)}
                      label='Lô hàng'
                      size='small'
                    >
                      <MenuItem value='all'>Tất cả</MenuItem>
                      {[
                        ...new Set(
                          enrichedInventoryLogs.map((log) => log.batchId)
                        )
                      ].map((id) => {
                        const batchName =
                          enrichedInventoryLogs.find(
                            (log) => log.batchId === id
                          )?.batchName || id
                        return (
                          <MenuItem key={id} value={id}>
                            {batchName}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                  <FormControl
                    variant='outlined'
                    size='small'
                    sx={{ minWidth: 120 }}
                  >
                    <InputLabel id='source-select-label'>Mã phiếu</InputLabel>
                    <Select
                      labelId='source-select-label'
                      value={filterSource}
                      onChange={(e) =>
                        handleFilterChange('source', e.target.value)
                      }
                      label='Mã phiếu'
                    >
                      <MenuItem value='all'>Tất cả</MenuItem>
                      {[...new Set(data.map((log) => log.source))].map(
                        (source) => (
                          <MenuItem key={source} value={source}>
                            {source}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {inventoryLogColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventoryLogs.map((row, index) => (
              <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                {inventoryLogColumns.map((column) => {
                  const value = row[column.id]
                  if (column.id === 'typeLabel') {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <Chip
                          label={value}
                          size='large'
                          sx={{ width: '90px', fontWeight: '800' }}
                          color={value === 'Nhập' ? 'success' : 'error'}
                        />
                      </TableCell>
                    )
                  }
                  if (column.id === 'amount') {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <Typography
                          sx={{
                            fontWeight: 900,
                            color: row.typeLabel === 'Nhập' ? 'green' : 'red'
                          }}
                        >
                          {value !== undefined
                            ? `${row.typeLabel === 'Nhập' ? '+' : ''}${value}`
                            : '—'}
                        </Typography>
                      </TableCell>
                    )
                  }
                  if (column.id === 'action') {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <IconButton
                          onClick={() => handleViewLog(row)}
                          size='small'
                          color='primary'
                        >
                          <RemoveRedEyeIcon color='primary' />
                        </IconButton>
                      </TableCell>
                    )
                  }
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format ? column.format(value) : value}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={total || 0}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={(event, newPage) => onPageChange(event, newPage)} // +1 để giữ page bắt đầu từ 1
        onRowsPerPageChange={(event) => onRowsPerPageChange(event, 'log')} // giữ đúng chuẩn
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`
        }
      />

      <ViewInventoryLogModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        log={selectedLog}
        variants={variants}
        warehouses={warehouses}
      />
    </Paper>
  )
}

export default InventoryLogTab
