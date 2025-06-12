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
import FilterInventoryLog from '~/components/FilterAdmin/FilterInventoryLog.jsx'

const InventoryLogTab = ({
  data,
  variants,
  warehouses,
  page,
  rowsPerPage,
  onPageChange,
  onChangeRowsPerPage,
  refreshInventoryLogs,
  inventories,
  fetchInventories,
  fetchVariants,
  batches,
  fetchBatches,
  total,
  loading,
  fetchUsers,
  users,
  fetchWarehouses
}) => {
  const [filters, setFilters] = useState({}) // State cho kho
  const [openViewModal, setOpenViewModal] = useState(false) // State cho modal xem
  const [selectedLog, setSelectedLog] = useState(null) // State cho bản ghi được chọn
  useEffect(() => {
    fetchInventories()
    fetchVariants()
    fetchBatches()
    fetchUsers()
    fetchWarehouses()
  }, [])
  useEffect(() => {
    refreshInventoryLogs(page, rowsPerPage, filters)
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

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    if (Object.keys(newFilters).length > 0) {
      refreshInventoryLogs(1, rowsPerPage, newFilters)
    }
  }
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
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      minWidth: 250
                    }}
                  >
                    <Typography variant='h6' sx={{ fontWeight: '800' }}>
                      Lịch sử nhập xuất kho
                    </Typography>
                  </Box>
                  <FilterInventoryLog
                    warehouses={warehouses}
                    onFilter={handleFilter}
                    loading={loading}
                    batches={batches}
                    inventories={inventories}
                    users={users}
                    inventoryLog={data || []}
                  />
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
            {enrichedInventoryLogs.map((row, index) => (
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
        onPageChange={(event, newPage) => onPageChange(event, newPage + 1)} // +1 để đúng logic bên cha
        onRowsPerPageChange={(event) => {
          const newLimit = parseInt(event.target.value, 10)
          if (onChangeRowsPerPage) {
            onChangeRowsPerPage(newLimit)
          }
        }}
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
