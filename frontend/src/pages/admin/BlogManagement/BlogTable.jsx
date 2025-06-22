// BlogTable.jsx
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
  Box,
  Button,
  TablePagination
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import BlogRow from './BlogRow.jsx'
import TableNoneData from '~/components/TableAdmin/NoneData'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions'

const BlogTable = ({
  blogs = [],
  loading,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onChangeRowsPerPage,
  onEdit,
  onDelete,
  onView,
  addPost
}) => {
  const columns = [
    { id: 'index', label: 'STT', align: 'center', width: 50 },
    { id: 'image', label: 'Ảnh', align: 'left', width: 100 },
    { id: 'title', label: 'Tiêu đề', align: 'left' },
    { id: 'content', label: 'Nội dung', align: 'left' },
    { id: 'createdAt', label: 'Ngày tạo', align: 'left', width: 160 },
    { id: 'updatedAt', label: 'Ngày cập nhật', align: 'left', width: 160 },
    { id: 'isActive', label: 'Trạng thái', align: 'center', width: 120 },
    { id: 'action', label: 'Hành động', align: 'center', width: 130 }
  ]

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='h6' fontWeight={800}>
                    Danh sách bài viết
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    variant='contained'
                    onClick={addPost}
                    sx={{ backgroundColor: '#001f5d', textTransform: 'none' }}
                  >
                    Thêm
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{ width: column.width, px: 1 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length}>Đang tải...</TableCell>
              </TableRow>
            ) : blogs.length === 0 ? (
              <TableNoneData
                col={columns.length}
                message='Không có bài viết nào'
              />
            ) : (
              blogs.map((post, index) => (
                <BlogRow
                  key={post._id || index}
                  index={page * rowsPerPage + index + 1}
                  post={post}
                  onEdit={() => onEdit(post)}
                  onDelete={() => onDelete(post)}
                  onView={() => onView(post)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        rowsPerPageOptions={[10, 25, 50]}
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={(e) => {
          const newLimit = parseInt(e.target.value, 10)
          if (onChangeRowsPerPage) onChangeRowsPerPage(newLimit)
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
