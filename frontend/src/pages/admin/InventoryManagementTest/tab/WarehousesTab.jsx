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
  Typography,
  Box,
  Button
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddWarehouseModal from '../modal/Warehouse/AddWarehouseModal.jsx'
const WarehousesTab = ({
  data,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  addWarehouse,
  refreshWarehouses
}) => {
  const warehouseColumns = [
    { id: 'code', label: 'Mã kho', minWidth: 100 },
    { id: 'name', label: 'Tên kho', minWidth: 120 },
    { id: 'address', label: 'Địa chỉ', minWidth: 150 },
    { id: 'ward', label: 'Phường', minWidth: 100 },
    { id: 'district', label: 'Quận', minWidth: 100 },
    { id: 'city', label: 'Thành phố', minWidth: 100 },
    { id: 'action', label: 'Hành động', minWidth: 100, align: 'center' }
  ]
  const [openAddModal, setOpenAddModal] = useState(false)
  const handleAddWarehouse = () => {
    setOpenAddModal(true)
  }
  const handleCloseAddModal = () => {
    setOpenAddModal(false)
    refreshWarehouses()
  }
  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
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
                    onClick={() => handleAddWarehouse()}
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
    </Paper>
  )
}

export default WarehousesTab
