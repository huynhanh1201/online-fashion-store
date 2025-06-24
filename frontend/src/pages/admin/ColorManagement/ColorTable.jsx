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
import ColorRow from './ColorRow'
import AddIcon from '@mui/icons-material/Add'
import FilterColor from '~/components/FilterAdmin/FilterColor.jsx'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
const ColorTable = ({
  colors,
  loading,
  page,
  rowsPerPage,
  handleOpenModal,
  addColor,
  onFilters,
  fetchColors,
  onPageChange,
  onChangeRowsPerPage,
  total,
  permissions = {}
}) => {
  const columns = [
    { id: 'index', label: 'STT', align: 'center', width: 50 },
    { id: 'name', label: 'Tên màu', align: 'left', minWidth: 200 },
    { id: 'createdAt', label: 'Ngày tạo', align: 'left', minWidth: 200 },
    { id: 'updatedAt', label: 'Ngày cập nhật', align: 'left', minWidth: 200 },
    {
      id: 'destroy',
      label: 'Trạng thái màu sắc',
      align: 'left',
      minWidth: 150
    },
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
        <Table stickyHeader aria-label='colors table'>
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
                      Danh sách màu sắc
                    </Typography>
                    {permissions.canCreate && (
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={addColor}
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
                  </Box>
                  <FilterColor
                    onFilter={onFilters}
                    colors={colors}
                    loading={loading}
                    fetchColors={fetchColors}
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
            ) : colors.length > 0 ? (
              colors.map((color, idx) => (
                <ColorRow
                  key={color._id}
                  color={color}
                  index={page * rowsPerPage + idx + 1}
                  columns={columns}
                  handleOpenModal={handleOpenModal}
                  permissions={permissions}
                />
              ))
            ) : (
              <TableNoneData
                col={columns.length}
                message='Không có dữ liệu màu sắc.'
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

export default ColorTable
