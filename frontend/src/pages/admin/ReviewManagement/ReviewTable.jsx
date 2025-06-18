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
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions'
import TableNoneData from '~/components/TableAdmin/NoneData'
import FilterReview from '~/components/FilterAdmin/FilterReview'
import ReviewRow from './ReviewRow'
import VisibilityIcon from '@mui/icons-material/Visibility'

const ReviewTable = ({
  reviews,
  page,
  rowsPerPage,
  loading,
  handleOpenModal,
  onFilter,
  fetchReviews,
  total,
  onPageChange,
  onChangeRowsPerPage
}) => {
  const columns = [
    { id: 'index', label: 'STT', align: 'center', width: 50 },
    { id: 'productId', label: 'Sản phẩm', align: 'left', minWidth: 150 },
    { id: 'user', label: 'Người đánh giá', align: 'left', minWidth: 180 },
    { id: 'rating', label: 'Số sao', align: 'center', width: 80 },
    { id: 'comment', label: 'Bình luận', align: 'left', minWidth: 250 },
    { id: 'status', label: 'Trạng thái', align: 'center', minWidth: 120 },
    { id: 'createdAt', label: 'Ngày tạo', align: 'start', minWidth: 100 },
    { id: 'action', label: 'Hành động', align: 'center', width: 150 }
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
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <Typography variant='h6' fontWeight={800}>
                      Danh sách đánh giá sản phẩm
                    </Typography>
                    <Button
                      startIcon={<VisibilityIcon />}
                      sx={{
                        width: 120,
                        textTransform: 'none',
                        backgroundColor: '#001f5d',
                        color: '#fff'
                      }}
                      onClick={() => fetchReviews()}
                    >
                      Làm mới
                    </Button>
                  </Box>

                  <FilterReview
                    onFilter={onFilter}
                    reviews={reviews}
                    users={reviews.map((r) => r.user)}
                    fetchReviews={fetchReviews}
                    loading={loading}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{
                    minWidth: column.minWidth,
                    width: column.width,
                    maxWidth: column.maxWidth,
                    px: 1
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
                  key={review.id}
                  review={review}
                  index={page * rowsPerPage + idx + 1}
                  columns={columns}
                  handleOpenModal={handleOpenModal}
                />
              ))
            ) : (
              <TableNoneData
                col={columns.length}
                message='Không có đánh giá nào phù hợp.'
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
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
          const totalPages = Math.ceil(count / rowsPerPage)
          return `${from}–${to} trên ${count} | Trang ${page + 1} / ${totalPages}`
        }}
        ActionsComponent={TablePaginationActions}
      />
    </Paper>
  )
}

export default ReviewTable
