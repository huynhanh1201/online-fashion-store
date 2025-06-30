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
// import ViewInventoryModal from '../Chart/Inventory/ViewInventoryModal.jsx'
// import EditInventoryModal from '../Chart/Inventory/EditInventoryModal.jsx'
// import DeleteInventoryModal from '../Chart/Inventory/DeleteInventoryModal.jsx'
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
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ViewInventoryModal from '../modal/Inventory/ViewInventoryModal.jsx'
import EditInventoryModal from '../modal/Inventory/EditInventoryModal.jsx'
import DeleteInventoryModal from '../modal/Inventory/DeleteInventoryModal.jsx'
import FilterInventory from '~/components/FilterAdmin/FilterInventory.jsx'
import useVariants from '~/hooks/admin/Inventory/useVariants.js'
import useInventory from '~/hooks/admin/Inventory/useInventorys.js'
import useWarehouses from '~/hooks/admin/Inventory/useWarehouses.js'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
import { Stack } from '@mui/system'
import Tooltip from '@mui/material/Tooltip'
import usePermissions from '~/hooks/usePermissions'
const InventoryTab = () => {
  const { hasPermission } = usePermissions()
  const { variants, fetchVariants } = useVariants()
  const {
    inventories,
    fetchInventories,
    loadingInventories,
    totalPageInventory,
    getInventoryId,
    deleteInventoryById,
    updateInventoryById,
    Save
  } = useInventory()
  const { warehouses, fetchWarehouses } = useWarehouses()
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filter, setFilter] = useState({
    status: 'false',
    sort: 'newest'
  })
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
  }, [page, rowsPerPage, filter])

  const inventoryColumns = [
    {
      id: 'index',
      label: 'STT',
      minWidth: 50,
      maxWidth: 50,
      width: 50,
      align: 'center'
    },
    { id: 'warehouse', label: 'Kho hàng', minWidth: 150, maxWidth: 150 },

    { id: 'variantName', label: 'Tên sản phẩm', minWidth: 200, maxWidth: 200 },
    { id: 'sku', label: 'Mã biến thể', minWidth: 200, maxWidth: 200 },
    {
      id: 'quantity',
      label: 'Số lượng tồn',
      minWidth: 190,
      align: 'right',
      pr: 5
    },
    {
      id: 'minQuantity',
      label: 'Ngưỡng cảnh báo',
      minWidth: 150,
      align: 'right'
    },
    {
      id: 'importPrice',
      label: 'Giá nhập',
      minWidth: 150,
      align: 'right',
      format: (val) => `${val?.toLocaleString('vi-VN')}đ`
    },
    {
      id: 'exportPrice',
      label: 'Giá bán',
      minWidth: 206,
      align: 'right',
      pr: 7,
      format: (val) => `${val?.toLocaleString('vi-VN')}đ`
    },
    {
      id: 'status',
      label: 'Trạng thái tồn kho',
      minWidth: 150
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

  // const handleDeleteInventory = async (inventory) => {
  //   const inventoryDetails = await getInventoryId(inventory._id)
  //   setSelectedInventory(inventoryDetails)
  //   setOpenDeleteModal(true)
  // }

  const handleCloseEditModal = () => {
    setSelectedInventory(null)
    setOpenEditModal(false)
    // fetchInventories(page, rowsPerPage, filter)
  }

  const handleCloseDeleteModal = () => {
    setSelectedInventory(null)
    setOpenDeleteModal(false)
    // fetchInventories(page, rowsPerPage, filter)
  }

  const handleSave = async (inventory, type, inventoryId) => {
    if (type === 'edit') {
      await updateInventoryById(inventoryId, inventory)
    } else if (type === 'delete') {
      await deleteInventoryById(inventory)
    }
  }

  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filter, newFilters)) {
      setPage(1)
      setFilter(newFilters)
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
                sx={{ borderBottom: 'none' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    minHeight: 77.5
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
              {inventoryColumns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{
                    minWidth: col.minWidth,
                    width: col.width,
                    ...(col.maxWidth && { maxWidth: col.maxWidth }),
                    ...(col.id === 'action' && {
                      width: '130px',
                      maxWidth: '130px',
                      paddingLeft: '20px'
                    }),
                    px: 1,
                    pr: col.pr
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingInventories ? (
              <TableRow>
                <TableCell colSpan={inventoryColumns.length} align='center'>
                  Đang tải tồn kho...
                </TableCell>
              </TableRow>
            ) : inventories.length === 0 ? (
              <TableNoneData
                col={inventoryColumns.length}
                message='Không có dữ liệu tồn kho.'
              />
            ) : (
              inventories.map((row, index) => (
                <TableRow hover key={index}>
                  {inventoryColumns.map((col) => {
                    let rawValue
                    // Xử lý thủ công các cột đặc biệt có lồng object
                    switch (col.id) {
                      case 'index':
                        rawValue = (page - 1) * rowsPerPage + index + 1
                        break
                      case 'sku':
                        rawValue = row.variantId?.sku
                        break
                      case 'variantName': {
                        const name =
                          row.variantId?.name || 'Không có tên biến thể'
                        rawValue = name
                          .toLowerCase()
                          .split(' ')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(' ')
                        break
                      }

                      case 'warehouse': {
                        const name = row.warehouseId?.name || 'Không có tên kho'
                        rawValue = name
                          .toLowerCase()
                          .split(' ')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(' ')
                        break
                      }

                      default:
                        rawValue = row[col.id]
                    }

                    let content = rawValue ?? '—'

                    if (col.format) content = col.format(rawValue)

                    if (col.id === 'status') {
                      content = (
                        <Chip
                          label={
                            rawValue === 'in-stock'
                              ? 'Còn hàng'
                              : rawValue === 'low-stock'
                                ? 'Cảnh báo'
                                : 'Hết hàng'
                          }
                          color={
                            rawValue === 'in-stock'
                              ? 'success'
                              : rawValue === 'low-stock'
                                ? 'warning'
                                : 'error'
                          }
                          size='large'
                          sx={{ width: 127, fontWeight: 800 }}
                        />
                      )
                    }
                    if (col.id === 'action') {
                      content = (
                        <Stack
                          direction='row'
                          spacing={1}
                          justifyContent='start'
                        >
                          {hasPermission('inventory:read') && (
                            <Tooltip title='Xem'>
                              <IconButton
                                onClick={() => handleViewInventory(row)}
                                size='small'
                              >
                                <RemoveRedEyeIcon color='primary' />
                              </IconButton>
                            </Tooltip>
                          )}
                          {hasPermission('inventory:update') && (
                            <Tooltip title='Sửa'>
                              <IconButton
                                onClick={() => handleEditInventory(row)}
                                size='small'
                              >
                                <BorderColorIcon color='warning' />
                              </IconButton>
                            </Tooltip>
                          )}
                          {/*<Tooltip title='Ẩn'>*/}
                          {/*  <IconButton*/}
                          {/*    onClick={() => handleDeleteInventory(row)}*/}
                          {/*    size='small'*/}
                          {/*  >*/}
                          {/*    <VisibilityOffIcon color='error' />*/}
                          {/*  </IconButton>*/}
                          {/*</Tooltip>*/}
                        </Stack>
                      )
                    }

                    return (
                      <TableCell
                        key={col.id}
                        align={col.align || 'left'}
                        sx={{
                          py: 0,
                          px: 1,
                          height: 55,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          ...(col.maxWidth && { maxWidth: col.maxWidth }),
                          pr: col.pr
                        }}
                        title={
                          typeof content === 'string' ? content : undefined
                        }
                      >
                        {content}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={totalPageInventory || 0}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={(event, newPage) => handleChangePage(event, newPage + 1)} // truyền lại đúng logic cho parent
        onRowsPerPageChange={(event) => {
          const newLimit = parseInt(event.target.value, 10)
          if (onChangeRowsPerPage) {
            onChangeRowsPerPage(newLimit)
          }
        }}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) => {
          const totalPages = Math.ceil(count / rowsPerPage)
          return `${from}–${to} trên ${count} | Trang ${page} / ${totalPages}`
        }}
        ActionsComponent={TablePaginationActions}
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
        onSave={handleSave}
        variants={variants}
        warehouses={warehouses}
        formatCurrency={formatCurrency}
        parseCurrency={parseCurrency}
      />
      <DeleteInventoryModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        inventory={selectedInventory}
        onSave={handleSave}
      />
    </Paper>
  )
}

export default InventoryTab
