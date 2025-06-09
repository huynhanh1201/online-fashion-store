// import React from 'react'
//
// import Table from '@mui/material/Table'
// import TableHead from '@mui/material/TableHead'
// import TableRow from '@mui/material/TableRow'
// import TableCell from '@mui/material/TableCell'
// import TableBody from '@mui/material/TableBody'
// import CircularProgress from '@mui/material/CircularProgress'
//
// import DiscountRow from './DiscountRow'
//
// import StyleAdmin, {
//   StyledTableCell,
//   StyledTableRow
// } from '~/assets/StyleAdmin.jsx'
//
// const DiscountTable = ({ discounts, loading, onAction }) => {
//   return (
//     <Table>
//       <TableHead>
//         <StyledTableRow>
//           <StyledTableCell sx={StyleAdmin.TableColumnSTT}>STT</StyledTableCell>
//           <StyledTableCell sx={{ minWidth: '100%' }}>Mã giảm</StyledTableCell>
//           <StyledTableCell sx={{ width: '100px' }}>Loại</StyledTableCell>
//           <StyledTableCell sx={{ width: '120px' }}>
//             Giá trị giảm
//           </StyledTableCell>
//           <StyledTableCell sx={{ width: '100px' }}>SL tối đa</StyledTableCell>
//           <StyledTableCell sx={{ width: '100px' }}>SL còn lại</StyledTableCell>
//           <StyledTableCell sx={{ width: '100px' }}>Trạng thái</StyledTableCell>
//           <StyledTableCell sx={{ width: '170px' }}>
//             Ngày bắt đầu
//           </StyledTableCell>
//           <StyledTableCell sx={{ width: '170px' }}>
//             Ngày kết thúc
//           </StyledTableCell>
//           <StyledTableCell sx={{ maxWidth: '130px', width: '130px' }}>
//             Hành động
//           </StyledTableCell>
//         </StyledTableRow>
//       </TableHead>
//       <TableBody>
//         {loading ? (
//           <StyledTableRow>
//             <StyledTableCell colSpan={10} align='center'>
//               Đang tải...
//             </StyledTableCell>
//           </StyledTableRow>
//         ) : discounts.length > 0 ? (
//           discounts.map((discount, index) => (
//             <DiscountRow
//               key={discount._id}
//               discount={discount}
//               index={index}
//               onAction={onAction}
//             />
//           ))
//         ) : (
//           <StyledTableRow>
//             <StyledTableCell colSpan={10} align='center'>
//               Không có mã giảm giá nào
//             </StyledTableCell>
//           </StyledTableRow>
//         )}
//       </TableBody>
//     </Table>
//   )
// }
//
// export default DiscountTable

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Paper,
  Box
} from '@mui/material'

import DiscountRow from './DiscountRow'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'

const DiscountTable = ({
  discounts,
  loading,
  page,
  rowsPerPage,
  onAction,
  addDiscount
}) => {
  const columns = [
    { id: 'index', label: 'STT', minWidth: 50, align: 'center' },
    { id: 'code', label: 'Mã giảm', minWidth: 150 },
    { id: 'type', label: 'Loại', minWidth: 100 },
    { id: 'amount', label: 'Giá trị giảm', minWidth: 120 },
    { id: 'minOrderValue', label: 'Giá tối thiểu', minWidth: 100 },
    { id: 'usageLimit', label: 'SL tối đa', minWidth: 100 },
    { id: 'remaining', label: 'SL còn lại', minWidth: 100 },
    { id: 'status', label: 'Trạng thái', minWidth: 150 },
    { id: 'validFrom', label: 'Ngày bắt đầu', minWidth: 180 },
    { id: 'validUntil', label: 'Ngày kết thúc', minWidth: 180 },
    { id: 'action', label: 'Hành động', minWidth: 130, align: 'center' }
  ]

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label='discount table'>
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
                    Danh sách mã giảm giá
                  </Typography>
                  <Button
                    variant='contained'
                    startIcon={<AddIcon />}
                    onClick={addDiscount}
                    sx={{ mb: 2, backgroundColor: '#001f5d' }}
                  >
                    Thêm mã giảm
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{ minWidth: column.minWidth }}
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
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : discounts.length > 0 ? (
              discounts.map((discount, idx) => (
                <DiscountRow
                  key={discount._id}
                  discount={discount}
                  index={idx + 1}
                  columns={columns}
                  onAction={onAction}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  Không có mã giảm giá nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component='div'
        count={discounts.length || 1}
        rowsPerPage={rowsPerPage || 10}
        page={page || 0}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`
        }
      />
    </Paper>
  )
}

export default DiscountTable
