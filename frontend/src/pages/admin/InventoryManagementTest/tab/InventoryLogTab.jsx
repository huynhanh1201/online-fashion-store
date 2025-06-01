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
import VisibilityIcon from '@mui/icons-material/Visibility'
import ViewInventoryLogModal from '../modal/InventoryLog/ViewInventoryLogModal'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete' // Thêm modal mới

const InventoryLogTab = ({
  data,
  variants,
  warehouses,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  refreshInventoryLogs
}) => {
  const [filterSku, setFilterSku] = useState('')
  const [filterLogWarehouse, setFilterLogWarehouse] = useState('all')
  const [filterLogType, setFilterLogType] = useState('all')
  const [filterLogDate, setFilterLogDate] = useState('all')
  const [openViewModal, setOpenViewModal] = useState(false) // State cho modal xem
  const [selectedLog, setSelectedLog] = useState(null) // State cho bản ghi được chọn

  useEffect(() => {
    refreshInventoryLogs()
  }, [])
  const handleViewLog = (log) => {
    setSelectedLog(log)
    setOpenViewModal(true)
  }

  const enrichedInventoryLogs = (data || []).map((log) => {
    return {
      ...log,
      variantName: log.variantId?.name || 'N/A',
      warehouse: log.warehouseId?.name || 'N/A',
      typeLabel: log.type === 'in' ? 'Nhập' : 'Xuất',
      createdAtFormatted: new Date(log.createdAt).toLocaleDateString('vi-VN'),
      createdByName: log.createdBy?.name || 'N/A'
    }
  })

  const filteredInventoryLogs = enrichedInventoryLogs.filter((log) => {
    const skuMatch =
      !filterSku ||
      variants.find((v) => v.id === log.variantId && v.sku === filterSku)

    const warehouseMatch =
      filterLogWarehouse === 'all' || log.warehouse === filterLogWarehouse
    const typeMatch = filterLogType === 'all' || log.typeLabel === filterLogType
    const dateMatch =
      filterLogDate === 'all' || log.createdAtFormatted === filterLogDate

    return skuMatch && warehouseMatch && typeMatch && dateMatch
  })

  const inventoryLogColumns = [
    { id: 'source', label: 'Mã phiếu', minWidth: 130 },
    { id: 'variantName', label: 'Biến thể', minWidth: 150 },
    { id: 'warehouse', label: 'Kho', minWidth: 100 },
    { id: 'typeLabel', label: 'Loại', minWidth: 100 },
    { id: 'amount', label: 'Số lượng', minWidth: 100, align: 'right' },
    { id: 'importPrice', label: 'Giá nhập', minWidth: 100, align: 'right' },
    { id: 'exportPrice', label: 'Giá xuất', minWidth: 100, align: 'right' },
    { id: 'note', label: 'Ghi chú', minWidth: 150 },
    { id: 'createdByName', label: 'Người thực hiện', minWidth: 120 },
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
                  <TextField
                    label='SKU'
                    value={filterSku}
                    onChange={(e) => setFilterSku(e.target.value)}
                    variant='outlined'
                    size='small'
                    sx={{ minWidth: 150 }}
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
                  >
                    <Select
                      value={filterLogWarehouse}
                      onChange={(e) => setFilterLogWarehouse(e.target.value)}
                    >
                      <MenuItem value='all'>Tất cả kho</MenuItem>
                      {warehouses.map((warehouse) => (
                        <MenuItem key={warehouse.id} value={warehouse.name}>
                          {warehouse.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    sx={{
                      minWidth: 200,
                      height: '40px',
                      '& .MuiInputBase-root': {
                        height: '40px',
                        padding: '0 14px 0 0'
                      }
                    }}
                  >
                    <Select
                      value={filterLogType}
                      onChange={(e) => setFilterLogType(e.target.value)}
                    >
                      <MenuItem value='all'>Tất cả</MenuItem>
                      <MenuItem value='Nhập'>Nhập</MenuItem>
                      <MenuItem value='Xuất'>Xuất</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl
                    sx={{
                      minWidth: 200,
                      height: '40px',
                      '& .MuiInputBase-root': {
                        height: '40px',
                        padding: '0 14px 0 0'
                      }
                    }}
                  >
                    <Select
                      value={filterLogDate}
                      onChange={(e) => setFilterLogDate(e.target.value)}
                    >
                      <MenuItem value='all'>Tất cả ngày</MenuItem>
                      {[
                        ...new Set(
                          enrichedInventoryLogs.map(
                            (log) => log.createdAtFormatted
                          )
                        )
                      ].map((date) => (
                        <MenuItem key={date} value={date}>
                          {date}
                        </MenuItem>
                      ))}
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
            {filteredInventoryLogs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                  {inventoryLogColumns.map((column) => {
                    const value = row[column.id]
                    if (column.id === 'typeLabel') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Chip
                            label={value}
                            size='small'
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
                            {value !== undefined ? value : '—'}
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
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      )
                    }
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {value !== undefined ? value : '—'}
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
        count={filteredInventoryLogs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
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
