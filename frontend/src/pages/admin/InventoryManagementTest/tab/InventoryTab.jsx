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
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ViewInventoryModal from '../modal/Inventory/ViewInventoryModal.jsx'
import EditInventoryModal from '../modal/Inventory/EditInventoryModal.jsx'
import DeleteInventoryModal from '../modal/Inventory/DeleteInventoryModal.jsx'
import AddWarehouseSlipModal from '~/pages/admin/InventoryManagementTest/modal/WarehouseSlip/AddWarehouseSlipModal.jsx'

const InventoryTab = ({
  data,
  variants,
  warehouses,
  colors,
  sizes,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  updateInventory,
  deleteInventory,
  refreshInventories,
  partners,
  addWarehouseSlip,
  fetchWarehouses,
  fetchPartner,
  batches
}) => {
  const [filterWarehouse, setFilterWarehouse] = useState('all')
  const [filterColor, setFilterColor] = useState('all')
  const [filterSize, setFilterSize] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedInventory, setSelectedInventory] = useState(null)

  const [openModal, setOpenModal] = useState(false)
  const [modalType, setModalType] = useState('input')
  const [newSlipData, setNewSlipData] = useState({
    slipId: '',
    date: new Date(),
    profitType: 'Import',
    warehouseId: '',
    partnerCode: '',
    partnerName: '',
    note: ''
  })
  const [items, setItems] = useState([
    { variantId: '', lot: '', quantity: '', unit: '', note: '' }
  ])
  useEffect(() => {
    refreshInventories()
  }, [])

  const enrichedInventories = data.map((item) => {
    const variant = variants.find((v) => v.id === item.variantId)
    const warehouse = warehouses.find((w) => w.id === item.warehouseId)
    return {
      ...item,
      warehouse: item.warehouseId?.name || 'N/A',
      variantName: item.variantId?.name || 'N/A',
      color: variant?.color?.name || 'N/A',
      size: variant?.size?.name || 'N/A'
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
    { id: '_id', label: 'ID', minWidth: 200 },
    { id: 'variantName', label: 'Sản phẩm', minWidth: 150 },
    { id: 'warehouse', label: 'Kho hàng', minWidth: 120 },
    { id: 'quantity', label: 'Số lượng', minWidth: 100, align: 'right' },
    {
      id: 'minQuantity',
      label: 'Tối thiểu',
      minWidth: 100,
      align: 'right'
    },
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
      format: (value) => new Date(value).toLocaleString('vi-VN')
    },
    {
      id: 'updatedAt',
      label: 'Ngày cập nhật',
      minWidth: 150,
      align: 'center',
      format: (value) => new Date(value).toLocaleString('vi-VN')
    },
    {
      id: 'action',
      label: 'Hành động',
      minWidth: 150,
      align: 'center'
    }
  ]

  const handleViewInventory = (inventory) => {
    setSelectedInventory(inventory)
    setOpenViewModal(true)
  }

  const handleEditInventory = (inventory) => {
    setSelectedInventory(inventory)
    setOpenEditModal(true)
  }

  const handleDeleteInventory = (inventory) => {
    setSelectedInventory(inventory)
    setOpenDeleteModal(true)
  }

  const handleCloseEditModal = () => {
    setOpenEditModal(false)
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
  }

  const handleOpenModal = (type) => {
    fetchPartner()
    fetchWarehouses()
    setModalType(type)
    setNewSlipData({
      ...newSlipData,
      slipId: '',
      profitType: type === 'input' ? 'Import' : 'Export'
    })
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setModalType('input')
    setNewSlipData({
      slipId: '',
      date: new Date(),
      profitType: 'Import',
      warehouseId: '',
      partnerCode: '',
      partnerName: '',
      note: ''
    })
    setItems([{ variantId: '', lot: '', quantity: '', unit: '', note: '' }])
  }

  const handleAddSlip = async (newSlip) => {
    // setData([...data, newSlip])
    await addWarehouseSlip(newSlip)
    handleCloseModal()
  }

  const handleChange = (field) => (event) => {
    setNewSlipData({ ...newSlipData, [field]: event.target.value })
  }

  const handleDateChange = (date) => {
    setNewSlipData({ ...newSlipData, date })
  }

  const handleItemChange = (index, field) => (event) => {
    const newItems = [...items]
    newItems[index][field] = event.target.value
    setItems(newItems)
  }

  const handleAddRow = () => {
    setItems([
      ...items,
      { variantId: '', lot: '', quantity: '', unit: '', note: '' }
    ])
  }

  const handleDeleteRow = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleAdd = () => {
    const newSlip = {
      type: modalType === 'input' ? 'import' : 'export',
      date: newSlipData.date ? new Date(newSlipData.date).toISOString() : null,
      partnerId: newSlipData.partnerId || '',
      warehouseId: newSlipData.warehouseId || '',
      items: items.map((item) => ({
        variantId: item.variantId || '',
        quantity: parseInt(item.quantity) || 0,
        unit: item.unit || 'cái'
      })),
      note: newSlipData.note || ''
    }
    handleAddSlip(newSlip)
  }

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
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant='h6' sx={{ fontWeight: '800' }}>
                    Tồn kho theo kho
                  </Typography>
                  <Box>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => handleOpenModal('input')}
                      sx={{ mr: 1 }}
                    >
                      Nhập kho
                    </Button>
                    <Button
                      variant='contained'
                      color='secondary'
                      onClick={() => handleOpenModal('output')}
                    >
                      Xuất kho
                    </Button>
                  </Box>
                </Box>
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
      <ViewInventoryModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        inventory={selectedInventory}
        variants={variants}
        warehouses={warehouses}
      />
      <EditInventoryModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        inventory={selectedInventory}
        onSave={updateInventory}
        variants={variants}
        warehouses={warehouses}
      />
      <DeleteInventoryModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        inventory={selectedInventory}
        onSave={deleteInventory}
      />
      <AddWarehouseSlipModal
        open={openModal}
        onClose={handleCloseModal}
        newSlipData={newSlipData}
        handleChange={handleChange}
        handleDateChange={handleDateChange}
        handleAdd={handleAdd}
        warehouses={warehouses}
        items={items}
        handleItemChange={handleItemChange}
        handleDeleteRow={handleDeleteRow}
        handleAddRow={handleAddRow}
        variants={variants}
        warehouseSlips={data}
        batches={batches}
        type={modalType}
        partners={partners}
        addWarehouseSlip={addWarehouseSlip}
      />
    </Paper>
  )
}

export default InventoryTab
