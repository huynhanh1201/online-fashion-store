// InventoryLogTab.js
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
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Box,
  IconButton,
  Chip
} from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import ViewInventoryLogModal from '../modal/InventoryLog/ViewInventoryLogModal'
import FilterInventoryLog from '~/components/FilterAdmin/FilterInventoryLog.jsx'
import useUsers from '~/hooks/admin/useUsers.js'
import useBatches from '~/hooks/admin/Inventory/useBatches.js'
import useInventoryLog from '~/hooks/admin/Inventory/useInventoryLogs.js'
import useVariants from '~/hooks/admin/Inventory/useVariants.js'
import useInventory from '~/hooks/admin/Inventory/useInventorys.js'
import useWarehouses from '~/hooks/admin/Inventory/useWarehouses.js'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
import Tooltip from '@mui/material/Tooltip'
import usePermissions from '~/hooks/usePermissions'

const InventoryLogTab = () => {
  const { logs, fetchLogs, loadingLog, totalLogs } = useInventoryLog()
  const { variants, fetchVariants } = useVariants()
  const { warehouses, fetchWarehouses } = useWarehouses()
  const { batches, fetchBatches } = useBatches()
  const { users, fetchUsers } = useUsers()
  const { inventories, fetchInventories } = useInventory()

  const [page, setPage] = useState(1) // State cho trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(10) // State cho số dòng mỗi trang
  const [filters, setFilters] = useState({
    sort: 'newest'
  }) // State cho kho
  const [openViewModal, setOpenViewModal] = useState(false) // State cho modal xem
  const [selectedLog, setSelectedLog] = useState(null) // State cho bản ghi được chọn
  const { hasPermission } = usePermissions()

  useEffect(() => {
    fetchInventories()
    fetchVariants()
    fetchBatches()
    fetchUsers()
    fetchWarehouses()
  }, [])
  useEffect(() => {
    fetchLogs(page, rowsPerPage, filters)
  }, [page, rowsPerPage, filters])
  const handleViewLog = (log) => {
    setSelectedLog(log)
    setOpenViewModal(true)
  }

  const inventoryLogColumns = [
    {
      id: 'index',
      label: 'STT',
      minWidth: 50,
      maxWidth: 50,
      width: 50,
      align: 'center'
    },
    { id: 'variantName', label: 'Tên sản phẩm', minWidth: 150, maxWidth: 200 },
    // {
    //   id: 'createdByName',
    //   label: 'Người thực hiện',
    //   minWidth: 120
    // },
    { id: 'warehouse', label: 'Kho hàng', minWidth: 100, maxWidth: 150 },
    {
      id: 'typeLabel',
      label: 'Loại phiếu',
      minWidth: 150,
      align: 'start',
      maxWidth: 150
    },
    {
      id: 'amount',
      label: 'Số lượng',
      minWidth: 150,
      align: 'right',
      format: (value) => `${value.toLocaleString('vi-VN')}`
    },
    {
      id: 'importPrice',
      label: 'Giá nhập',
      minWidth: 150,
      align: 'right',
      format: (value) => `${value.toLocaleString('vi-VN')}đ`
    },
    {
      id: 'exportPrice',
      label: 'Giá xuất',
      minWidth: 230,
      align: 'right',
      pr: 10,
      format: (value) => `${value.toLocaleString('vi-VN')}đ`
    },
    { id: 'createdAtFormatted', label: 'Ngày thực hiện', minWidth: 100 },
    { id: 'action', label: 'Hành động', minWidth: 130, align: 'start' }
  ]

  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filters, newFilters)) {
      setPage(1)
      setFilters(newFilters)
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
        <Table stickyHeader aria-label='inventory log table'>
          <TableHead>
            <TableRow sx={{ paddingBottom: '0' }}>
              <TableCell colSpan={inventoryLogColumns.length}>
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
                      Danh Sách Lịch Sử Xuất Nhập Kho
                    </Typography>
                  </Box>
                  <FilterInventoryLog
                    warehouses={warehouses}
                    onFilter={handleFilter}
                    loading={loadingLog}
                    batches={batches}
                    inventories={inventories}
                    users={users}
                    inventoryLog={logs || []}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {inventoryLogColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{
                    minWidth: column.minWidth,
                    width: column.width,
                    px: 1,
                    pr: column.pr,
                    ...(column.maxWidth && { maxWidth: column.maxWidth }),
                    ...(column.id === 'action' && {
                      width: 130,
                      maxWidth: 130,
                      paddingLeft: 2
                    }),
                    ...(column.id === 'typeLabel' && {
                      width: 150,
                      maxWidth: 150
                    })
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingLog ? (
              <TableRow>
                <TableCell colSpan={inventoryLogColumns.length} align='center'>
                  Đang tải nhật ký tồn kho...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableNoneData
                col={inventoryLogColumns.length}
                message='Không có dữ liệu lịch sử xuất nhập kho.'
              />
            ) : (
              logs.map((row, index) => (
                <TableRow hover key={index}>
                  {inventoryLogColumns.map((col) => {
                    let rawValue
                    const capitalizeWords = (text) =>
                      (text || '')
                        .toLowerCase()
                        .split(' ')
                        .filter(Boolean)
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' ')
                    // Xử lý các field đặc biệt
                    switch (col.id) {
                      case 'index':
                        rawValue = (page - 1) * rowsPerPage + index + 1
                        break
                      case 'variantName':
                        rawValue = capitalizeWords(
                          row.inventoryId?.variantId?.name
                        )
                        break

                      case 'warehouse':
                        rawValue = capitalizeWords(
                          row.inventoryId?.warehouseId?.name
                        )
                        break

                      case 'batchName': {
                        const batch = batches.find((b) => b._id === row.batchId)
                        rawValue = capitalizeWords(batch?.batchCode)
                        break
                      }

                      case 'typeLabel':
                        rawValue = row.type === 'in' ? 'Nhập' : 'Xuất'
                        break
                      case 'createdAtFormatted':
                        rawValue = new Date(row.createdAt).toLocaleDateString(
                          'vi-VN'
                        )
                        break
                      case 'createdByName':
                        rawValue = row.createdBy?.name
                        break
                      default:
                        rawValue = row[col.id]
                    }

                    // Định dạng nếu có format
                    let content = rawValue ?? '—'
                    if (col.format && rawValue !== undefined) {
                      content = col.format(rawValue)
                    }

                    // Chip loại nhập/xuất
                    if (col.id === 'typeLabel') {
                      content = (
                        <Chip
                          label={rawValue}
                          size='large'
                          sx={{ width: 120, fontWeight: 800 }}
                          color={row.type === 'in' ? 'success' : 'error'}
                        />
                      )
                    }

                    // Số lượng + dấu
                    if (col.id === 'amount') {
                      content = (
                        <Typography
                          sx={{
                            fontWeight: 900,
                            color: row.type === 'in' ? 'green' : 'red'
                          }}
                        >
                          {rawValue !== undefined
                            ? `${row.type === 'in' ? '+' : ''}${rawValue}`
                            : '—'}
                        </Typography>
                      )
                    }

                    // Nút hành động
                    if (col.id === 'action') {
                      content = (
                        <Tooltip title='Xem'>
                          {hasPermission('inventoryLog:read') && (
                            <IconButton
                              onClick={() => handleViewLog(row)}
                              size='small'
                              color='primary'
                            >
                              <RemoveRedEyeIcon color='primary' />
                            </IconButton>
                          )}
                        </Tooltip>
                      )
                    }

                    return (
                      <TableCell
                        key={col.id}
                        align={col.align || 'left'}
                        sx={{
                          py: 0,
                          px: 1,
                          pr: col.pr,
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
        count={totalLogs || 0}
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

      <ViewInventoryLogModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        log={selectedLog}
        variants={variants}
        warehouses={warehouses}
      />
    </Paper>
  )
}

export default InventoryLogTab
