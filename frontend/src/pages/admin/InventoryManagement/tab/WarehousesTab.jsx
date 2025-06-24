// WarehousesTab.js
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
  Typography,
  Box,
  Button,
  IconButton
} from '@mui/material'
import { Suspense } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import AddIcon from '@mui/icons-material/Add'
const AddWarehouseModal = React.lazy(
  () => import('../modal/Warehouse/AddWarehouseModal.jsx')
)
const EditWarehouseModal = React.lazy(
  () => import('../modal/Warehouse/EditWarehouseModal')
)
import ViewWarehouseModal from '../modal/Warehouse/ViewWarehouseModal.jsx'
import DeleteWarehouseModal from '../modal/Warehouse/DeleteWarehouseModal.jsx' // Thêm modal mới
import Tooltip from '@mui/material/Tooltip'
import FilterWarehouse from '~/components/FilterAdmin/FilterWarehouse.jsx'
import useWarehouses from '~/hooks/admin/Inventory/useWarehouses.js'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import Chip from '@mui/material/Chip'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
import Stack from '@mui/material/Stack'
import usePermissions from '~/hooks/usePermissions'

const WarehousesTab = () => {
  const { hasPermission } = usePermissions()
  const {
    warehouses,
    fetchWarehouses,
    createNewWarehouse,
    updateWarehouseById,
    deleteWarehouseById,
    loadingWarehouse,
    totalWarehouse
  } = useWarehouses()
  const warehouseColumns = [
    {
      id: 'index',
      label: 'STT',
      minWidth: 50,
      maxWidth: 50,
      width: 50,
      align: 'center'
    },
    { id: 'code', label: 'Mã kho hàng', minWidth: 100 },
    { id: 'name', label: 'Tên kho hàng', minWidth: 120 },
    { id: 'address', label: 'Địa chỉ kho hàng', minWidth: 150 },
    { id: 'city', label: 'Thành phố', minWidth: 100 },
    { id: 'district', label: 'Quận', minWidth: 100 },
    { id: 'ward', label: 'Huyện', minWidth: 100 },
    { id: 'destroy', label: 'Trạng thái kho hàng', minWidth: 150 },
    { id: 'action', label: 'Hành động', minWidth: 150, align: 'start' }
  ]

  const [openAddModal, setOpenAddModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false) // Thêm state cho View modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false) // Thêm state cho Delete modal
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [page, setPage] = useState(1) // State cho trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(10) // State cho số dòng mỗi trang
  const [filter, setFilter] = useState({
    status: 'false',
    sort: 'newest'
  })

  useEffect(() => {
    fetchWarehouses(page, rowsPerPage, filter)
  }, [page, rowsPerPage, filter])

  const handleAddWarehouse = () => {
    setOpenAddModal(true)
  }

  const handleCloseAddModal = () => {
    setOpenAddModal(false)
  }

  const handleViewWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse)
    setOpenViewModal(true) // Mở View modal
  }

  const handleEditWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse)
    setOpenEditModal(true)
  }

  const handleCloseEditModal = () => {
    setOpenEditModal(false)
    setSelectedWarehouse(null)
  }

  const handleDeleteWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse)
    setOpenDeleteModal(true) // Mở Delete modal
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setSelectedWarehouse(null)
  }

  const handleSave = async (warehouse, type, warehouseId) => {
    if (type === 'add') {
      await createNewWarehouse(warehouse, filter)
    } else if (type === 'edit') {
      await updateWarehouseById(warehouseId, warehouse)
    } else if (type === 'delete') {
      await deleteWarehouseById(warehouse)
    }
  }

  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filter, newFilters)) {
      setPage(1)
      setFilter(newFilters)
    }
  }
  const handleChangePage = (event, value) => setPage(value)

  const onChangeRowsPerPage = (newLimit) => {
    setPage(1)
    setRowsPerPage(newLimit)
  }

  const activeWarehouses = warehouses.filter(
    (warehouse) => warehouse.destroy === false
  )

  // Điều kiện: Chỉ cho phép bấm nút nếu activeWarehouses.length <= 1 và có quyền tạo
  const isAddDisabled = activeWarehouses.length >= 1 || !hasPermission('warehouse:create')

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label='warehouses table'>
          <TableHead>
            <TableRow>
              <TableCell colSpan={warehouseColumns.length}>
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
                      minWidth: 250,
                      minHeight: 76.5
                    }}
                  >
                    <Typography variant='h6' sx={{ fontWeight: '800' }}>
                      Danh Sách Kho Hàng
                    </Typography>
                    {!isAddDisabled && (
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={handleAddWarehouse}
                        startIcon={<AddIcon />}
                        sx={{
                          textTransform: 'none',
                          width: 100,
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#001f5d',
                          color: '#fff'
                        }}
                      >
                        Thêm
                      </Button>
                    )}
                  </Box>
                  <FilterWarehouse
                    loading={loadingWarehouse}
                    onFilter={handleFilter}
                    warehouses={warehouses}
                    fetchWarehouses={fetchWarehouses}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {warehouseColumns.map((col) => (
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
                    px: 1
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingWarehouse ? (
              <TableRow>
                <TableCell colSpan={warehouseColumns.length} align='center'>
                  Đang tải danh sách kho...
                </TableCell>
              </TableRow>
            ) : warehouses.length === 0 ? (
              <TableNoneData
                col={warehouseColumns.length}
                message='Không có dữ liệu kho hàng.'
              />
            ) : (
              warehouses.map((row, index) => (
                <TableRow hover key={index}>
                  {warehouseColumns.map((col) => {
                    const rawValue = row[col.id]
                    let content = rawValue ?? '—'
                    const capitalizeWords = (text) =>
                      (text || '')
                        .toLowerCase()
                        .split(' ')
                        .filter(Boolean)
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' ')

                    if (col.id === 'index') {
                      content = (page - 1) * rowsPerPage + index + 1
                    }
                    if (col.id === 'name') {
                      content = capitalizeWords(rawValue)
                    }
                    if (col.format) {
                      content = col.format(rawValue)
                    }

                    if (col.id === 'destroy') {
                      content = (
                        <Chip
                          label={rawValue ? 'Không hoạt động' : 'Hoạt động'}
                          color={rawValue ? 'error' : 'success'}
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
                          {hasPermission('warehouse:read') && (
                            <Tooltip title='Xem'>
                              <IconButton
                                onClick={() => handleViewWarehouse(row)}
                                size='small'
                              >
                                <RemoveRedEyeIcon color='primary' />
                              </IconButton>
                            </Tooltip>
                          )}
                          {hasPermission('warehouse:update') && (
                            <Tooltip title='Sửa'>
                              <IconButton
                                onClick={() => handleEditWarehouse(row)}
                                size='small'
                              >
                                <BorderColorIcon color='warning' />
                              </IconButton>
                            </Tooltip>
                          )}
                          {hasPermission('warehouse:delete') && (
                            <Tooltip title='Ẩn'>
                              <IconButton
                                onClick={() => handleDeleteWarehouse(row)}
                                size='small'
                              >
                                <VisibilityOffIcon color='error' />
                              </IconButton>
                            </Tooltip>
                          )}
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
                          ...(col.maxWidth && { maxWidth: col.maxWidth })
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
        count={totalWarehouse || 0}
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

      <ViewWarehouseModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        warehouse={selectedWarehouse}
      />

      <Suspense fallback={<div>Loading...</div>}>
        {openAddModal && !isAddDisabled && (
          <AddWarehouseModal
            open={openAddModal}
            onClose={handleCloseAddModal}
            onSave={handleSave}
          />
        )}
        {openEditModal && (
          <EditWarehouseModal
            open={openEditModal}
            onClose={handleCloseEditModal}
            warehouse={selectedWarehouse}
            onSave={handleSave}
          />
        )}
      </Suspense>

      <DeleteWarehouseModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        warehouse={selectedWarehouse}
        onSave={handleSave}
      />
    </Paper>
  )
}

export default WarehousesTab
