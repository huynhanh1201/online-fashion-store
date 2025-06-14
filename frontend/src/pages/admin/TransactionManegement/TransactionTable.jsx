// import React from 'react'
// import {
//   Table,
//   TableBody,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableCell,
//   TableRow,
//   Typography,
//   Paper,
//   Box
// } from '@mui/material'
//
// import TransactionRow from './TransactionRow'
// import StyleAdmin from '~/assets/StyleAdmin.jsx'
// import FilterTransaction from '~/components/FilterAdmin/FilterTransaction.jsx'
// const TransactionTable = ({
//   transactions = [],
//   loading,
//   onView,
//   onEdit,
//   onDelete,
//   page = 0,
//   rowsPerPage = 10,
//   onFilter,
//   onPageChange,
//   onChangeRowsPerPage,
//   total,
//   fetchTransactions
// }) => {
//   return (
//     <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
//       <Table stickyHeader>
//         <TableHead>
//           <TableRow>
//             <TableCell colSpan={9}>
//               <Typography variant='h6' fontWeight={800}>
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'start'
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       flexDirection: 'column',
//                       gap: 1,
//                       minWidth: 250
//                     }}
//                   >
//                     <Typography variant='h6' sx={{ fontWeight: '800' }}>
//                       Danh Sách Giao Dịch
//                     </Typography>
//                   </Box>
//                   <FilterTransaction
//                     onFilter={onFilter}
//                     transactions={transactions}
//                     loading={loading}
//                     fetchTransactions={fetchTransactions}
//                   />
//                 </Box>
//               </Typography>
//             </TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell sx={StyleAdmin.TableColumnSTT}>STT</TableCell>
//             <TableCell sx={{ width: '20%' }}>Mã đơn hàng</TableCell>
//             <TableCell sx={{ width: '20%' }}>Mã giao dịch</TableCell>
//             <TableCell sx={{ width: 100 }}>Phương thức</TableCell>
//             <TableCell sx={{ width: 100 }}>Trạng thái</TableCell>
//             <TableCell sx={{ width: '200px' }}>Số tiền</TableCell>
//             <TableCell sx={{ width: 180 }}>Ngày tạo</TableCell>
//             <TableCell
//               sx={{
//                 width: '130px',
//                 maxWidth: '130px',
//                 textAlign: 'center'
//               }}
//             >
//               Hành động
//             </TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {loading ? (
//             <TableRow>
//               <TableCell colSpan={9} align='center'>
//                 Đang tải dữ liệu...
//               </TableCell>
//             </TableRow>
//           ) : transactions.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={9} align='center'>
//                 Không có giao dịch nào.
//               </TableCell>
//             </TableRow>
//           ) : (
//             transactions.map((transaction, index.jsx) => (
//               <TransactionRow
//                 key={transaction._id}
//                 index.jsx={page * rowsPerPage + index.jsx + 1} // +1 để hiển thị đúng STT
//                 transaction={transaction}
//                 onView={onView}
//                 onEdit={onEdit}
//                 onDelete={onDelete}
//               />
//             ))
//           )}
//         </TableBody>
//       </Table>
//
//       <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component='div'
//         count={total || 0}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={(event, newPage) => onPageChange(event, newPage + 1)} // +1 để đúng logic bên cha
//         onRowsPerPageChange={(event) => {
//           const newLimit = parseInt(event.target.value, 10)
//           if (onChangeRowsPerPage) {
//             onChangeRowsPerPage(newLimit)
//           }
//         }}
//         labelRowsPerPage='Số dòng mỗi trang'
//         labelDisplayedRows={({ from, to, count }) =>
//           `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`
//         }
//       />
//     </Paper>
//   )
// }
//
// export default TransactionTable

import React from 'react'
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TablePagination
} from '@mui/material'

import TransactionRow from './TransactionRow'
import FilterTransaction from '~/components/FilterAdmin/FilterTransaction'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const TransactionTable = ({
  transactions = [],
  loading,
  onView,
  onEdit,
  onDelete,
  page = 0,
  rowsPerPage = 10,
  total = 0,
  onPageChange,
  onChangeRowsPerPage,
  onFilter,
  fetchTransactions
}) => {
  return (
    <Paper sx={{ border: '1px solid #ccc' }}>
      <Box
        p={2}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <Typography variant='h6' fontWeight={800}>
          Danh sách giao dịch
        </Typography>
        <FilterTransaction
          onFilter={onFilter}
          transactions={transactions}
          loading={loading}
          fetchTransactions={fetchTransactions}
        />
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={StyleAdmin.TableColumnSTT}>STT</TableCell>
            <TableCell>Mã đơn hàng</TableCell>
            <TableCell>Mã giao dịch</TableCell>
            <TableCell>Phương thức</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Số tiền</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell align='start' sx={{ width: 150 }}>
              Hành động
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} align='center'>
                Đang tải dữ liệu...
              </TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align='center'>
                Không có giao dịch nào.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction, index) => (
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
      />
    </Paper>
  )
}

export default TransactionTable
