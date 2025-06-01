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
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddWarehouseModal from '../modal/Warehouse/AddWarehouseModal.jsx'
import EditWarehouseModal from '../modal/Warehouse/EditWarehouseModal.jsx'
import ViewWarehouseModal from '../modal/Warehouse/ViewWarehouseModal.jsx'
import DeleteWarehouseModal from '../modal/Warehouse/DeleteWarehouseModal.jsx' // Thêm modal mới

const WarehousesTab = ({
  data,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  addWarehouse,
  updateWarehouse,
  deleteWarehouse,
  refreshWarehouses
}) => {
  const warehouseColumns = [
    { id: 'code', label: 'Mã kho', minWidth: 100 },
    { id: 'name', label: 'Tên kho', minWidth: 120 },
    { id: 'address', label: 'Địa chỉ', minWidth: 150 },
    { id: 'ward', label: 'Phường', minWidth: 100 },
    { id: 'district', label: 'Quận', minWidth: 100 },
    { id: 'city', label: 'Thành phố', minWidth: 100 },
    { id: 'action', label: 'Hành động', minWidth: 150, align: 'center' }
  ]

  const [openAddModal, setOpenAddModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false) // Thêm state cho View modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false) // Thêm state cho Delete modal
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)

  useEffect(() => {
    refreshWarehouses()
  }, [])

  const handleAddWarehouse = () => {
    setOpenAddModal(true)
  }

  const handleCloseAddModal = () => {
    setOpenAddModal(false)
    refreshWarehouses()
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
    refreshWarehouses()
  }

  const handleDeleteWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse)
    setOpenDeleteModal(true) // Mở Delete modal
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setSelectedWarehouse(null)
    refreshWarehouses()
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
                    alignItems: 'center'
                  }}
                >
                  <Typography variant='h6' sx={{ fontWeight: '800' }}>
                    Danh sách kho hàng
                  </Typography>
                  <Button
                    variant='contained'
                    color='primary'
                    sx={{ mr: 1 }}
                    onClick={handleAddWarehouse}
                  >
                    Thêm kho hàng
                  </Button>
                </Box>
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
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
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
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleEditWarehouse(row)}
                            size='small'
                            color='info'
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteWarehouse(row)}
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
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />

      <AddWarehouseModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onSave={addWarehouse}
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
        onSave={updateWarehouse}
      />

      <DeleteWarehouseModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        warehouse={selectedWarehouse}
        onSave={deleteWarehouse}
      />
    </Paper>
  )
}

export default WarehousesTab
