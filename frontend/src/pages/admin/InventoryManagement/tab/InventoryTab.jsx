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
//               .map((row, index.jsx) => (
//                 <TableRow hover role='checkbox' tabIndex={-1} key={index.jsx}>
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
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ViewInventoryModal from '../modal/Inventory/ViewInventoryModal.jsx'
import EditInventoryModal from '../modal/Inventory/EditInventoryModal.jsx'
import DeleteInventoryModal from '../modal/Inventory/DeleteInventoryModal.jsx'
import FilterInventory from '~/components/FilterAdmin/FilterInventory.jsx'
import useVariants from '~/hooks/admin/Inventory/useVariants.js'
import useInventory from '~/hooks/admin/Inventory/useInventorys.js'
import useWarehouses from '~/hooks/admin/Inventory/useWarehouses.js'
const InventoryTab = () => {
  const { variants, fetchVariants } = useVariants()
  const {
    inventories,
    fetchInventories,
    loadingInventories,
    totalPageInventory,
    getInventoryId,
    deleteInventoryById,
    updateInventoryById
  } = useInventory()
  const { warehouses, fetchWarehouses } = useWarehouses()
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filter, setFilter] = useState({})
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedInventory, setSelectedInventory] = useState(null)

  useEffect(() => {
    fetchWarehouses()
    fetchVariants()
  }, [])

  useEffect(() => {
    fetchInventories(page, rowsPerPage, filter)
  }, [page, rowsPerPage])

  const enrichedInventories = inventories.map((item) => {
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
      align: 'start',
      format: (value) => `${value.toLocaleString('vi-VN')}đ` // dùng 'vi-VN' cho đúng format Việt Nam
    },
    {
      id: 'exportPrice',
      label: 'Giá bán',
      minWidth: 100,
      align: 'start',
      format: (value) => `${value.toLocaleString('vi-VN')}đ`
    },
    {
      id: 'status',
      label: 'Trạng thái',
      minWidth: 100,
      align: 'start'
    },
    {
      id: 'createdAt',
      label: 'Ngày tạo',
      minWidth: 150,
      align: 'start',
      format: (value) =>
        new Date(value).toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
    },
    {
      id: 'updatedAt',
      label: 'Ngày cập nhật',
      minWidth: 150,
      align: 'start',
      format: (value) =>
        new Date(value).toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
    },
    {
      id: 'action',
      label: 'Hành động',
      minWidth: 150,
      align: 'start'
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
    fetchInventories(page, rowsPerPage)
  }

  const handleCloseDeleteModal = () => {
    setSelectedInventory(null)
    setOpenDeleteModal(false)
    fetchInventories(page, rowsPerPage)
  }

  const handleFilter = (newFilters) => {
    setFilter(newFilters)
    if (Object.keys(newFilters).length > 0) {
      fetchInventories(1, rowsPerPage, newFilters)
    }
  }
  const formatCurrency = (value) => {
    if (!value) return ''
    return Number(value).toLocaleString('vi-VN') // Thêm dấu chấm theo chuẩn VNĐ
  }

  const parseCurrency = (value) => {
    return value.replaceAll('.', '').replace(/[^\d]/g, '') // Loại bỏ dấu . và ký tự khác ngoài số
  }
  const handleChangePage = (event, value) => setPage(value)

  const onChangeRowsPerPage = (newLimit) => {
    setPage(1)
    setRowsPerPage(newLimit)
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
                      Danh Sách Tồn Kho
                    </Typography>
                  </Box>
                  <FilterInventory
                    loading={loadingInventories}
                    onFilter={handleFilter}
                    warehouses={inventories}
                    fetchInventories={fetchInventories}
                    variants={variants}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {inventoryColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    ...(column.id === 'action' && {
                      width: '130px',
                      maxWidth: '130px',
                      paddingLeft: '20px'
                    })
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {enrichedInventories.map((row, index) => (
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
                          size='large'
                          sx={{ width: '120px', fontWeight: '800' }}
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
                          <RemoveRedEyeIcon color='primary' />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditInventory(row)}
                          size='small'
                          color='info'
                        >
                          <BorderColorIcon color='warning' />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteInventory(row)}
                          size='small'
                          color='error'
                        >
                          <DeleteForeverIcon color='error' />
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
        count={totalPageInventory || 0}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={(event, newPage) => handleChangePage(event, newPage + 1)} // +1 để đúng logic bên cha
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

      <ViewInventoryModal
        open={openViewModal}
        onClose={() => {
          setSelectedInventory(null)
          setOpenViewModal(false)
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
        onSave={updateInventoryById}
        variants={variants}
        warehouses={warehouses}
        formatCurrency={formatCurrency}
        parseCurrency={parseCurrency}
      />
      <DeleteInventoryModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        inventory={selectedInventory}
        onSave={deleteInventoryById}
      />
    </Paper>
  )
}

export default InventoryTab
