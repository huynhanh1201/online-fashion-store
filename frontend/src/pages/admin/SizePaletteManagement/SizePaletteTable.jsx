import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  TablePagination,
  Button,
  Paper
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import React from 'react'
import TableNoneData from '~/components/TableAdmin/NoneData'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions'
import SizePaletteRow from './SizePaletteRow'

const SizePaletteTable = ({
  sizePalettes = [],
  loading,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onChangeRowsPerPage,
  onEdit,
  onDelete,
  onView,
  addSize
}) => {
  const columns = [
    { id: 'index', label: 'STT', align: 'center', width: 50 },
    { id: 'productName', label: 'Tên sản phẩm', align: 'left', width: 200 },
    { id: 'name', label: 'Tên kích thước', align: 'left' },
    { id: 'isActive', label: 'Trạng thái', align: 'left', width: 150 },
    { id: 'action', label: 'Hành động', align: 'left', width: 130 }
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
                      Danh sách Kích thước Sản phẩm
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      variant='contained'
                      onClick={addSize}
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
                <TableCell colSpan={columns.length}>Đang tải...</TableCell>
              </TableRow>
            ) : sizePalettes.length === 0 ? (
              <TableNoneData
                col={columns.length}
                message='Không có kích thước nào'
              />
            ) : (
              sizePalettes.map((size, index) => (
                <SizePaletteRow
                  key={size._id || index}
                  index={page * rowsPerPage + index + 1}
                  size={size}
                  columns={columns}
                  onEdit={() => onEdit(size)}
                  onDelete={() => onDelete(size)}
                  onView={() => onView(size)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        rowsPerPageOptions={[10, 25, 100]}
        count={total || 1}
        rowsPerPage={rowsPerPage || 10}
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

export default SizePaletteTable
