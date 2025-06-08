// import React from 'react'
// import Table from '@mui/material/Table'
// import TableBody from '@mui/material/TableBody'
// import TableHead from '@mui/material/TableHead'
// import Paper from '@mui/material/Paper'
// import CircularProgress from '@mui/material/CircularProgress'
// import Typography from '@mui/material/Typography'
//
// import OrderRow from './OrderRow'
//
// import StyleAdmin, {
//   StyledTableCell,
//   StyledTableRow,
//   StyledTableContainer
// } from '~/assets/StyleAdmin.jsx'
//
// const OrderTable = ({
//   orders = [],
//   loading = false,
//   onView,
//   onEdit,
//   onDelete
// }) => {
//   const columnsCount = 9
//
//   return (
//     <StyledTableContainer component={Paper} sx={{ maxHeight: 600 }}>
//       <Table stickyHeader>
//         <TableHead>
//           <StyledTableRow>
//             <StyledTableCell sx={StyleAdmin.TableColumnSTT}>
//               STT
//             </StyledTableCell>
//             <StyledTableCell sx={{ width: '30%' }}>Mã đơn hàng</StyledTableCell>
//             <StyledTableCell sx={{ width: '20%' }}>
//               Tên khách hàng
//             </StyledTableCell>
//             <StyledTableCell sx={{ width: '170px' }}>
//               Trạng thái đơn hàng
//             </StyledTableCell>
//             <StyledTableCell sx={{ width: '170px' }}>
//               Trạng thái thanh toán
//             </StyledTableCell>
//             <StyledTableCell sx={{ width: '170px' }}>
//               Ngày đặt hàng
//             </StyledTableCell>
//             <StyledTableCell sx={{ maxWidth: '130px', width: '130px' }}>
//               Hành động
//             </StyledTableCell>
//           </StyledTableRow>
//         </TableHead>
//         <TableBody>
//           {loading ? (
//             <StyledTableRow>
//               <StyledTableCell colSpan={columnsCount} align='center'>
//                 <CircularProgress />
//               </StyledTableCell>
//             </StyledTableRow>
//           ) : orders.length === 0 ? (
//             <StyledTableRow>
//               <StyledTableCell colSpan={columnsCount} align='center'>
//                 <Typography>Không có đơn hàng nào.</Typography>
//               </StyledTableCell>
//             </StyledTableRow>
//           ) : (
//             orders.map((order, index) => (
//               <OrderRow
//                 key={order._id}
//                 order={order}
//                 onView={onView}
//                 onEdit={onEdit}
//                 onDelete={onDelete}
//                 index={index}
//               />
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </StyledTableContainer>
//   )
// }
//
// export default OrderTable

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

import OrderRow from './OrderRow'

const OrderTable = ({
  orders = [],
  loading = false,
  page = 0,
  rowsPerPage = 10,
  onView,
  onEdit,
  onDelete
}) => {
  const columns = [
    { id: 'index', label: 'STT', minWidth: 50, align: 'center' },
    { id: '_id', label: 'Mã đơn hàng', minWidth: 150 },
    { id: 'customerName', label: 'Tên khách hàng', minWidth: 200 },
    { id: 'status', label: 'Trạng thái đơn hàng', minWidth: 170 },
    { id: 'paymentStatus', label: 'Trạng thái thanh toán', minWidth: 170 },
    { id: 'createdAt', label: 'Ngày đặt hàng', minWidth: 180 },
    { id: 'action', label: 'Hành động', minWidth: 130, align: 'center' }
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
                  <Typography variant='h6' sx={{ fontWeight: '800' }}>
                    Danh sách đơn hàng
                  </Typography>
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
            ) : orders.length > 0 ? (
              orders.map((order, index) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  index={index + 1}
                  columns={columns}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  Không có đơn hàng nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component='div'
        count={orders.length || 1}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`
        }
      />
    </Paper>
  )
}

export default OrderTable
