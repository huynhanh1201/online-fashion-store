import React from 'react'
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Box,
  TablePagination,
  Button
} from '@mui/material'
import ReviewRow from './ReviewRow'
import FilterReview from '~/components/FilterAdmin/FilterReview.jsx'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'

const ReviewTable = ({
  reviews,
  loading,
  handleOpenModal,
  total,
  permissions = {},
  onFilter,
  onChangeRowsPerPage,
  onPageChange,
  page,
  rowsPerPage,
  filter
}) => {
  console.log(total)
  const columns = [
    { id: 'index', label: 'STT', align: 'center', width: 50 },
    { id: 'product', label: 'Sản phẩm', align: 'left', minWidth: 200 },
    { id: 'user', label: 'Người đánh giá', align: 'left', minWidth: 150 },
    { id: 'rating', label: 'Số sao', align: 'right', minWidth: 200, pr: 10 },
    {
      id: 'moderationStatus',
      label: 'Trạng thái kiểm duyệt',
      align: 'left',
      minWidth: 160
    },
    { id: 'createdAt', label: 'Ngày đánh giá', align: 'left', minWidth: 200 },
    {
      id: 'action',
      label: 'Hành động',
      align: 'left',
      width: 130,
      maxWidth: 130,
      pl: '20px'
    }
  ]

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label='reviews table'>
          <TableHead>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    minHeight: 76.5
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{ fontWeight: '800', minWidth: 274 }}
                  >
                    Danh sách đánh giá sản phẩm
                  </Typography>
                  <FilterReview
                    onFilter={onFilter}
                    reviews={reviews}
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
                    px: 1,
                    ...(column.minWidth && { minWidth: column.minWidth }),
                    ...(column.width && { width: column.width }),
                    ...(column.maxWidth && { maxWidth: column.maxWidth }),
                    ...(column.pl && {
                      paddingLeft: (theme) => theme.spacing(column.pl)
                    }),
                    pr: column.pr,
                    whiteSpace: 'nowrap'
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
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}></TableCell>
                ))}
              </TableRow>
            ) : reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <ReviewRow
                  key={review._id}
                  review={review}
                  index={page * rowsPerPage + idx + 1}
                  columns={columns}
                  handleOpenModal={handleOpenModal}
                  permissions={permissions}
                  filter={filter}
                />
              ))
            ) : (
              <TableNoneData
                col={columns.length}
                message='Không có dữ liệu đánh giá.'
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
        onPageChange={(event, newPage) => onPageChange(event, newPage + 1)}
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

export default ReviewTable
