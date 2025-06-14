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
import useBatches from '~/hooks/admin/Inventory/useBatches.js'
import useVariants from '~/hooks/admin/Inventory/useVariants.js'
import useWarehouses from '~/hooks/admin/Inventory/useWarehouses.js'
const BatchesTab = () => {
  const {
    batches,
    fetchBatches,
    createNewBatch,
    updateBatchById,
    deleteBatchById,
    loadingBatch,
    totalPageBatch
  } = useBatches()
  const { variants, fetchVariants } = useVariants()
  const { warehouses, fetchWarehouses } = useWarehouses()

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filter, setFilter] = useState({})
  const enrichedBatches = batches.map((batch) => {
    return {
      ...batch,
      variantName: batch.variantId.name || 'N/A',
      warehouseName: batch.warehouseId.name || 'N/A',
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
    { id: 'action', label: 'Hành động', minWidth: 150, align: 'start' }
  ]
  useEffect(() => {
    fetchVariants()
    fetchWarehouses()
  }, [])

  useEffect(() => {
    fetchBatches(page, rowsPerPage, filter)
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
    fetchBatches(page, rowsPerPage)
  }

  // Mở modal xoá
  const handleDeleteBatch = (batch) => {
    setSelectedBatch(batch)
    setOpenDeleteModal(true)
  }

  // Đóng modal xoá, refresh danh sách
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    fetchBatches(page, rowsPerPage)
  }

  const handleFilter = (newFilters) => {
    setFilter(newFilters)
    if (Object.keys(newFilters).length > 0) {
      fetchBatches(1, rowsPerPage, newFilters)
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
                    warehouses={warehouses}
                    onFilter={handleFilter}
                    loading={loadingBatch}
                    batches={batches}
                    fetchData={fetchBatches}
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
        count={totalPageBatch || 0}
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
      />
      <EditBatchModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        batch={selectedBatch}
        onSave={updateBatchById}
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
        onSave={deleteBatchById}
      />
    </Paper>
  )
}

export default BatchesTab
