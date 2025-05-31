import React, { useState } from 'react'
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
  Box
} from '@mui/material'

const InventoryLogTab = ({
  data,
  variants,
  warehouses,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) => {
  const [filterSku, setFilterSku] = useState('')
  const [filterLogWarehouse, setFilterLogWarehouse] = useState('all')
  const [filterLogType, setFilterLogType] = useState('all')
  const [filterLogDate, setFilterLogDate] = useState('all')

  const enrichedInventoryLogs = data.map((log) => {
    const variant = variants.find((v) => v.id === log.variantId)
    const warehouse = warehouses.find((w) => w.id === log.warehouseId)
    return {
      ...log,
      variantName: variant ? variant.name : 'N/A',
      warehouse: warehouse ? warehouse.name : 'N/A',
      typeLabel: log.type === 'in' ? 'Nhập' : 'Xuất',
      createdAtFormatted: new Date(log.createdAt).toLocaleDateString()
    }
  })

  const filteredInventoryLogs = enrichedInventoryLogs.filter((log) => {
    const variant = variants.find((v) => v.sku === filterSku || !filterSku)
    const warehouseMatch =
      filterLogWarehouse === 'all' || log.warehouse === filterLogWarehouse
    const typeMatch = filterLogType === 'all' || log.typeLabel === filterLogType
    const dateMatch =
      filterLogDate === 'all' ||
      new Date(log.createdAtFormatted).toLocaleDateString() === filterLogDate
    return variant && warehouseMatch && typeMatch && dateMatch
  })

  const inventoryLogColumns = [
    { id: 'variantName', label: 'Biến thể', minWidth: 150 },
    { id: 'warehouse', label: 'Kho', minWidth: 100 },
    { id: 'typeLabel', label: 'Loại', minWidth: 100 },
    {
      id: 'quantityChange',
      label: 'Số lượng thay đổi',
      minWidth: 120,
      align: 'right'
    },
    { id: 'note', label: 'Ghi chú', minWidth: 150 },
    { id: 'createdBy', label: 'Người thực hiện', minWidth: 120 },
    { id: 'createdAtFormatted', label: 'Ngày thực hiện', minWidth: 150 }
  ]

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
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
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number'
                          ? column.format(value)
                          : value}
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
    </Paper>
  )
}

export default InventoryLogTab
