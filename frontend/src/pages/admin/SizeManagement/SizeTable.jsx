// import React from 'react'
// import Table from '@mui/material/Table'
// import TableBody from '@mui/material/TableBody'
// import TableHead from '@mui/material/TableHead'
//
// import StyleAdmin, {
//   StyledTableCell,
//   StyledTableRow
// } from '~/assets/StyleAdmin.jsx'
//
// import SizeRow from './SizeRow'
//
// const SizeTable = ({ sizes, loading, handleOpenModal }) => {
//   const filteredSizes = sizes.filter((s) => !s.destroy)
//
//   return (
//     <Table>
//       <TableHead>
//         <StyledTableRow>
//           <StyledTableCell sx={StyleAdmin.TableColumnSTT}>STT</StyledTableCell>
//           <StyledTableCell sx={{ width: '50%' }}>
//             Tên kích thước
//           </StyledTableCell>
//           <StyledTableCell sx={{ width: '20%' }}>Ngày tạo</StyledTableCell>
//           <StyledTableCell sx={{ width: '20%' }}>Ngày cập nhật</StyledTableCell>
//           <StyledTableCell sx={{ width: '130px', maxWidth: '130px' }}>
//             Hành động
//           </StyledTableCell>
//         </StyledTableRow>
//       </TableHead>
//       <TableBody>
//         {loading ? (
//           <StyledTableRow>
//             <StyledTableCell colSpan={5} align='center'>
//               Đang tải kích thước...
//             </StyledTableCell>
//           </StyledTableRow>
//         ) : filteredSizes.length === 0 ? (
//           <StyledTableRow>
//             <StyledTableCell colSpan={5} align='center'>
//               Không có kích thước nào.
//             </StyledTableCell>
//           </StyledTableRow>
//         ) : (
//           filteredSizes.map((size, idx) => (
//             <SizeRow
//               key={size._id}
//               size={size}
//               idx={idx}
//               handleOpenModal={handleOpenModal}
//             />
//           ))
//         )}
//       </TableBody>
//     </Table>
//   )
// }
//
// export default SizeTable

import React from 'react'
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material'
import SizeRow from './SizeRow'
import AddIcon from '@mui/icons-material/Add'
import FilterSize from '~/components/FilterAdmin/FilterSize.jsx'

const SizeTable = ({
  sizes = [],
  loading = false,
  page = 0,
  rowsPerPage = 10,
  handleOpenModal,
  addSize,
  onChangeRowsPerPage,
  total,
  onPageChange,
  onFilters,
  fetchSizes
}) => {
  const filteredSizes = sizes.filter((s) => !s.destroy)

  const columns = [
    { id: 'index', label: 'STT', minWidth: 50, align: 'center' },
    { id: 'name', label: 'Tên kích thước', minWidth: 200 },
    { id: 'createdAt', label: 'Ngày tạo', minWidth: 150 },
    { id: 'updatedAt', label: 'Ngày cập nhật', minWidth: 150 },
    { id: 'action', label: 'Hành động', minWidth: 130, align: 'start' }
  ]

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label='sizes table'>
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
                      Danh Sách Kích Thước
                    </Typography>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={addSize}
                      startIcon={<AddIcon />}
                      sx={{
                        textTransform: 'none',
                        width: 100,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      Thêm
                    </Button>
                  </Box>
                  <FilterSize
                    onFilter={onFilters}
                    sizes={sizes}
                    loading={loading}
                    fetchSizes={fetchSizes}
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
                    ...(column.id === 'index' && { width: '50px' }),
                    ...(column.id === 'action' && {
                      width: '130px',
                      maxWidth: '130px',
                      paddingLeft: '6px'
                    }),
                    ...(column.id === 'name' && { width: '70%' })
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
                  Đang tải kích thước...
                </TableCell>
              </TableRow>
            ) : filteredSizes.length > 0 ? (
              filteredSizes.map((size, idx) => (
                <SizeRow
                  key={size._id}
                  size={size}
                  idx={page * rowsPerPage + idx + 1}
                  columns={columns}
                  handleOpenModal={handleOpenModal}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  Không có kích thước nào.
                </TableCell>
              </TableRow>
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
        onPageChange={(event, newPage) => onPageChange(event, newPage + 1)} // +1 để đúng logic bên cha
        onRowsPerPageChange={(event) => {
          const newLimit = parseInt(event.target.value, 10)
          if (onChangeRowsPerPage) {
            onChangeRowsPerPage(newLimit)
          }
        }}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`
        }
      />
    </Paper>
  )
}

export default SizeTable
