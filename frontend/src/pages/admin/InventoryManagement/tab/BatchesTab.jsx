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
import EditBatchModal from '../modal/Batch/EditBatchModal.jsx'
import ViewBatchModal from '../modal/Batch/ViewBatchModal.jsx'
import DeleteBatchModal from '../modal/Batch/DeleteBatchModal.jsx'
import FilterBatches from '~/components/FilterAdmin/FilterBatches.jsx'

const BatchesTab = ({
  data,
  variants,
  warehouse,
  page,
  rowsPerPage,
  onPageChange,
  onChangeRowsPerPage,
  loading,
  total,
  updateBatch,
  refreshBatches,
  deleteBatch,
  warehouses,
  parseCurrency,
  formatCurrency,
  fetchVariants,
  fetchWarehouses
}) => {
  const [filter, setFilter] = useState({})
  const enrichedBatches = data.map((batch) => {
    const variantName =
      typeof batch.variantId === 'object'
        ? batch.variantId.name
        : Array.isArray(variants)
          ? variants.find((v) => v.id === batch.variantId)?.name
          : 'N/A'

    const warehouseName =
      typeof batch.warehouseId === 'object'
        ? batch.warehouseId.name
        : Array.isArray(warehouses)
          ? warehouses.find((w) => w.id === batch.warehouseId)?.name
          : 'N/A'
    return {
      ...batch,
      variantName: variantName || 'N/A',
      warehouseName: warehouseName || 'N/A',
      manufactureDate: batch.manufactureDate ?? null,
      expiry: batch.expiry ?? null
    }
  })

  const batchColumns = [
    { id: 'batchCode', label: 'Mã lô', minWidth: 120 },
    { id: 'variantName', label: 'Biến thể', minWidth: 200 },
    {
      id: 'warehouseName',
      label: 'Kho hàng',
      minWidth: 150
    },
    {
      id: 'quantity',
      label: 'Số lượng',
      minWidth: 100,
      align: 'right',
      format: (value) => `${value.toLocaleString('vi-VN')}`
    },
    {
      id: 'importPrice',
      label: 'Giá nhập',
      minWidth: 120,
      align: 'right',
      format: (value) => `${value.toLocaleString('vi-VN')}đ`
    },
    {
      id: 'importedAt',
      label: 'Ngày nhập',
      minWidth: 150,
      format: (value) =>
        new Date(value).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
    },
    {
      id: 'manufactureDate',
      label: 'NSX',
      minWidth: 130,
      format: (value) =>
        new Date(value).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
    },
    { id: 'action', label: 'Hành động', minWidth: 150, align: 'center' }
  ]
  useEffect(() => {
    fetchVariants()
    fetchWarehouses()
  }, [])

  useEffect(() => {
    refreshBatches(page, rowsPerPage, filter)
  }, [page, rowsPerPage])

  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  // Xem chi tiết lô
  const handleViewBatch = (batch) => {
    setSelectedBatch(batch)
    setOpenViewModal(true)
  }

  // Mở modal sửa
  const handleEditBatch = (batch) => {
    setSelectedBatch(batch)
    setOpenEditModal(true)
  }

  // Đóng modal sửa, refresh danh sách
  const handleCloseEditModal = () => {
    setOpenEditModal(false)
    refreshBatches()
  }

  // Mở modal xoá
  const handleDeleteBatch = (batch) => {
    setSelectedBatch(batch)
    setOpenDeleteModal(true)
  }

  // Đóng modal xoá, refresh danh sách
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    refreshBatches()
  }

  const handleFilter = (newFilters) => {
    setFilter(newFilters)
    if (Object.keys(newFilters).length > 0) {
      refreshBatches(1, rowsPerPage, newFilters)
    }
  }
  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label='batches table'>
          <TableHead>
            <TableRow>
              <TableCell colSpan={batchColumns.length}>
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
                      Danh Sách Lô Hàng
                    </Typography>
                  </Box>
                  <FilterBatches
                    variants={variants}
                    warehouses={warehouse}
                    onFilter={handleFilter}
                    loading={loading}
                    batches={data}
                    fetchData={refreshBatches}
                  />
                </Box>
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
            {enrichedBatches.map((row, index) => (
              <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                {batchColumns.map((column) => {
                  const value = row[column.id]
                  if (column.id === 'action') {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <IconButton
                          onClick={() => handleViewBatch(row)}
                          size='small'
                          color='primary'
                        >
                          <RemoveRedEyeIcon color='primary' />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditBatch(row)}
                          size='small'
                          color='info'
                        >
                          <BorderColorIcon color='warning' />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteBatch(row)}
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
                      {column.format && value !== null && value !== undefined
                        ? column.format(value)
                        : (value ?? 'Không có dữ liệu')}
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
        count={total || 0}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={(event, newPage) => onPageChange(event, newPage + 1)} // +1 để đúng logic bên cha
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
      <EditBatchModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        batch={selectedBatch}
        onSave={updateBatch}
        variants={variants}
        parseCurrency={parseCurrency}
        formatCurrency={formatCurrency}
      />
      <ViewBatchModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        batch={selectedBatch}
      />
      <DeleteBatchModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        batch={selectedBatch}
        onSave={deleteBatch}
      />
    </Paper>
  )
}

export default BatchesTab
