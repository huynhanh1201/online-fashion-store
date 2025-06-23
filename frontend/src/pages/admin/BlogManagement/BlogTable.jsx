import React, { useState } from 'react'
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
  Chip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import DataObjectIcon from '@mui/icons-material/DataObject'
import BlogRow from './BlogRow'

const BlogTable = ({
  blogs,
  pagination,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onPageChange,
  onSearch,
  onFilter,
  onCreateSample
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

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

  const handleSearchChange = (event) => {
    const value = event.target.value
    setSearchTerm(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleStatusFilterChange = (event) => {
    const value = event.target.value
    setStatusFilter(value)
    if (onFilter) {
      onFilter({ status: value, category: categoryFilter })
    }
  }

  const handleCategoryFilterChange = (event) => {
    const value = event.target.value
    setCategoryFilter(value)
    if (onFilter) {
      onFilter({ status: statusFilter, category: value })
    }
  }

  const handlePageChange = (event, newPage) => {
    if (onPageChange) {
      onPageChange(newPage)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setCategoryFilter('')
    if (onSearch) onSearch('')
    if (onFilter) onFilter({})
  }

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
          {pagination && (
            <Typography variant="body2" color="text.secondary">
              Tổng cộng: {pagination.total} bài viết
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {(!blogs || blogs.length === 0) && (
            <Button
              startIcon={<DataObjectIcon />}
              variant='outlined'
              onClick={onCreateSample}
              sx={{
                textTransform: 'none',
                color: '#1976d2',
                borderColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#e3f2fd'
                }
              }}
            >
              Tạo dữ liệu mẫu
            </Button>
          )}
          <Button
            startIcon={<AddIcon />}
            variant='contained'
            onClick={onAdd}
            sx={{
              textTransform: 'none',
              backgroundColor: '#001f5d',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#001a4d'
              }
            }}
          >
            Thêm bài viết
          </Button>
        </Box>
      </Box>

      {/* Search và Filter */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="published">Đã xuất bản</MenuItem>
              <MenuItem value="draft">Bản nháp</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Chuyên mục</InputLabel>
            <Select
              value={categoryFilter}
              label="Chuyên mục"
              onChange={handleCategoryFilterChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="Trang phục">Trang phục</MenuItem>
              <MenuItem value="Phụ kiện">Phụ kiện</MenuItem>
              <MenuItem value="Giày dép">Giày dép</MenuItem>
              <MenuItem value="Túi xách">Túi xách</MenuItem>
            </Select>
          </FormControl>

          {(statusFilter || categoryFilter || searchTerm) && (
            <Button
              variant="outlined"
              size="small"
              onClick={clearFilters}
            >
              Xóa bộ lọc
            </Button>
          )}
        </Stack>
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
            {blogs && blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <BlogRow
                  key={blog._id}
                  index={(pagination?.page - 1) * (pagination?.limit || 10) + index + 1}
                  blog={blog}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align='center' sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    {searchTerm || statusFilter || categoryFilter
                      ? 'Không tìm thấy bài viết nào phù hợp với bộ lọc.'
                      : 'Chưa có bài viết nào. Hãy thêm bài viết đầu tiên hoặc tạo dữ liệu mẫu!'
                    }
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', borderTop: '1px solid #e0e0e0' }}>
          <Stack spacing={2} alignItems="center">
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
            <Typography variant="body2" color="text.secondary">
              Trang {pagination.page} / {pagination.totalPages}
              ({pagination.total} bài viết)
            </Typography>
          </Stack>
        </Box>
      )}
    </Paper>
  )
}

export default BlogTable