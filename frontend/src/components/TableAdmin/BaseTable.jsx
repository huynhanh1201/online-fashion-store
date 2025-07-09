import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions'
import TableNoneData from '~/components/TableAdmin/NoneData'

export default function BaseTable({
  title = 'Danh sách',
  columns = [],
  data = [],
  page,
  rowsPerPage,
  total = 0,
  loading = false,
  onPageChange,
  onChangeRowsPerPage,
  rowComponent: RowComponent,
  handleOpenModal,
  onAdd,
  filterComponent: FilterComponent,
  filterProps = {}
}) {
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
                    <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                      {title}
                    </Typography>
                    {onAdd && (
                      <Button
                        onClick={onAdd}
                        startIcon={<AddIcon />}
                        sx={{
                          textTransform: 'none',
                          width: 100,
                          backgroundColor: '#001f5d',
                          color: '#fff'
                        }}
                      >
                        Thêm
                      </Button>
                    )}
                  </Box>
                  {FilterComponent && <FilterComponent {...filterProps} />}
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
                    ...(column.width && {
                      width: column.width,
                      maxWidth: column.width
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
            ) : data.length > 0 ? (
              data.map((item, idx) => (
                <RowComponent
                  key={item._id || idx}
                  item={item}
                  index={page * rowsPerPage + idx + 1}
                  columns={columns}
                  handleOpenModal={handleOpenModal}
                />
              ))
            ) : (
              <TableNoneData col={columns.length} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => onPageChange(event, newPage + 1)}
        onRowsPerPageChange={(event) => {
          const newLimit = parseInt(event.target.value, 10)
          onChangeRowsPerPage?.(newLimit)
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
