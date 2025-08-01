import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Paper,
  Box,
  Button
} from '@mui/material'

import DiscountRow from './DiscountRow'
import FilterDiscount from '~/components/FilterAdmin/FilterDiscount'
import AddIcon from '@mui/icons-material/Add'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
const DiscountTable = ({
  discounts = [],
  loading = false,
  page = 0,
  rowsPerPage = 10,
  onAction,
  fetchDiscounts,
  total,
  onFilter,
  onPageChange,
  onChangeRowsPerPage,
  addDiscount,
  permissions = {},
  filters
}) => {
  const columns = [
    { id: 'index', label: 'STT', align: 'center', width: 50 },
    { id: 'code', label: 'Mã giảm giá', minWidth: 150 },
    { id: 'type', label: 'Loại mã giảm giá', minWidth: 130 },
    { id: 'amount', label: 'Giá trị giảm', minWidth: 120, align: 'right' },
    {
      id: 'minOrderValue',
      label: 'Giá tối thiểu áp dụng',
      minWidth: 150,
      align: 'right'
    },
    { id: 'usageLimit', label: 'SL tối đa', minWidth: 100, align: 'right' },
    {
      id: 'remaining',
      label: 'SL còn lại',
      minWidth: 172,
      align: 'right',
      pr: 9
    },
    { id: 'status', label: 'Trạng thái hoạt động', minWidth: 150 },
    { id: 'action', label: 'Hành động', minWidth: 150, align: 'start' }
  ]

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell colSpan={columns.length}>
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
                      Danh Sách Mã Giảm Giá
                    </Typography>
                    {permissions.canCreate && (
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={addDiscount}
                        startIcon={<AddIcon />}
                        sx={{
                          textTransform: 'none',
                          width: 100,
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: 'var(--primary-color)',
                          color: '#fff'
                        }}
                      >
                        Thêm
                      </Button>
                    )}
                  </Box>
                  <FilterDiscount
                    fetchDiscounts={fetchDiscounts}
                    onFilter={onFilter}
                    discounts={discounts}
                    loading={loading}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{
                    minWidth: column.minWidth,
                    px: 1,
                    pr: column.pr,
                    ...(column.maxWidth && { maxWidth: column.maxWidth }),
                    ...(column.id === 'action' && {
                      width: '130px',
                      maxWidth: '130px',
                      paddingLeft: '12px'
                    })
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : discounts.length > 0 ? (
              discounts.map((discount, idx) => (
                <DiscountRow
                  key={discount._id}
                  discount={discount}
                  index={page * rowsPerPage + idx + 1}
                  columns={columns}
                  onAction={onAction}
                  permissions={permissions}
                  filters={filters}
                />
              ))
            ) : (
              <TableNoneData
                col={columns.length}
                message='Không có dữ liệu mã giảm giá.'
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        sx={{ background: '#fff' }}
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => onPageChange(event, newPage + 1)} // truyền lại đúng logic cho parent
        onRowsPerPageChange={(event) => {
          const newLimit = parseInt(event.target.value, 10)
          if (onChangeRowsPerPage) {
            onChangeRowsPerPage(newLimit)
          }
        }}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) => {
          const totalPages = Math.max(1, Math.ceil(count / rowsPerPage))
          return `${from}–${to} trên ${count} | Trang ${page + 1} / ${totalPages}`
        }}
        ActionsComponent={TablePaginationActions}
      />
    </Paper>
  )
}

export default DiscountTable
