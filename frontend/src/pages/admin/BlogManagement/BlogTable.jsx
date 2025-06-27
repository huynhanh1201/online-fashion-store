import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Stack,
  Chip,
  TablePagination
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
import BlogRow from './BlogRow'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import FilterBlog from '~/components/FilterAdmin/FilterBlog.jsx'
import CircularProgress from '@mui/material/CircularProgress'
const BlogTable = ({
  blogs,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onPageChange,
  onChangeRowsPerPage,
  page,
  rowsPerPage,
  total,
  onFilter,
  loading
}) => {
  const columns = [
    { id: 'index', label: 'STT', align: 'center', width: 50 },
    { id: 'coverImage', label: 'Ảnh bìa', align: 'left', width: 100 },
    { id: 'title', label: 'Tiêu đề', align: 'left' },
    { id: 'category', label: 'Chuyên mục', align: 'left' },
    { id: 'author', label: 'Tác giả', align: 'left' },
    { id: 'status', label: 'Trạng thái', align: 'left', width: 200 },
    { id: 'publishedAt', label: 'Ngày xuất bản', align: 'left', width: 150 },
    { id: 'action', label: 'Hành động', align: 'left' }
  ]

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      {/* Header với title và buttons */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0'
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
          <Typography variant='h6' fontWeight={800}>
            Danh sách bài viết
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant='contained'
            onClick={onAdd}
            sx={{
              textTransform: 'none',
              width: 100,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#001f5d',
              color: '#fff'
            }}
          >
            Thêm
          </Button>
        </Box>
        <FilterBlog blogs={blogs} onFilter={onFilter} loading={loading} />
      </Box>
      {/* Table */}
      <TableContainer>
        <Table stickyHeader aria-label='blogs table'>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{
                    minWidth: column.minWidth,
                    px: 1,
                    width: column.width,
                    ...(column.id === 'index' && { width: '50px' }),
                    ...(column.id === 'action' && {
                      width: '130px',
                      maxWidth: '130px',
                      px: 2
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
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : blogs && blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <BlogRow
                  key={blog._id}
                  index={page * rowsPerPage + index + 1}
                  blog={blog}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))
            ) : (
              <TableNoneData
                col={columns.length}
                message='Không có dữ liệu bài viết.'
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
        onPageChange={(event, newPage) => onPageChange(event, newPage + 1)} // truyền lại đúng logic cho parent
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

export default BlogTable
