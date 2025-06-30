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
  Button,
  Tooltip
} from '@mui/material'
import CategoryRow from './CategoryRow'
import AddIcon from '@mui/icons-material/Add'
import FilterCategory from '~/components/FilterAdmin/FilterCategory.jsx'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import usePermissions from '~/hooks/usePermissions'

const CategoryTable = ({
  categories,
  page,
  rowsPerPage,
  loading,
  handleOpenModal,
  addCategory,
  onFilter,
  fetchCategories,
  total,
  onPageChange,
  onChangeRowsPerPage,

  initialSearch,
  filters
}) => {
  const columns = [
    { id: 'index', label: 'STT', align: 'center', width: 50 },
    { id: 'image', label: 'Hình ảnh', align: 'start', minWidth: 100 },
    { id: 'name', label: 'Tên danh mục', align: 'left', minWidth: 200 },
    {
      id: 'description',
      label: 'Mô tả danh mục',
      align: 'left',
      minWidth: 280
    },

    { id: 'createdAt', label: 'Ngày tạo', align: 'start', minWidth: 150 },
    { id: 'updatedAt', label: 'Ngày cập nhật', align: 'start', minWidth: 150 },
    { id: 'more', label: 'Xem các sản phẩm', align: 'start', minWidth: 150 },
    // {
    //   id: 'destroy',
    //   label: 'Trạng thái danh mục',
    //   align: 'center',
    //   minWidth: 170
    // },
    {
      id: 'action',
      label: 'Hành động',
      align: 'start',
      width: 150,
      maxWidth: 150
    }
  ]
  const { hasPermission } = usePermissions()

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label='categories table'>
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
                      Danh Sách Danh Mục
                    </Typography>

                    <Stack direction='row' spacing={1}>
                      {hasPermission('category:create') && (
                        <Button
                          onClick={addCategory}
                          startIcon={<AddIcon />}
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
                      )}
                    </Stack>
                  </Box>

                  <FilterCategory
                    onFilter={onFilter}
                    categories={categories}
                    fetchCategories={fetchCategories}
                    loading={loading}
                    initialSearch={initialSearch}
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
                    px: 1,
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
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}></TableCell>
                ))}
              </TableRow>
            ) : categories.length > 0 ? (
              categories.map((category, idx) => (
                <CategoryRow
                  key={category._id}
                  category={category}
                  index={page * rowsPerPage + idx + 1}
                  columns={columns}
                  handleOpenModal={handleOpenModal}
                  filters={filters}
                />
              ))
            ) : (
              <TableNoneData
                col={columns.length}
                message='Không có dữ liệu danh mục sản phẩm.'
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

export default CategoryTable
