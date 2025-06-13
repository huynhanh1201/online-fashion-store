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
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddIcon from '@mui/icons-material/Add'
import AddWarehouseModal from '../modal/Warehouse/AddWarehouseModal.jsx'
import EditWarehouseModal from '../modal/Warehouse/EditWarehouseModal.jsx'
import ViewWarehouseModal from '../modal/Warehouse/ViewWarehouseModal.jsx'
import DeleteWarehouseModal from '../modal/Warehouse/DeleteWarehouseModal.jsx' // Thêm modal mới
import FilterWarehouse from '~/components/FilterAdmin/FilterWarehouse.jsx'
import useWarehouses from '~/hooks/admin/Inventory/useWarehouses.js'
const WarehousesTab = () => {
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
    { id: 'code', label: 'Mã kho', minWidth: 100 },
    { id: 'name', label: 'Tên kho', minWidth: 120 },
    { id: 'address', label: 'Địa chỉ', minWidth: 150 },
    { id: 'ward', label: 'Phường', minWidth: 100 },
    { id: 'district', label: 'Quận', minWidth: 100 },
    { id: 'city', label: 'Thành phố', minWidth: 100 },
    { id: 'action', label: 'Hành động', minWidth: 150, align: 'start' }
  ]

  const [openAddModal, setOpenAddModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false) // Thêm state cho View modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false) // Thêm state cho Delete modal
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [page, setPage] = useState(1) // State cho trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(10) // State cho số dòng mỗi trang
  const [filter, setFilter] = useState({})

  useEffect(() => {
    fetchWarehouses(page, rowsPerPage, filter)
  }, [page, rowsPerPage])

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
    fetchWarehouses(page, rowsPerPage)
  }

  const handleDeleteWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse)
    setOpenDeleteModal(true) // Mở Delete modal
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setSelectedWarehouse(null)
    fetchWarehouses(page, rowsPerPage)
  }
  const handleFilter = (newFilters) => {
    setFilter(newFilters)
    if (Object.keys(newFilters).length > 0) {
      fetchWarehouses(1, rowsPerPage, newFilters)
    }
  }
  const handleChangePage = (event, value) => setPage(value)

  const onChangeRowsPerPage = (newLimit) => {
    setPage(1)
    setRowsPerPage(newLimit)
  }
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
                      minWidth: 250
                    }}
                  >
                    <Typography variant='h6' sx={{ fontWeight: '800' }}>
                      Danh Sách Kho Hàng
                    </Typography>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleAddWarehouse}
                      startIcon={<AddIcon />}
                      sx={{
                        textTransform: 'none',
                        width: 100,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      Thêm
                    </Button>
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
              {warehouseColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
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
            {warehouses.map((row, index) => (
              <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                {warehouseColumns.map((column) => {
                  const value = row[column.id]
                  if (column.id === 'action') {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <IconButton
                          onClick={() => handleViewWarehouse(row)}
                          size='small'
                          color='primary'
                        >
                          <RemoveRedEyeIcon color='primary' />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditWarehouse(row)}
                          size='small'
                          color='info'
                        >
                          <BorderColorIcon color='warning' />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteWarehouse(row)}
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
                      {value}
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
        count={totalWarehouse || 0}
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

      <AddWarehouseModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onSave={createNewWarehouse}
      />

      <ViewWarehouseModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        warehouse={selectedWarehouse}
      />

      <EditWarehouseModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        warehouse={selectedWarehouse}
        onSave={updateWarehouseById}
      />

      <DeleteWarehouseModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        warehouse={selectedWarehouse}
        onSave={deleteWarehouseById}
      />
    </Paper>
  )
}

export default WarehousesTab
