// // InventoryTab.js
// import React, { useState, useEffect } from 'react'
// import {
//   Paper,
//   Table,
//   TableContainer,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TablePagination,
//   Chip,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Typography,
//   Box,
//   IconButton
// } from '@mui/material'
// import VisibilityIcon from '@mui/icons-material/Visibility'
// import EditIcon from '@mui/icons-material/Edit'
// import DeleteIcon from '@mui/icons-material/Delete'
// import ViewInventoryModal from '../modal/Inventory/ViewInventoryModal.jsx'
// import EditInventoryModal from '../modal/Inventory/EditInventoryModal.jsx'
// import DeleteInventoryModal from '../modal/Inventory/DeleteInventoryModal.jsx'
//
// const InventoryTab = ({
//   data,
//   variants,
//   warehouses,
//   colors,
//   sizes,
//   page,
//   rowsPerPage,
//   onPageChange,
//   onRowsPerPageChange,
//   updateInventory,
//   deleteInventory,
//   refreshInventories
// }) => {
//   const [filterWarehouse, setFilterWarehouse] = useState('all')
//   const [filterColor, setFilterColor] = useState('all')
//   const [filterSize, setFilterSize] = useState('all')
//   const [filterStatus, setFilterStatus] = useState('all')
//   const [openViewModal, setOpenViewModal] = useState(false)
//   const [openEditModal, setOpenEditModal] = useState(false)
//   const [openDeleteModal, setOpenDeleteModal] = useState(false)
//   const [selectedInventory, setSelectedInventory] = useState(null)
//
//   useEffect(() => {
//     refreshInventories()
//   }, [])
//
//   const enrichedInventories = data.map((item) => {
//     const variant = variants.find((v) => v.id === item.variantId)
//     const warehouse = warehouses.find((w) => w.id === item.warehouseId)
//     return {
//       ...item,
//       warehouse: item.warehouseId?.name || 'N/A',
//       variantName: item.variantId?.name || 'N/A',
//       color: variant?.color?.name || 'N/A',
//       size: variant?.size?.name || 'N/A'
//     }
//   })
//   const filteredInventories = enrichedInventories.filter((item) => {
//     return (
//       (filterWarehouse === 'all' || item.warehouse === filterWarehouse) &&
//       (filterColor === 'all' || item.color === filterColor) &&
//       (filterSize === 'all' || item.size === filterSize) &&
//       (filterStatus === 'all' || item.status === filterStatus)
//     )
//   })
//
//   const inventoryColumns = [
//     { id: '_id', label: 'ID', minWidth: 200 },
//     { id: 'variantName', label: 'Sản phẩm', minWidth: 150 },
//     { id: 'warehouse', label: 'Kho hàng', minWidth: 120 },
//     { id: 'quantity', label: 'Số lượng', minWidth: 100, align: 'right' },
//     {
//       id: 'minQuantity',
//       label: 'Tối thiểu',
//       minWidth: 100,
//       align: 'right'
//     },
//     {
//       id: 'importPrice',
//       label: 'Giá nhập',
//       minWidth: 100,
//       align: 'right',
//       format: (value) => `${value.toLocaleString()}đ`
//     },
//     {
//       id: 'exportPrice',
//       label: 'Giá bán',
//       minWidth: 100,
//       align: 'right',
//       format: (value) => `${value.toLocaleString()}đ`
//     },
//     {
//       id: 'status',
//       label: 'Trạng thái',
//       minWidth: 100,
//       align: 'center'
//     },
//     {
//       id: 'createdAt',
//       label: 'Ngày tạo',
//       minWidth: 150,
//       align: 'center',
//       format: (value) => new Date(value).toLocaleString('vi-VN')
//     },
//     {
//       id: 'updatedAt',
//       label: 'Ngày cập nhật',
//       minWidth: 150,
//       align: 'center',
//       format: (value) => new Date(value).toLocaleString('vi-VN')
//     },
//     {
//       id: 'action',
//       label: 'Hành động',
//       minWidth: 150,
//       align: 'center'
//     }
//   ]
//
//   const handleViewInventory = (inventory) => {
//     setSelectedInventory(inventory)
//     setOpenViewModal(true)
//   }
//
//   const handleEditInventory = (inventory) => {
//     setSelectedInventory(inventory)
//     setOpenEditModal(true)
//   }
//
//   const handleDeleteInventory = (inventory) => {
//     setSelectedInventory(inventory)
//     setOpenDeleteModal(true)
//   }
//
//   const handleCloseEditModal = () => {
//     setOpenEditModal(false)
//   }
//
//   const handleCloseDeleteModal = () => {
//     setOpenDeleteModal(false)
//   }
//
//   return (
//     <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
//       <TableContainer sx={{ maxHeight: 440 }}>
//         <Table stickyHeader aria-label='inventory table'>
//           <TableHead>
//             <TableRow>
//               <TableCell
//                 colSpan={inventoryColumns.length}
//                 sx={{ borderBottom: 'none', paddingBottom: '0' }}
//               >
//                 <Typography variant='h6' sx={{ fontWeight: '800' }}>
//                   Tồn kho theo kho
//                 </Typography>
//               </TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell colSpan={inventoryColumns.length}>
//                 <Box display='flex' gap={2}>
//                   <FormControl
//                     sx={{
//                       minWidth: 200,
//                       height: '40px',
//                       '& .MuiInputBase-root': {
//                         height: '40px',
//                         padding: '0 14px 0 0'
//                       }
//                     }}
//                   >
//                     <Select
//                       value={filterWarehouse}
//                       onChange={(e) => setFilterWarehouse(e.target.value)}
//                     >
//                       <MenuItem value='all'>Tất cả kho</MenuItem>
//                       {warehouses.map((warehouse) => (
//                         <MenuItem key={warehouse.id} value={warehouse.name}>
//                           {warehouse.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                   <FormControl
//                     sx={{
//                       minWidth: 200,
//                       height: '40px',
//                       '& .MuiInputBase-root': {
//                         height: '40px',
//                         padding: '0 14px 0 0'
//                       }
//                     }}
//                   >
//                     <Select
//                       value={filterColor}
//                       onChange={(e) => setFilterColor(e.target.value)}
//                     >
//                       <MenuItem value='all'>Tất cả màu</MenuItem>
//                       {colors.map((color) => (
//                         <MenuItem key={color.id} value={color.name}>
//                           {color.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                   <FormControl
//                     sx={{
//                       minWidth: 200,
//                       height: '40px',
//                       '& .MuiInputBase-root': {
//                         height: '40px',
//                         padding: '0 14px 0 0'
//                       }
//                     }}
//                   >
//                     <Select
//                       value={filterSize}
//                       onChange={(e) => setFilterSize(e.target.value)}
//                     >
//                       <MenuItem value='all'>Tất cả kích thước</MenuItem>
//                       {sizes.map((size) => (
//                         <MenuItem key={size.id} value={size.name}>
//                           {size.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                   <FormControl
//                     sx={{
//                       minWidth: 200,
//                       height: '40px',
//                       '& .MuiInputBase-root': {
//                         height: '40px',
//                         padding: '0 14px 0 0'
//                       }
//                     }}
//                   >
//                     <Select
//                       value={filterStatus}
//                       onChange={(e) => setFilterStatus(e.target.value)}
//                     >
//                       <MenuItem value='all'>Tất cả trạng thái</MenuItem>
//                       <MenuItem value='in-stock'>Còn hàng</MenuItem>
//                       <MenuItem value='low-stock'>Cảnh báo</MenuItem>
//                       <MenuItem value='out-of-stock'>Hết hàng</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Box>
//               </TableCell>
//             </TableRow>
//             <TableRow>
//               {inventoryColumns.map((column) => (
//                 <TableCell
//                   key={column.id}
//                   align={column.align}
//                   style={{ minWidth: column.minWidth }}
//                 >
//                   {column.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredInventories
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((row, index) => (
//                 <TableRow hover role='checkbox' tabIndex={-1} key={index}>
//                   {inventoryColumns.map((column) => {
//                     let value = row[column.id]
//                     if (column.id === 'status') {
//                       return (
//                         <TableCell key={column.id} align={column.align}>
//                           <Chip
//                             label={
//                               value === 'in-stock'
//                                 ? 'Còn hàng'
//                                 : value === 'low-stock'
//                                   ? 'Cảnh báo'
//                                   : 'Hết hàng'
//                             }
//                             color={
//                               value === 'in-stock'
//                                 ? 'success'
//                                 : value === 'low-stock'
//                                   ? 'warning'
//                                   : 'error'
//                             }
//                             size='small'
//                           />
//                         </TableCell>
//                       )
//                     }
//                     if (column.id === 'action') {
//                       return (
//                         <TableCell key={column.id} align={column.align}>
//                           <IconButton
//                             onClick={() => handleViewInventory(row)}
//                             size='small'
//                             color='primary'
//                           >
//                             <VisibilityIcon />
//                           </IconButton>
//                           <IconButton
//                             onClick={() => handleEditInventory(row)}
//                             size='small'
//                             color='info'
//                           >
//                             <EditIcon />
//                           </IconButton>
//                           <IconButton
//                             onClick={() => handleDeleteInventory(row)}
//                             size='small'
//                             color='error'
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </TableCell>
//                       )
//                     }
//                     return (
//                       <TableCell key={column.id} align={column.align}>
//                         {column.format && typeof value === 'number'
//                           ? column.format(value)
//                           : value}
//                       </TableCell>
//                     )
//                   })}
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component='div'
//         count={filteredInventories.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={onPageChange}
//         onRowsPerPageChange={onRowsPerPageChange}
//       />
//       <ViewInventoryModal
//         open={openViewModal}
//         onClose={() => setOpenViewModal(false)}
//         inventory={selectedInventory}
//         variants={variants}
//         warehouses={warehouses}
//       />
//       <EditInventoryModal
//         open={openEditModal}
//         onClose={handleCloseEditModal}
//         inventory={selectedInventory}
//         onSave={updateInventory}
//         variants={variants}
//         warehouses={warehouses}
//       />
//       <DeleteInventoryModal
//         open={openDeleteModal}
//         onClose={handleCloseDeleteModal}
//         inventory={selectedInventory}
//         onSave={deleteInventory}
//       />
//     </Paper>
//   )
// }
//
// export default InventoryTab
// InventoryTab.js
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
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  IconButton,
  Button
} from '@mui/material'
import { filterDate } from '~/utils/constants.js'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ViewInventoryModal from '../modal/Inventory/ViewInventoryModal.jsx'
import EditInventoryModal from '../modal/Inventory/EditInventoryModal.jsx'
import DeleteInventoryModal from '../modal/Inventory/DeleteInventoryModal.jsx'
import FilterByTime from '~/components/filterDateType/FilterByTime.jsx'
import dayjs from 'dayjs'
const InventoryTab = ({
  data,
  variants,
  warehouses,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  updateInventory,
  deleteInventory,
  refreshInventories,
  getInventoryId,
  refreshVariants,
  fetchWarehouses,
  formatCurrency,
  parseCurrency
}) => {
  const [filterWarehouse, setFilterWarehouse] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterVariantId, setFilterVariantId] = useState('all')
  const [filterTypeDate, setFilterTypeDate] = useState('all')

  const [openViewModal, setOpenViewModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedInventory, setSelectedInventory] = useState(null)

  // const [selectedFilter, setSelectedFilter] = useState('all')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))

  useEffect(() => {
    refreshInventories(page > 0 ? page : 1, rowsPerPage)
    refreshVariants()
    fetchWarehouses()
  }, [])

  const enrichedInventories = data.map((item) => {
    return {
      ...item,
      variantId: item.variantId._id || 'N/A', // ← Ghi đè variantId thành chuỗi _id
      warehouseId: item.warehouseId._id || 'N/A', // ← Ghi đè warehouseId thành chuỗi _id
      warehouse: item.warehouseId?.name || 'N/A',
      variantName: item.variantId?.name || 'N/A',
      color: item.variantId.color?.name || 'N/A',
      size: item.variantId.size?.name || 'N/A',
      sku: item.variantId?.sku || 'N/A' // bạn có thể thêm sku nếu cần
    }
  })

  const filteredInventories = enrichedInventories.filter((item) => {
    return (
      (filterWarehouse === 'all' || item.warehouseId === filterWarehouse) &&
      (filterStatus === 'all' || item.status === filterStatus) &&
      (filterVariantId === 'all' || item.variantId === filterVariantId)
    )
  })

  const handleFilterChange = (type, value) => {
    if (type === 'variantId') setFilterVariantId(value)
    if (type === 'warehouseId') setFilterWarehouse(value)
    if (type === 'status') setFilterStatus(value)
    if (type === 'filterTypeDate') setFilterTypeDate(value)

    const nextVariantId = type === 'variantId' ? value : filterVariantId
    const nextWarehouseId = type === 'warehouseId' ? value : filterWarehouse
    const nextStatus = type === 'status' ? value : filterStatus
    const nextFilterTypeDate =
      type === 'filterTypeDate' ? value : filterTypeDate

    const filters = {}
    if (nextVariantId !== 'all') filters.variantId = nextVariantId
    if (nextWarehouseId !== 'all') filters.warehouseId = nextWarehouseId
    if (nextStatus !== 'all') filters.status = nextStatus
    if (nextFilterTypeDate !== 'all')
      filters.filterTypeDate = nextFilterTypeDate

    if (nextFilterTypeDate === 'custom' && startDate && endDate) {
      filters.startDate = startDate
      filters.endDate = endDate
    }

    refreshInventories(page > 0 ? page : 1, 10, filters)
  }

  const inventoryColumns = [
    { id: 'sku', label: 'Mã biến thể', minWidth: 200 },
    { id: 'warehouse', label: 'Kho hàng', minWidth: 120 },
    { id: 'variantName', label: 'Sản phẩm', minWidth: 150 },
    { id: 'quantity', label: 'Số lượng', minWidth: 100, align: 'right' },
    {
      id: 'minQuantity',
      label: 'Tối thiểu', // ngưỡng cảnh báo số lượng sản phẩm (SL) cảnh báo
      minWidth: 100,
      align: 'right',
      format: (value) => `${value.toLocaleString('vi-VN')}`
    },
    {
      id: 'importPrice',
      label: 'Giá nhập',
      minWidth: 100,
      align: 'right',
      format: (value) => `${value.toLocaleString('vi-VN')}đ` // dùng 'vi-VN' cho đúng format Việt Nam
    },
    {
      id: 'exportPrice',
      label: 'Giá bán',
      minWidth: 100,
      align: 'right',
      format: (value) => `${value.toLocaleString('vi-VN')}đ`
    },
    {
      id: 'status',
      label: 'Trạng thái',
      minWidth: 100,
      align: 'center'
    },
    {
      id: 'createdAt',
      label: 'Ngày tạo',
      minWidth: 150,
      align: 'center',
      format: (value) =>
        new Date(value).toLocaleString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour12: false
        })
    },
    {
      id: 'updatedAt',
      label: 'Ngày cập nhật',
      minWidth: 150,
      align: 'center',
      format: (value) =>
        new Date(value).toLocaleString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour12: false
        })
    },
    {
      id: 'action',
      label: 'Hành động',
      minWidth: 150,
      align: 'center'
    }
  ]

  const handleViewInventory = async (inventory) => {
    const inventoryDetails = await getInventoryId(inventory._id)
    setSelectedInventory(inventoryDetails)
    setOpenViewModal(true)
  }

  const handleEditInventory = async (inventory) => {
    const inventoryDetails = await getInventoryId(inventory._id)
    setSelectedInventory(inventoryDetails)
    setOpenEditModal(true)
  }

  const handleDeleteInventory = async (inventory) => {
    const inventoryDetails = await getInventoryId(inventory._id)
    setSelectedInventory(inventoryDetails)
    setOpenDeleteModal(true)
  }

  const handleCloseEditModal = () => {
    setSelectedInventory(null)
    setOpenEditModal(false)
    refreshInventories()
  }

  const handleCloseDeleteModal = () => {
    setSelectedInventory(null)
    setOpenDeleteModal(false)
    refreshInventories()
  }

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
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
                      onChange={(e) =>
                        handleFilterChange('warehouseId', e.target.value)
                      }
                    >
                      <MenuItem value='all'>Tất cả kho</MenuItem>
                      {warehouses.map((warehouse) => (
                        <MenuItem key={warehouse._id} value={warehouse._id}>
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
                      value={filterVariantId}
                      onChange={(e) =>
                        handleFilterChange('variantId', e.target.value)
                      }
                    >
                      <MenuItem value='all'>Tất cả biến thể</MenuItem>
                      {variants.map((variant) => (
                        <MenuItem key={variant._id} value={variant._id}>
                          {variant.sku} - {variant.name}
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
                      onChange={(e) =>
                        handleFilterChange('status', e.target.value)
                      }
                    >
                      <MenuItem value='all'>Tất cả trạng thái</MenuItem>
                      <MenuItem value='in-stock'>Còn hàng</MenuItem>
                      <MenuItem value='low-stock'>Cảnh báo</MenuItem>
                      <MenuItem value='out-of-stock'>Hết hàng</MenuItem>
                    </Select>
                  </FormControl>
                  <FilterByTime
                    onApply={(value) =>
                      handleFilterChange('filterTypeDate', value)
                    }
                    filterDate={filterDate}
                    selectedFilter={filterTypeDate}
                    setSelectedFilter={setFilterTypeDate}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                  />
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
            {filteredInventories.map((row, index) => (
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
                        <IconButton
                          onClick={() => handleViewInventory(row)}
                          size='small'
                          color='primary'
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditInventory(row)}
                          size='small'
                          color='info'
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteInventory(row)}
                          size='small'
                          color='error'
                        >
                          <DeleteIcon />
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
        count={filteredInventories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={(e) => onRowsPerPageChange(e, 'inventory')}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) => {
          const actualTo = to > count ? count : to // nếu to vượt quá count thì lấy count
          const actualFrom = from > count ? count : from // nếu from vượt quá count thì lấy count
          return `${actualFrom}–${actualTo} trên ${count !== -1 ? count : `hơn ${actualTo}`}`
        }}
      />

      <ViewInventoryModal
        open={openViewModal}
        onClose={() => {
          setSelectedInventory(null)
          setOpenViewModal(false)
          refreshInventories()
        }}
        inventory={selectedInventory}
        variants={variants}
        warehouses={warehouses}
        formatCurrency={formatCurrency}
        parseCurrency={parseCurrency}
      />
      <EditInventoryModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        inventory={selectedInventory}
        onSave={updateInventory}
        variants={variants}
        warehouses={warehouses}
        formatCurrency={formatCurrency}
        parseCurrency={parseCurrency}
      />
      <DeleteInventoryModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        inventory={selectedInventory}
        onSave={deleteInventory}
      />
    </Paper>
  )
}

export default InventoryTab
