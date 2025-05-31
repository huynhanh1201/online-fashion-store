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
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'

const InventoryTab = ({
  data,
  variants,
  warehouses,
  colors,
  sizes,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) => {
  const [filterWarehouse, setFilterWarehouse] = useState('all')
  const [filterColor, setFilterColor] = useState('all')
  const [filterSize, setFilterSize] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const enrichedInventories = data.map((item) => {
    const variant = variants.find((v) => v.id === item.variantId)
    const warehouse = warehouses.find((w) => w.id === item.warehouseId)
    return {
      ...item,
      sku: variant ? variant.sku : 'N/A',
      name: variant ? variant.name : 'N/A',
      warehouse: warehouse ? warehouse.name : 'N/A',
      color: variant ? variant.color.name : 'N/A',
      size: variant ? variant.size.name : 'N/A'
    }
  })

  const filteredInventories = enrichedInventories.filter((item) => {
    return (
      (filterWarehouse === 'all' || item.warehouse === filterWarehouse) &&
      (filterColor === 'all' || item.color === filterColor) &&
      (filterSize === 'all' || item.size === filterSize) &&
      (filterStatus === 'all' || item.status === filterStatus)
    )
  })

  const inventoryColumns = [
    { id: 'sku', label: 'SKU', minWidth: 100 },
    { id: 'name', label: 'Biến thể', minWidth: 150 },
    { id: 'warehouse', label: 'Kho', minWidth: 100 },
    { id: 'quantity', label: 'Số lượng', minWidth: 100, align: 'right' },
    {
      id: 'minQuantity',
      label: 'Ngưỡng cảnh báo',
      minWidth: 120,
      align: 'right'
    },
    { id: 'status', label: 'Trạng thái', minWidth: 100, align: 'center' },
    {
      id: 'importPrice',
      label: 'Giá nhập',
      minWidth: 100,
      align: 'right',
      format: (value) => `${value.toLocaleString()}đ`
    },
    {
      id: 'exportPrice',
      label: 'Giá bán',
      minWidth: 100,
      align: 'right',
      format: (value) => `${value.toLocaleString()}đ`
    },
    { id: 'action', label: 'Hành động', minWidth: 100, align: 'center' }
  ]

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='inventory table'>
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={inventoryColumns.length}
                sx={{ borderBottom: 'none', paddingBottom: '0' }}
              >
                <Typography variant='h6' sx={{ fontWeight: '800' }}>
                  Tồn kho theo kho
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={inventoryColumns.length}>
                <Box display='flex' gap={2}>
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
                      value={filterWarehouse}
                      onChange={(e) => setFilterWarehouse(e.target.value)}
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
                      value={filterColor}
                      onChange={(e) => setFilterColor(e.target.value)}
                    >
                      <MenuItem value='all'>Tất cả màu</MenuItem>
                      {colors.map((color) => (
                        <MenuItem key={color.id} value={color.name}>
                          {color.name}
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
                      value={filterSize}
                      onChange={(e) => setFilterSize(e.target.value)}
                    >
                      <MenuItem value='all'>Tất cả kích thước</MenuItem>
                      {sizes.map((size) => (
                        <MenuItem key={size.id} value={size.name}>
                          {size.name}
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
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <MenuItem value='all'>Tất cả trạng thái</MenuItem>
                      <MenuItem value='in-stock'>Còn hàng</MenuItem>
                      <MenuItem value='low-stock'>Cảnh báo</MenuItem>
                      <MenuItem value='out-of-stock'>Hết hàng</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {inventoryColumns.map((column) => (
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
            {filteredInventories
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                  {inventoryColumns.map((column) => {
                    let value = row[column.id]
                    if (column.id === 'status') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Chip
                            label={
                              value === 'in-stock'
                                ? 'Còn hàng'
                                : value === 'low-stock'
                                  ? 'Cảnh báo'
                                  : 'Hết hàng'
                            }
                            color={
                              value === 'in-stock'
                                ? 'success'
                                : value === 'low-stock'
                                  ? 'warning'
                                  : 'error'
                            }
                            size='small'
                          />
                        </TableCell>
                      )
                    }
                    if (column.id === 'action') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <VisibilityIcon />
                        </TableCell>
                      )
                    }
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
        count={filteredInventories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  )
}

export default InventoryTab
