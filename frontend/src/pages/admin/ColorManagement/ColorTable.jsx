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
// import ColorRow from './ColorRow'
//
// const ColorTable = ({ colors, loading, handleOpenModal }) => {
//   const filteredColors = colors.filter((c) => !c.destroy)
//
//   return (
//     <Table>
//       <TableHead>
//         <StyledTableRow>
//           <StyledTableCell sx={StyleAdmin.TableColumnSTT}>STT</StyledTableCell>
//           <StyledTableCell sx={{ width: '50%' }}>Tên màu</StyledTableCell>
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
//               Đang tải màu sắc...
//             </StyledTableCell>
//           </StyledTableRow>
//         ) : filteredColors.length === 0 ? (
//           <StyledTableRow>
//             <StyledTableCell colSpan={5} align='center'>
//               Không có màu sắc nào.
//             </StyledTableCell>
//           </StyledTableRow>
//         ) : (
//           filteredColors.map((color, idx) => (
//             <ColorRow
//               key={color._id}
//               color={color}
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
// export default ColorTable

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
const styles = {
  buttonAdd: {
    backgroundColor: '#001f5d',
    color: '#fff',
    marginBottom: '16px'
  }
}
const ColorTable = ({
  colors,
  loading,
  page,
  rowsPerPage,
  handleOpenModal,
  addColor
}) => {
  const filteredColors = colors.filter((c) => !c.destroy)

  const columns = [
    { id: 'index', label: 'STT', minWidth: 50, align: 'center' },
    { id: 'name', label: 'Tên màu', minWidth: 200 },
    { id: 'createdAt', label: 'Ngày tạo', minWidth: 150 },
    { id: 'updatedAt', label: 'Ngày cập nhật', minWidth: 150 },
    { id: 'action', label: 'Hành động', minWidth: 130, align: 'center' }
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
                    alignItems: 'center'
                  }}
                >
                  <Typography variant='h6' sx={{ fontWeight: '800' }}>
                    Danh sách màu sắc
                  </Typography>
                  <Button
                    variant='contained'
                    sx={styles.buttonAdd}
                    startIcon={<AddIcon />}
                    onClick={addColor}
                  >
                    Thêm màu
                  </Button>
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
                      maxWidth: '130px'
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
                  Đang tải màu sắc...
                </TableCell>
              </TableRow>
            ) : filteredColors.length > 0 ? (
              filteredColors.map((color, idx) => (
                <ColorRow
                  key={color._id}
                  color={color}
                  index={idx + 1}
                  columns={columns}
                  handleOpenModal={handleOpenModal}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  Không có màu sắc nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={colors.length || 1}
        rowsPerPage={rowsPerPage || 10}
        page={page || 0}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) => {
          const actualTo = to > count ? count : to
          const actualFrom = from > count ? count : from
          return `${actualFrom}–${actualTo} trên ${count !== -1 ? count : `hơn ${actualTo}`}`
        }}
      />
    </Paper>
  )
}

export default ColorTable
