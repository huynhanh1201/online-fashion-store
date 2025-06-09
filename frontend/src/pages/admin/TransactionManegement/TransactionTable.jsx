// import React from 'react'
//
// import Table from '@mui/material/Table'
// import TableBody from '@mui/material/TableBody'
// import TableCell from '@mui/material/TableCell'
// import TableHead from '@mui/material/TableHead'
// import TableRow from '@mui/material/TableRow'
// import CircularProgress from '@mui/material/CircularProgress'
//
// import TransactionRow from './TransactionRow'
// import StyleAdmin, {
//   StyledTableCell,
//   StyledTableRow,
//   StyledTableContainer
// } from '~/assets/StyleAdmin.jsx'
// import Paper from '@mui/material/Paper'
//
// const TransactionTable = ({
//   transactions,
//   loading,
//   onView,
//   onEdit,
//   onDelete
// }) => {
//   return (
//     <StyledTableContainer component={Paper}>
//       <table>
//         <TableHead>
//           <StyledTableRow>
//             <StyledTableCell sx={StyleAdmin.TableColumnSTT}>
//               STT
//             </StyledTableCell>
//             <StyledTableCell sx={{ width: '20%' }}>
//               Mã giao dịch
//             </StyledTableCell>
//             <StyledTableCell sx={{ width: '20%' }}>Đơn hàng</StyledTableCell>
//             <StyledTableCell>Phương thức</StyledTableCell>
//             <StyledTableCell>Trạng thái</StyledTableCell>
//             <StyledTableCell sx={{ width: '120px' }}>
//               Số tiền (VNĐ)
//             </StyledTableCell>
//             <StyledTableCell sx={{ width: '30%' }}>Ghi chú</StyledTableCell>
//             <StyledTableCell>Ngày tạo</StyledTableCell>
//             <StyledTableCell sx={{ maxWidth: '130px', width: '130px' }}>
//               Hành động
//             </StyledTableCell>
//           </StyledTableRow>
//         </TableHead>
//         <TableBody>
//           {loading ? (
//             <StyledTableRow>
//               <StyledTableCell colSpan={9} align='center'>
//                 đang tải dữ liệu ....
//               </StyledTableCell>
//             </StyledTableRow>
//           ) : transactions.filter((transaction) => !transaction.destroy)
//               .length > 0 ? (
//             transactions
//               .filter((transaction) => !transaction.destroy)
//               .map((transaction, index) => (
//                 <TransactionRow
//                   key={transaction._id}
//                   index={index}
//                   transaction={transaction}
//                   onView={onView}
//                   onEdit={onEdit}
//                   onDelete={onDelete}
//                 />
//               ))
//           ) : (
//             <StyledTableRow>
//               <StyledTableCell colSpan={9} align='center'>
//                 Không có giao dịch nào.
//               </StyledTableCell>
//             </StyledTableRow>
//           )}
//         </TableBody>
//       </table>
//     </StyledTableContainer>
//   )
// }
//
// export default TransactionTable
import React from 'react'
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableCell,
  TableRow,
  Typography,
  Paper
} from '@mui/material'

import TransactionRow from './TransactionRow'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const TransactionTable = ({
  transactions = [],
  loading,
  onView,
  onEdit,
  onDelete,
  page = 0,
  rowsPerPage = 10
}) => {
  const filteredTransactions = transactions.filter((t) => !t.destroy)
  const paginated = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell colSpan={9}>
              <Typography variant='h6' fontWeight={800}>
                Danh sách giao dịch
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={StyleAdmin.TableColumnSTT}>STT</TableCell>
            <TableCell sx={{ width: '20%' }}>Mã giao dịch</TableCell>
            <TableCell sx={{ width: '20%' }}>Đơn hàng</TableCell>
            <TableCell sx={{ width: 100 }}>Phương thức</TableCell>
            <TableCell sx={{ width: 100 }}>Trạng thái</TableCell>
            <TableCell sx={{ width: '200px' }}>Số tiền (VNĐ)</TableCell>
            <TableCell sx={{ width: 180 }}>Ngày tạo</TableCell>
            <TableCell
              sx={{
                width: '130px',
                maxWidth: '130px',
                textAlign: 'center'
              }}
            >
              Hành động
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} align='center'>
                Đang tải dữ liệu...
              </TableCell>
            </TableRow>
          ) : filteredTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align='center'>
                Không có giao dịch nào.
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((transaction, index) => (
              <TransactionRow
                key={transaction._id}
                index={page * rowsPerPage + index}
                transaction={transaction}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        component='div'
        rowsPerPageOptions={[5, 10, 25]}
        count={filteredTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} trên ${count}`
        }
      />
    </Paper>
  )
}

export default TransactionTable
