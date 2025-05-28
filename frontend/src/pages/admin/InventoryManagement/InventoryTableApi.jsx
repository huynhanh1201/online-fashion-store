import React, { useState, useEffect } from 'react'
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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'
import useInventories from '~/hooks/admin/Inventory/useInventories.js'
import useVariants from '~/hooks/admin/Inventory/useVariants.js'
import useWarehouses from '~/hooks/admin/Inventory/useWarehouses.js'
import useBatches from '~/hooks/admin/Inventory/useBatches.js'
import useInventoryLogs from '~/hooks/admin/Inventory/useInventoryLogs.js'
import useColors from '~/hooks/admin/useColor'
import useSizes from '~/hooks/admin/useSize'
import useProducts from '~/hooks/admin/useProducts'
import {
  createWarehouse,
  updateWarehouse,
  deleteWarehouse
} from '~/services/admin/Inventory/WarehouseService' // Import warehouse services
import {
  createVariant,
  updateVariant,
  deleteVariant
} from '~/services/admin/Inventory/VariantService' // Import variant services
import {
  createBatch,
  updateBatch,
  deleteBatch
} from '~/services/admin/Inventory/BatchService' // Import batch services

const InventoryTable = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filterWarehouse, setFilterWarehouse] = useState('all')
  const [filterColor, setFilterColor] = useState('all')
  const [filterSize, setFilterSize] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Filters for the "Lịch sử" tab
  const [filterSku, setFilterSku] = useState('')
  const [filterLogWarehouse, setFilterLogWarehouse] = useState('all')
  const [filterLogType, setFilterLogType] = useState('all')
  const [filterLogDate, setFilterLogDate] = useState('all')

  // State for modal (add/edit/delete)
  const [openModal, setOpenModal] = useState(false)
  const [modalType, setModalType] = useState(null) // 'add', 'edit', 'delete'
  const [selectedItem, setSelectedItem] = useState(null)
  const [newItemData, setNewItemData] = useState({
    variantId: '',
    warehouseId: '',
    quantity: '',
    minQuantity: '',
    status: 'in-stock',
    importPrice: '',
    exportPrice: '',
    // Fields for warehouses
    code: '',
    name: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    // Fields for variants
    productId: '',
    colorId: '',
    sizeId: '',
    // Fields for batches
    slipCode: ''
  })

  // Hooks to fetch data
  const {
    inventories,
    totalPages: inventoryTotalPages,
    fetchInventories,
    createNewInventory,
    updateInventoryById,
    deleteInventoryById
  } = useInventories(page + 1, rowsPerPage)
  const { variants, fetchVariants } = useVariants()
  const { warehouses, fetchWarehouses } = useWarehouses()
  const { batches, fetchBatches } = useBatches()
  const { logs, fetchLogs } = useInventoryLogs(page + 1, rowsPerPage)
  const { colors } = useColors()
  const { sizes } = useSizes()
  const { products } = useProducts()

  // Fetch inventories with filters
  useEffect(() => {
    fetchInventories(page + 1, {
      warehouse: filterWarehouse !== 'all' ? filterWarehouse : undefined,
      color: filterColor !== 'all' ? filterColor : undefined,
      size: filterSize !== 'all' ? filterSize : undefined,
      status: filterStatus !== 'all' ? filterStatus : undefined
    })
  }, [
    page,
    rowsPerPage,
    filterWarehouse,
    filterColor,
    filterSize,
    filterStatus,
    fetchInventories
  ])

  // Fetch logs with filters (server-side filtering)
  useEffect(() => {
    fetchLogs({
      sku: filterSku || undefined,
      warehouse: filterLogWarehouse !== 'all' ? filterLogWarehouse : undefined,
      type:
        filterLogType !== 'all'
          ? filterLogType === 'Nhập'
            ? 'in'
            : 'out'
          : undefined,
      date: filterLogDate !== 'all' ? filterLogDate : undefined
    })
  }, [
    page,
    rowsPerPage,
    filterSku,
    filterLogWarehouse,
    filterLogType,
    filterLogDate,
    fetchLogs
  ])

  // Fetch variants, warehouses, and other data on mount
  useEffect(() => {
    fetchVariants()
    fetchWarehouses()
    fetchBatches()
  }, [fetchVariants, fetchWarehouses, fetchBatches])

  // Enrich data for display
  const enrichedInventories = inventories.map((item) => {
    const variant = variants.find((v) => v._id === item.variantId)
    const warehouse = warehouses.find((w) => w._id === item.warehouseId)
    return {
      ...item,
      sku: variant ? variant.sku : 'N/A',
      name: variant ? variant.name : 'N/A',
      warehouse: warehouse ? warehouse.name : 'N/A',
      color: variant && variant.color ? variant.color.name : 'N/A',
      size: variant && variant.size ? variant.size.name : 'N/A'
    }
  })

  const enrichedInventoryLogs = logs.map((log) => {
    const variant = variants.find((v) => v._id === log.variantId)
    const warehouse = warehouses.find((w) => w._id === log.warehouseId)
    return {
      ...log,
      variantName: variant ? variant.name : 'N/A',
      warehouse: warehouse ? warehouse.name : 'N/A',
      typeLabel: log.type === 'in' ? 'Nhập' : 'Xuất',
      createdAtFormatted: new Date(log.createdAt).toLocaleDateString()
    }
  })

  const enrichedVariants = variants.map((variant) => {
    const product = products.find((p) => p._id === variant.productId)
    return {
      ...variant,
      productName: product ? product.name : 'N/A'
    }
  })

  const enrichedBatches = batches.map((batch) => {
    const variant = variants.find((v) => v._id === batch.variantId)
    return {
      ...batch,
      variantName: variant ? variant.name : 'N/A',
      createdAtFormatted: new Date(batch.createdAt).toLocaleString()
    }
  })

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

  // Handle modal open
  const handleOpenModal = (type, item = null) => {
    setModalType(type)
    setSelectedItem(item)
    if (type === 'add') {
      if (activeTab === 0) {
        // Tồn kho
        setNewItemData({
          variantId: '',
          warehouseId: '',
          quantity: '',
          minQuantity: '',
          status: 'in-stock',
          importPrice: '',
          exportPrice: ''
        })
      } else if (activeTab === 3) {
        // Kho hàng
        setNewItemData({
          code: '',
          name: '',
          address: '',
          ward: '',
          district: '',
          city: ''
        })
      } else if (activeTab === 4) {
        // Biến thể
        setNewItemData({
          productId: '',
          colorId: '',
          sizeId: '',
          importPrice: '',
          exportPrice: ''
        })
      } else if (activeTab === 5) {
        // Lô hàng
        setNewItemData({
          variantId: '',
          slipCode: '',
          quantity: '',
          importPrice: '',
          exportPrice: ''
        })
      }
    } else if (type === 'edit' && item) {
      if (activeTab === 0) {
        // Tồn kho
        setNewItemData({
          variantId: item.variantId || '',
          warehouseId: item.warehouseId || '',
          quantity: item.quantity || '',
          minQuantity: item.minQuantity || '',
          status: item.status || 'in-stock',
          importPrice: item.importPrice || '',
          exportPrice: item.exportPrice || ''
        })
      } else if (activeTab === 3) {
        // Kho hàng
        setNewItemData({
          _id: item._id,
          code: item.code || '',
          name: item.name || '',
          address: item.address || '',
          ward: item.ward || '',
          district: item.district || '',
          city: item.city || ''
        })
      } else if (activeTab === 4) {
        // Biến thể
        setNewItemData({
          _id: item._id,
          productId: item.productId || '',
          colorId: item.color?._id || '',
          sizeId: item.size?._id || '',
          importPrice: item.importPrice || '',
          exportPrice: item.exportPrice || ''
        })
      } else if (activeTab === 5) {
        // Lô hàng
        setNewItemData({
          _id: item._id,
          variantId: item.variantId || '',
          slipCode: item.slipCode || '',
          quantity: item.quantity || '',
          importPrice: item.importPrice || '',
          exportPrice: item.exportPrice || ''
        })
      }
    }
    setOpenModal(true)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setOpenModal(false)
    setModalType(null)
    setSelectedItem(null)
  }

  // Handle add new item
  const handleAddItem = async () => {
    if (activeTab === 0) {
      // Tồn kho
      const result = await createNewInventory(newItemData)
      if (result) {
        handleCloseModal()
        fetchInventories(page + 1)
      }
    } else if (activeTab === 3) {
      // Kho hàng
      const result = await createWarehouse(newItemData)
      if (result) {
        handleCloseModal()
        fetchWarehouses()
      }
    } else if (activeTab === 4) {
      // Biến thể
      const result = await createVariant(newItemData)
      if (result) {
        handleCloseModal()
        fetchVariants()
      }
    } else if (activeTab === 5) {
      // Lô hàng
      const result = await createBatch(newItemData)
      if (result) {
        handleCloseModal()
        fetchBatches()
      }
    }
  }

  // Handle update item
  const handleUpdateItem = async () => {
    if (selectedItem && selectedItem._id) {
      if (activeTab === 0) {
        // Tồn kho
        const result = await updateInventoryById(selectedItem._id, newItemData)
        if (result) {
          handleCloseModal()
          fetchInventories(page + 1)
        }
      } else if (activeTab === 3) {
        // Kho hàng
        const result = await updateWarehouse(selectedItem._id, newItemData)
        if (result) {
          handleCloseModal()
          fetchWarehouses()
        }
      } else if (activeTab === 4) {
        // Biến thể
        const result = await updateVariant(selectedItem._id, newItemData)
        if (result) {
          handleCloseModal()
          fetchVariants()
        }
      } else if (activeTab === 5) {
        // Lô hàng
        const result = await updateBatch(selectedItem._id, newItemData)
        if (result) {
          handleCloseModal()
          fetchBatches()
        }
      }
    }
  }

  // Handle delete item
  const handleDeleteItem = async () => {
    if (selectedItem && selectedItem._id) {
      if (activeTab === 0) {
        // Tồn kho
        const result = await deleteInventoryById(selectedItem._id)
        if (result) {
          handleCloseModal()
          fetchInventories(page + 1)
        }
      } else if (activeTab === 3) {
        // Kho hàng
        const result = await deleteWarehouse(selectedItem._id)
        if (result) {
          handleCloseModal()
          fetchWarehouses()
        }
      } else if (activeTab === 4) {
        // Biến thể
        const result = await deleteVariant(selectedItem._id)
        if (result) {
          handleCloseModal()
          fetchVariants()
        }
      } else if (activeTab === 5) {
        // Lô hàng
        const result = await deleteBatch(selectedItem._id)
        if (result) {
          handleCloseModal()
          fetchBatches()
        }
      }
    }
  }

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
    { id: 'createdAtFormatted', label: 'Ngày thực hiện', minWidth: 150 },
    { id: 'action', label: 'Hành động', minWidth: 100, align: 'center' }
  ]

  const warehouseColumns = [
    { id: 'code', label: 'Mã kho', minWidth: 100 },
    { id: 'name', label: 'Tên kho', minWidth: 120 },
    { id: 'address', label: 'Địa chỉ', minWidth: 150 },
    { id: 'ward', label: 'Phường', minWidth: 100 },
    { id: 'district', label: 'Quận', minWidth: 100 },
    { id: 'city', label: 'Thành phố', minWidth: 100 },
    { id: 'action', label: 'Hành động', minWidth: 100, align: 'center' }
  ]

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
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Box
              sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', mb: 2 }}
            >
              <Button
                variant='contained'
                color='primary'
                onClick={() => handleOpenModal('add')}
              >
                + Thêm mới
              </Button>
            </Box>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='inventory table'>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={inventoryColumns.length}>
                      Tồn kho theo kho
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={inventoryColumns.length}>
                      <Box display='flex' gap={2}>
                        <FormControl sx={{ minWidth: 120 }}>
                          <InputLabel>Kho</InputLabel>
                          <Select
                            value={filterWarehouse}
                            onChange={(e) => setFilterWarehouse(e.target.value)}
                            label='Kho'
                          >
                            <MenuItem value='all'>Tất cả kho</MenuItem>
                            {warehouses.map((warehouse) => (
                              <MenuItem
                                key={warehouse._id}
                                value={warehouse.name}
                              >
                                {warehouse.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 120 }}>
                          <InputLabel>Màu</InputLabel>
                          <Select
                            value={filterColor}
                            onChange={(e) => setFilterColor(e.target.value)}
                            label='Màu'
                          >
                            <MenuItem value='all'>Tất cả màu</MenuItem>
                            {colors.map((color) => (
                              <MenuItem key={color._id} value={color.name}>
                                {color.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 120 }}>
                          <InputLabel>Kích thước</InputLabel>
                          <Select
                            value={filterSize}
                            onChange={(e) => setFilterSize(e.target.value)}
                            label='Kích thước'
                          >
                            <MenuItem value='all'>Tất cả kích thước</MenuItem>
                            {sizes.map((size) => (
                              <MenuItem key={size._id} value={size.name}>
                                {size.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 120 }}>
                          <InputLabel>Trạng thái</InputLabel>
                          <Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            label='Trạng thái'
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
                  {enrichedInventories.map((row, index) => (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={row._id || index}
                    >
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
                              <Button
                                variant='outlined'
                                size='small'
                                onClick={() => handleOpenModal('edit', row)}
                                sx={{ mr: 1 }}
                              >
                                Sửa
                              </Button>
                              <Button
                                variant='outlined'
                                color='error'
                                size='small'
                                onClick={() => handleOpenModal('delete', row)}
                              >
                                Xóa
                              </Button>
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
              count={inventoryTotalPages * rowsPerPage}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}

        {/* Tab 2: Phiếu nhập/xuất (Not implemented yet) */}
        {activeTab === 1 && (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography>
              Chức năng phiếu nhập/xuất chưa được triển khai.
            </Typography>
          </Paper>
        )}

        {/* Tab 3: Lịch sử */}
        {activeTab === 2 && (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='inventory log table'>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={inventoryLogColumns.length}>
                      Lịch sử nhập/xuất
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
                        <FormControl sx={{ minWidth: 120 }}>
                          <InputLabel>Kho</InputLabel>
                          <Select
                            value={filterLogWarehouse}
                            onChange={(e) =>
                              setFilterLogWarehouse(e.target.value)
                            }
                            label='Kho'
                          >
                            <MenuItem value='all'>Tất cả kho</MenuItem>
                            {warehouses.map((warehouse) => (
                              <MenuItem
                                key={warehouse._id}
                                value={warehouse.name}
                              >
                                {warehouse.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 120 }}>
                          <InputLabel>Loại</InputLabel>
                          <Select
                            value={filterLogType}
                            onChange={(e) => setFilterLogType(e.target.value)}
                            label='Loại'
                          >
                            <MenuItem value='all'>Tất cả</MenuItem>
                            <MenuItem value='Nhập'>Nhập</MenuItem>
                            <MenuItem value='Xuất'>Xuất</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 150 }}>
                          <InputLabel>Ngày</InputLabel>
                          <Select
                            value={filterLogDate}
                            onChange={(e) => setFilterLogDate(e.target.value)}
                            label='Ngày'
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
                  {enrichedInventoryLogs.map((row, index) => (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={row._id || index}
                    >
                      {inventoryLogColumns.map((column) => {
                        const value = row[column.id]
                        if (column.id === 'action') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Button
                                variant='outlined'
                                size='small'
                                onClick={() => handleOpenModal('edit', row)}
                                sx={{ mr: 1 }}
                              >
                                Sửa
                              </Button>
                              <Button
                                variant='outlined'
                                color='error'
                                size='small'
                                onClick={() => handleOpenModal('delete', row)}
                              >
                                Xóa
                              </Button>
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
              count={enrichedInventoryLogs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}

        {/* Tab 4: Kho hàng */}
        {activeTab === 3 && (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Box
              sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', mb: 2 }}
            >
              <Button
                variant='contained'
                color='primary'
                onClick={() => handleOpenModal('add')}
              >
                + Thêm mới
              </Button>
            </Box>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='warehouses table'>
                <TableHead>
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
                  {warehouses.map((row, index) => (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={row._id || index}
                    >
                      {warehouseColumns.map((column) => {
                        const value = row[column.id]
                        if (column.id === 'action') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Button
                                variant='outlined'
                                size='small'
                                onClick={() => handleOpenModal('edit', row)}
                                sx={{ mr: 1 }}
                              >
                                Sửa
                              </Button>
                              <Button
                                variant='outlined'
                                color='error'
                                size='small'
                                onClick={() => handleOpenModal('delete', row)}
                              >
                                Xóa
                              </Button>
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
              count={warehouses.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}

        {/* Tab 5: Biến thể */}
        {activeTab === 4 && (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Box
              sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', mb: 2 }}
            >
              <Button
                variant='contained'
                color='primary'
                onClick={() => handleOpenModal('add')}
              >
                + Thêm mới
              </Button>
            </Box>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='variants table'>
                <TableHead>
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
                  {enrichedVariants.map((row, index) => (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={row._id || index}
                    >
                      {variantColumns.map((column) => {
                        let value = column.id.includes('.')
                          ? column.id.split('.').reduce((o, i) => o[i], row)
                          : row[column.id]
                        if (column.id === 'action') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Button
                                variant='outlined'
                                size='small'
                                onClick={() => handleOpenModal('edit', row)}
                                sx={{ mr: 1 }}
                              >
                                Sửa
                              </Button>
                              <Button
                                variant='outlined'
                                color='error'
                                size='small'
                                onClick={() => handleOpenModal('delete', row)}
                              >
                                Xóa
                              </Button>
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
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Box
              sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', mb: 2 }}
            >
              <Button
                variant='contained'
                color='primary'
                onClick={() => handleOpenModal('add')}
              >
                + Thêm mới
              </Button>
            </Box>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='batches table'>
                <TableHead>
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
                  {enrichedBatches.map((row, index) => (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={row._id || index}
                    >
                      {batchColumns.map((column) => {
                        const value = row[column.id]
                        if (column.id === 'action') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Button
                                variant='outlined'
                                size='small'
                                onClick={() => handleOpenModal('edit', row)}
                                sx={{ mr: 1 }}
                              >
                                Sửa
                              </Button>
                              <Button
                                variant='outlined'
                                color='error'
                                size='small'
                                onClick={() => handleOpenModal('delete', row)}
                              >
                                Xóa
                              </Button>
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

        {/* Modal for add/edit/delete */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>
            {modalType === 'add' && 'Thêm mới'}
            {modalType === 'edit' && 'Sửa'}
            {modalType === 'delete' && 'Xóa'}
          </DialogTitle>
          <DialogContent>
            {modalType !== 'delete' && (
              <Box sx={{ mt: 2 }}>
                {activeTab === 0 && ( // Tồn kho
                  <>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Biến thể</InputLabel>
                      <Select
                        value={newItemData.variantId}
                        onChange={(e) =>
                          setNewItemData({
                            ...newItemData,
                            variantId: e.target.value
                          })
                        }
                        label='Biến thể'
                      >
                        <MenuItem value=''>Chọn biến thể</MenuItem>
                        {variants.map((variant) => (
                          <MenuItem key={variant._id} value={variant._id}>
                            {variant.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Kho</InputLabel>
                      <Select
                        value={newItemData.warehouseId}
                        onChange={(e) =>
                          setNewItemData({
                            ...newItemData,
                            warehouseId: e.target.value
                          })
                        }
                        label='Kho'
                      >
                        <MenuItem value=''>Chọn kho</MenuItem>
                        {warehouses.map((warehouse) => (
                          <MenuItem key={warehouse._id} value={warehouse._id}>
                            {warehouse.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label='Số lượng'
                      value={newItemData.quantity}
                      onChange={(e) =>
                        setNewItemData({
                          ...newItemData,
                          quantity: e.target.value
                        })
                      }
                      sx={{ mb: 2 }}
                      type='number'
                    />
                    <TextField
                      fullWidth
                      label='Ngưỡng cảnh báo'
                      value={newItemData.minQuantity}
                      onChange={(e) =>
                        setNewItemData({
                          ...newItemData,
                          minQuantity: e.target.value
                        })
                      }
                      sx={{ mb: 2 }}
                      type='number'
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Trạng thái</InputLabel>
                      <Select
                        value={newItemData.status}
                        onChange={(e) =>
                          setNewItemData({
                            ...newItemData,
                            status: e.target.value
                          })
                        }
                        label='Trạng thái'
                      >
                        <MenuItem value='in-stock'>Còn hàng</MenuItem>
                        <MenuItem value='low-stock'>Cảnh báo</MenuItem>
                        <MenuItem value='out-of-stock'>Hết hàng</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label='Giá nhập'
                      value={newItemData.importPrice}
                      onChange={(e) =>
                        setNewItemData({
                          ...newItemData,
                          importPrice: e.target.value
                        })
                      }
                      sx={{ mb: 2 }}
                      type='number'
                    />
                    <TextField
                      fullWidth
                      label='Giá bán'
                      value={newItemData.exportPrice}
                      onChange={(e) =>
                        setNewItemData({
                          ...newItemData,
                          exportPrice: e.target.value
                        })
                      }
                      type='number'
                    />
                  </>
                )}
                {activeTab === 3 && ( // Kho hàng
                  <>
                    <TextField
                      fullWidth
                      label='Mã kho'
                      value={newItemData.code}
                      onChange={(e) =>
                        setNewItemData({ ...newItemData, code: e.target.value })
                      }
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label='Tên kho'
                      value={newItemData.name}
                      onChange={(e) =>
                        setNewItemData({ ...newItemData, name: e.target.value })
                      }
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label='Địa chỉ'
                      value={newItemData.address}
                      onChange={(e) =>
                        setNewItemData({
                          ...newItemData,
                          address: e.target.value
                        })
                      }
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label='Phường'
                      value={newItemData.ward}
                      onChange={(e) =>
                        setNewItemData({ ...newItemData, ward: e.target.value })
                      }
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label='Quận'
                      value={newItemData.district}
                      onChange={(e) =>
                        setNewItemData({
                          ...newItemData,
                          district: e.target.value
                        })
                      }
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label='Thành phố'
                      value={newItemData.city}
                      onChange={(e) =>
                        setNewItemData({ ...newItemData, city: e.target.value })
                      }
                      sx={{ mb: 2 }}
                    />
                  </>
                )}
                {activeTab === 4 && ( // Biến thể
                  <>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Sản phẩm</InputLabel>
                      <Select
                        value={newItemData.productId}
                        onChange={(e) =>
                          setNewItemData({
                            ...newItemData,
                            productId: e.target.value
                          })
                        }
                        label='Sản phẩm'
                      >
                        <MenuItem value=''>Chọn sản phẩm</MenuItem>
                        {products.map((product) => (
                          <MenuItem key={product._id} value={product._id}>
                            {product.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Màu sắc</InputLabel>
                      <Select
                        value={newItemData.colorId}
                        onChange={(e) =>
                          setNewItemData({
                            ...newItemData,
                            colorId: e.target.value
                          })
                        }
                        label='Màu sắc'
                      >
                        <MenuItem value=''>Chọn màu</MenuItem>
                        {colors.map((color) => (
                          <MenuItem key={color._id} value={color._id}>
                            {color.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Kích thước</InputLabel>
                      <Select
                        value={newItemData.sizeId}
                        onChange={(e) =>
                          setNewItemData({
                            ...newItemData,
                            sizeId: e.target.value
                          })
                        }
                        label='Kích thước'
                      >
                        <MenuItem value=''>Chọn kích thước</MenuItem>
                        {sizes.map((size) => (
                          <MenuItem key={size._id} value={size._id}>
                            {size.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label='Giá nhập'
                      value={newItemData.importPrice}
                      onChange={(e) =>
                        setNewItemData({
                          ...newItemData,
                          importPrice: e.target.value
                        })
                      }
                      sx={{ mb: 2 }}
                      type='number'
                    />
                    <TextField
                      fullWidth
                      label='Giá bán'
                      value={newItemData.exportPrice}
                      onChange={(e) =>
                        setNewItemData({
                          ...newItemData,
                          exportPrice: e.target.value
                        })
                      }
                      type='number'
                    />
                  </>
                )}
                {activeTab === 5 && ( // Lô hàng
                  <>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Biến thể</InputLabel>
                      <Select
                        value={newItemData.variantId}
                        onChange={(e) =>
                          setNewItemData({
                            ...newItemData,
                            variantId: e.target.value
                          })
                        }
                        label='Biến thể'
                      >
                        <MenuItem value=''>Chọn biến thể</MenuItem>
                        {variants.map((variant) => (
                          <MenuItem key={variant._id} value={variant._id}>
                            {variant.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label='Mã phiếu'
                      value={newItemData.slipCode}
                      onChange={(e) =>
                        setNewItemData({
                          ...newItemData,
                          slipCode: e.target.value
                        })
                      }
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label='Số lượng'
                      value={newItemData.quantity}
                      onChange={(e) =>
                        setNewItemData({
                          ...newItemData,
                          quantity: e.target.value
                        })
                      }
                      sx={{ mb: 2 }}
                      type='number'
                    />
                    <TextField
                      fullWidth
                      label='Giá nhập'
                      value={newItemData.importPrice}
                      onChange={(e) =>
                        setNewItemData({
                          ...newItemData,
                          importPrice: e.target.value
                        })
                      }
                      sx={{ mb: 2 }}
                      type='number'
                    />
                    <TextField
                      fullWidth
                      label='Giá bán'
                      value={newItemData.exportPrice}
                      onChange={(e) =>
                        setNewItemData({
                          ...newItemData,
                          exportPrice: e.target.value
                        })
                      }
                      type='number'
                    />
                  </>
                )}
              </Box>
            )}
            {modalType === 'delete' && (
              <Typography>
                Bạn có chắc chắn muốn xóa{' '}
                {selectedItem?.name ||
                  selectedItem?.variantName ||
                  selectedItem?.code ||
                  'mục này'}
                ?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Hủy</Button>
            {modalType === 'add' && (
              <Button onClick={handleAddItem} variant='contained'>
                Thêm
              </Button>
            )}
            {modalType === 'edit' && (
              <Button onClick={handleUpdateItem} variant='contained'>
                Lưu
              </Button>
            )}
            {modalType === 'delete' && (
              <Button
                onClick={handleDeleteItem}
                variant='contained'
                color='error'
              >
                Xóa
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

const tabLabels = [
  'Tồn kho',
  'Phiếu nhập/xuất',
  'Lịch sử',
  'Kho hàng',
  'Biến thể',
  'Lô hàng'
]
export default InventoryTable
