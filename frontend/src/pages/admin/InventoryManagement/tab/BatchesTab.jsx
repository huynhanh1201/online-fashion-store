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

const BatchesTab = ({
  data,
  variants,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  updateBatch,
  refreshBatches,
  deleteBatch,
  warehouses,
  parseCurrency,
  formatCurrency
}) => {
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
    refreshBatches()
  }, [])

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
                    alignItems: 'center'
                  }}
                >
                  <Typography variant='h6' sx={{ fontWeight: '800' }}>
                    Danh sách lô hàng
                  </Typography>
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
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={(e) => onRowsPerPageChange(e, 'batch')}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) => {
          const actualTo = to > count ? count : to // nếu to vượt quá count thì lấy count
          const actualFrom = from > count ? count : from // nếu from vượt quá count thì lấy count
          return `${actualFrom}–${actualTo} trên ${count !== -1 ? count : `hơn ${actualTo}`}`
        }}
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
