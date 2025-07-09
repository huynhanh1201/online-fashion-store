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
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import EditBatchModal from '../modal/Batch/EditBatchModal.jsx'
import ViewBatchModal from '../modal/Batch/ViewBatchModal.jsx'
import DeleteBatchModal from '../modal/Batch/DeleteBatchModal.jsx'
import FilterBatches from '~/components/FilterAdmin/FilterBatches.jsx'
import useBatches from '~/hooks/admin/Inventory/useBatches.js'
import useVariants from '~/hooks/admin/Inventory/useVariants.js'
import useWarehouses from '~/hooks/admin/Inventory/useWarehouses.js'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import Chip from '@mui/material/Chip'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import usePermissions from '~/hooks/usePermissions'

const BatchesTab = () => {
  const { hasPermission } = usePermissions()
  const {
    batches,
    fetchBatches,
    updateBatchById,
    deleteBatchById,
    loadingBatch,
    totalPageBatch,
    Save,
    fetchBatchId
  } = useBatches()
  const { variants, fetchVariants } = useVariants()
  const { warehouses, fetchWarehouses } = useWarehouses()

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filter, setFilter] = useState({
    sort: 'newest'
  })
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
    {
      id: 'index',
      label: 'STT',
      minWidth: 50,
      maxWidth: 50,
      width: 50,
      align: 'center'
    },
    { id: 'batchCode', label: 'Mã lô hàng ', minWidth: 120, maxWidth: 120 },
    { id: 'variantName', label: 'Tên sản phẩm', minWidth: 200, maxWidth: 200 },
    { id: 'warehouseName', label: 'Kho hàng', minWidth: 100, maxWidth: 150 },
    {
      id: 'quantity',
      label: 'Số lượng sản phẩm',
      minWidth: 80,
      maxWidth: 120,
      align: 'right',
      format: (value) => `${value.toLocaleString('vi-VN')}`
    },
    {
      id: 'importPrice',
      label: 'Giá nhập',
      minWidth: 80,
      maxWidth: 150,
      align: 'right',
      pr: 6,
      format: (value) => `${value.toLocaleString('vi-VN')}₫`
    },
    // {
    //   id: 'destroy',
    //   label: 'Trạng thái lô hàng',
    //   align: 'start',
    //   minWidth: 130
    // },
    {
      id: 'importedAt',
      label: 'Ngày nhập',
      minWidth: 100,
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
  }, [page, rowsPerPage, filter])

  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  // Xem chi tiết lô
  const handleViewBatch = (batch) => {
    setSelectedBatch(batch)
    setOpenViewModal(true)
  }

  // Mở Chart sửa
  const handleEditBatch = (batch) => {
    setSelectedBatch(batch)
    setOpenEditModal(true)
  }

  // Đóng Chart sửa, refresh danh sách
  const handleCloseEditModal = () => {
    setOpenEditModal(false)
  }

  // Mở Chart xoá
  const handleDeleteBatch = (batch) => {
    setSelectedBatch(batch)
    setOpenDeleteModal(true)
  }

  // Đóng Chart xoá, refresh danh sách
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
  }
  const handleSave = async (batch, type, batchId) => {
    if (type === 'edit') {
      await updateBatchById(batchId, batch)
    } else if (type === 'delete') {
      await deleteBatchById(batch)
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
                      minWidth: 250,
                      minHeight: 76.5
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
              {batchColumns.map((col) => (
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
                      paddingLeft: '26px'
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
            {loadingBatch ? (
              <TableRow>
                <TableCell colSpan={batchColumns.length} align='center'>
                  Đang tải dữ liệu lô hàng...
                </TableCell>
              </TableRow>
            ) : enrichedBatches.length === 0 ? (
              <TableNoneData
                col={batchColumns.length}
                message='Không có dữ liệu lô hàng.'
              />
            ) : (
              enrichedBatches.map((row, index) => (
                <TableRow hover key={index}>
                  {batchColumns.map((col) => {
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

                    if (
                      col.format &&
                      rawValue !== null &&
                      rawValue !== undefined
                    ) {
                      content = col.format(rawValue)
                    }
                    if (col.id === 'index') {
                      content = page - 1 + index + 1
                    }
                    if (
                      col.id === 'variantName' ||
                      col.id === 'warehouseName'
                    ) {
                      content = capitalizeWords(rawValue)
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
                          alignItems='start'
                        >
                          {hasPermission('batch:read') && (
                            <Tooltip title='Xem'>
                              <IconButton
                                onClick={() => handleViewBatch(row)}
                                size='small'
                              >
                                <RemoveRedEyeIcon color='primary' />
                              </IconButton>
                            </Tooltip>
                          )}
                          {hasPermission('batch:update') && (
                            <Tooltip title='Sửa'>
                              <IconButton
                                onClick={() => handleEditBatch(row)}
                                size='small'
                              >
                                <BorderColorIcon color='warning' />
                              </IconButton>
                            </Tooltip>
                          )}
                          {/*{hasPermission('batch:update') && (*/}
                          {/*  <Tooltip title='Xoá'>*/}
                          {/*    <IconButton*/}
                          {/*      onClick={() => handleDeleteBatch(row)}*/}
                          {/*      size='small'*/}
                          {/*    >*/}
                          {/*      <VisibilityOffIcon color='error' />*/}
                          {/*    </IconButton>*/}
                          {/*  </Tooltip>*/}
                          {/*)}*/}
                        </Stack>
                      )
                    }

                    return (
                      <TableCell
                        key={col.id}
                        align={col.align || 'left'}
                        onClick={
                          col.id === 'batchCode' && hasPermission('batch:read')
                            ? () => handleViewBatch(row)
                            : undefined
                        }
                        sx={{
                          py: 0,
                          px: 1,
                          pr: col.pr,
                          height: 55,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          background: '#fff',
                          ...(col.maxWidth && { maxWidth: col.maxWidth }),
                          ...(col.id === 'batchCode' &&
                            hasPermission('batch:read') && {
                              cursor: 'pointer'
                            })
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
        sx={{ background: '#fff' }}
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
          const totalPages = Math.max(1, Math.ceil(count / rowsPerPage))
          return `${from}–${to} trên ${count} | Trang ${page} / ${totalPages}`
        }}
        ActionsComponent={TablePaginationActions}
      />
      <EditBatchModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        batch={selectedBatch}
        onSave={handleSave}
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
        onSave={handleSave}
      />
    </Paper>
  )
}

export default BatchesTab
