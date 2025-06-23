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
  Box
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import BlogRow from './BlogRow'

const BlogTable = ({ blogs, onAdd, onEdit, onDelete, onView }) => {
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
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
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
      </Box>
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
            {blogs && blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <BlogRow
                  key={blog._id}
                  index={index + 1}
                  blog={blog}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  Không có dữ liệu bài viết.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default BlogTable
