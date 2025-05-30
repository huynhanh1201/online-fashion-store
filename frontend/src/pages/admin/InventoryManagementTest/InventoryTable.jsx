import React, { useState } from 'react'
import {
  Box,
  Tabs,
  Tab,
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
  TextField,
  Typography
} from '@mui/material'
import {
  Products,
  Variants,
  Inventory,
  Warehouses,
  WarehouseSlips,
  Batch,
  InventoryLog,
  Colors,
  Sizes
} from './data.js'
import VisibilityIcon from '@mui/icons-material/Visibility'
const InventoryTable = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filterWarehouse, setFilterWarehouse] = useState('all')
  const [filterColor, setFilterColor] = useState('all')
  const [filterSize, setFilterSize] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Bộ lọc cho tab Lịch sử
  const [filterSku, setFilterSku] = useState('')
  const [filterLogWarehouse, setFilterLogWarehouse] = useState('all')
  const [filterLogType, setFilterLogType] = useState('all')
  const [filterLogDate, setFilterLogDate] = useState('all')

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setPage(0)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const tabLabels = [
    'Tồn kho',
    'Phiếu nhập/xuất',
    'Lịch sử',
    'Kho hàng',
    'Biến thể',
    'Lô hàng'
  ]

  // Tab 1: Tồn kho
  const enrichedInventories = Inventory.map((item) => {
    const variant = Variants.find((v) => v.id === item.variantId)
    const warehouse = Warehouses.find((w) => w.id === item.warehouseId)
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

  // Tab 2: Phiếu nhập/xuất
  const enrichedWarehouseSlips = WarehouseSlips.map((slip) => {
    const warehouse = Warehouses.find((w) => w.id === slip.warehouseId)
    return {
      ...slip,
      warehouse: warehouse ? warehouse.name : 'N/A',
      typeLabel: slip.type === 'input' ? 'Nhập' : 'Xuất',
      statusLabel: slip.status === 'done' ? 'Hoàn thành' : 'Đang xử lý',
      createdAtFormatted: new Date(slip.createdAt).toLocaleString()
    }
  })

  const warehouseSlipColumns = [
    { id: 'code', label: 'Mã phiếu', minWidth: 100 },
    { id: 'typeLabel', label: 'Loại', minWidth: 100 },
    { id: 'warehouse', label: 'Kho', minWidth: 100 },
    { id: 'statusLabel', label: 'Trạng thái', minWidth: 100 },
    { id: 'note', label: 'Ghi chú', minWidth: 150 },
    { id: 'createdAtFormatted', label: 'Ngày tạo', minWidth: 150 },
    { id: 'action', label: 'Hành động', minWidth: 100, align: 'center' }
  ]

  // Tab 3: Lịch sử (InventoryLog)
  const enrichedInventoryLogs = InventoryLog.map((log) => {
    const variant = Variants.find((v) => v.id === log.variantId)
    const warehouse = Warehouses.find((w) => w.id === log.warehouseId)
    return {
      ...log,
      variantName: variant ? variant.name : 'N/A',
      warehouse: warehouse ? warehouse.name : 'N/A',
      typeLabel: log.type === 'in' ? 'Nhập' : 'Xuất',
      createdAtFormatted: new Date(log.createdAt).toLocaleDateString() // Định dạng ngày
    }
  })

  // Lọc dữ liệu cho tab Lịch sử
  const filteredInventoryLogs = enrichedInventoryLogs.filter((log) => {
    const variant = Variants.find((v) => v.sku === filterSku || !filterSku)
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

  // Tab 4: Kho hàng (Warehouses)
  const warehouseColumns = [
    { id: 'code', label: 'Mã kho', minWidth: 100 },
    { id: 'name', label: 'Tên kho', minWidth: 120 },
    { id: 'address', label: 'Địa chỉ', minWidth: 150 },
    { id: 'ward', label: 'Phường', minWidth: 100 },
    { id: 'district', label: 'Quận', minWidth: 100 },
    { id: 'city', label: 'Thành phố', minWidth: 100 },
    { id: 'action', label: 'Hành động', minWidth: 100, align: 'center' }
  ]

  // Tab 5: Biến thể (Variants)
  const enrichedVariants = Variants.map((variant) => {
    const product = Products.find((p) => p.id === variant.productId)
    return {
      ...variant,
      productName: product ? product.name : 'N/A'
    }
  })

  const variantColumns = [
    { id: 'sku', label: 'SKU', minWidth: 100 },
    { id: 'name', label: 'Tên biến thể', minWidth: 150 },
    { id: 'productName', label: 'Sản phẩm', minWidth: 150 },
    { id: 'color.name', label: 'Màu sắc', minWidth: 100 },
    { id: 'size.name', label: 'Kích thước', minWidth: 100 },
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

  // Tab 6: Lô hàng (Batch)
  const enrichedBatches = Batch.map((batch) => {
    const slip = WarehouseSlips.find((s) => s.id === batch.warehouseSlipId)
    const variant = Variants.find((v) => v.id === batch.variantId)
    return {
      ...batch,
      slipCode: slip ? slip.code : 'N/A',
      variantName: variant ? variant.name : 'N/A',
      createdAtFormatted: new Date(batch.createdAt).toLocaleString()
    }
  })

  const batchColumns = [
    { id: 'slipCode', label: 'Mã phiếu', minWidth: 100 },
    { id: 'variantName', label: 'Biến thể', minWidth: 150 },
    { id: 'quantity', label: 'Số lượng', minWidth: 100, align: 'right' },
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
    { id: 'createdAtFormatted', label: 'Ngày tạo', minWidth: 150 },
    { id: 'action', label: 'Hành động', minWidth: 100, align: 'center' }
  ]

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label='inventory tabs'
      >
        {tabLabels.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>
      <Box sx={{ p: 2 }}>
        {/* Tab 1: Tồn kho */}
        {activeTab === 0 && (
          <Paper
            sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}
          >
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
                            {Warehouses.map((warehouse) => (
                              <MenuItem
                                key={warehouse.id}
                                value={warehouse.name}
                              >
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
                            {Colors.map((color) => (
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
                            {Sizes.map((size) => (
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
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}

        {/* Tab 2: Phiếu nhập/xuất */}
        {activeTab === 1 && (
          <Paper
            sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}
          >
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='warehouse slips table'>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={inventoryColumns.length}>
                      <Typography variant='h6' sx={{ fontWeight: '800' }}>
                        Danh sách phiếu nhập/xuất kho
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {warehouseSlipColumns.map((column) => (
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
                  {enrichedWarehouseSlips
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                        {warehouseSlipColumns.map((column) => {
                          const value = row[column.id]
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
              count={enrichedWarehouseSlips.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}

        {/* Tab 3: Lịch sử */}
        {activeTab === 2 && (
          <Paper
            sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}
          >
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
                            onChange={(e) =>
                              setFilterLogWarehouse(e.target.value)
                            }
                          >
                            <MenuItem value='all'>Tất cả kho</MenuItem>
                            {Warehouses.map((warehouse) => (
                              <MenuItem
                                key={warehouse.id}
                                value={warehouse.name}
                              >
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
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}

        {/* Tab 4: Kho hàng */}
        {activeTab === 3 && (
          <Paper
            sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}
          >
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='warehouses table'>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={inventoryColumns.length}>
                      <Typography variant='h6' sx={{ fontWeight: '800' }}>
                        Danh sách kho hàng
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {warehouseColumns.map((column) => (
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
                  {Warehouses.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  ).map((row, index) => (
                    <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                      {warehouseColumns.map((column) => {
                        const value = row[column.id]
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
              count={Warehouses.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}

        {/* Tab 5: Biến thể */}
        {activeTab === 4 && (
          <Paper
            sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}
          >
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='variants table'>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={inventoryColumns.length}>
                      <Typography variant='h6' sx={{ fontWeight: '800' }}>
                        Danh sách biến thể sản phẩm
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {variantColumns.map((column) => (
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
                  {enrichedVariants
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                        {variantColumns.map((column) => {
                          let value = column.id.includes('.')
                            ? column.id.split('.').reduce((o, i) => o[i], row)
                            : row[column.id]
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
              count={enrichedVariants.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}

        {/* Tab 6: Lô hàng */}
        {activeTab === 5 && (
          <Paper
            sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}
          >
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='batches table'>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={inventoryColumns.length}>
                      <Typography variant='h6' sx={{ fontWeight: '800' }}>
                        Quản lý Lô hàng
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {batchColumns.map((column) => (
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
                  {enrichedBatches
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                        {batchColumns.map((column) => {
                          const value = row[column.id]
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
              count={enrichedBatches.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </Box>
    </Box>
  )
}

export default InventoryTable
