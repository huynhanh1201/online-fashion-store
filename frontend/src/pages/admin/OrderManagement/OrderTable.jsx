// import React from 'react'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Typography,
//   Paper,
//   Box,
//   Button
// } from '@mui/material'
//
// import OrderRow from './OrderRow'
// import AddIcon from '@mui/icons-material/Add'
// import FilterOrder from '~/components/FilterAdmin/FilterOrder.jsx'
//
// const OrderTable = ({
//   orders = [],
//   loading = false,
//   page = 0,
//   rowsPerPage = 10,
//   onView,
//   onEdit,
//   onDelete,
//   fetchOrders,
//   total,
//   onPageChange,
//   onChangeRowsPerPage,
//   onFilter,
//   coupons,
//   users
// }) => {
//   const columns = [
//     { id: 'index.jsx', label: 'STT', minWidth: 50, align: 'center' },
//     { id: '_id', label: 'Mã đơn hàng', minWidth: 150 },
//     { id: 'customerName', label: 'Tên khách hàng', minWidth: 200 },
//     { id: 'status', label: 'Trạng thái đơn hàng', minWidth: 170 },
//     {
//       id: 'paymentStatus',
//       label: 'Trạng thái thanh toán',
//       minWidth: 170,
//       paddingLeft: 6
//     },
//     {
//       id: 'createdAt',
//       label: 'Ngày đặt hàng',
//       minWidth: 180
//     },
//     { id: 'action', label: 'Hành động', minWidth: 130, align: 'start' }
//   ]
//
//   return (
//     <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
//       <TableContainer>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell colSpan={columns.length}>
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
//                       Danh Sách Đơn Hàng
//                     </Typography>
//                   </Box>
//                   <FilterOrder
//                     onFilter={onFilter}
//                     fetchOrders={fetchOrders}
//                     loading={loading}
//                     coupons={coupons}
//                     users={users}
//                   />
//                 </Box>
//               </TableCell>
//             </TableRow>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableCell
//                   key={column.id}
//                   align={column.align || 'left'}
//                   sx={{
//                     minWidth: column.minWidth,
//                     ...(column.id === 'action' && { paddingLeft: '20px' })
//                   }}
//                 >
//                   {column.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={columns.length} align='center'>
//                   Đang tải...
//                 </TableCell>
//               </TableRow>
//             ) : orders.length > 0 ? (
//               orders.map((order, index.jsx) => (
//                 <OrderRow
//                   key={order._id}
//                   order={order}
//                   index.jsx={page * rowsPerPage + index.jsx + 1}
//                   columns={columns}
//                   onView={onView}
//                   onEdit={onEdit}
//                   onDelete={onDelete}
//                 />
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} align='center'>
//                   Không có đơn hàng nào.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
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
// export default OrderTable

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
  Box
} from '@mui/material'

import OrderRow from './OrderRow'
import FilterOrder from '~/components/FilterAdmin/FilterOrder.jsx'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
const OrderTable = ({
  orders = [],
  loading = false,
  page = 0,
  rowsPerPage = 10,
  onView,
  onEdit,
  onDelete,
  fetchOrders,
  total,
  onPageChange,
  onChangeRowsPerPage,
  onFilter,
  coupons,
  users
}) => {
  const columns = [
    { id: 'index', label: 'STT', minWidth: 50, align: 'center' },
    { id: '_id', label: 'Mã đơn hàng', minWidth: 150 },
    { id: 'customerName', label: 'Tên khách hàng', minWidth: 200 },
    { id: 'paymentMethod', label: 'Phương thức thanh toán', minWidth: 160 },
    { id: 'paymentStatus', label: 'Thanh toán', minWidth: 130 },
    { id: 'status', label: 'Trạng thái đơn hàng', minWidth: 170 },

    { id: 'createdAt', label: 'Ngày đặt hàng', minWidth: 160 },
    { id: 'action', label: 'Hành động', minWidth: 130, align: 'start' }
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
                    alignItems: 'start',
                    minHeight: 76.5
                  }}
                >
                  <Box>
                    <Typography
                      variant='h6'
                      sx={{
                        fontWeight: '800',
                        minWidth: 250
                      }}
                    >
                      Danh Sách Đơn Hàng
                    </Typography>
                  </Box>
                  <FilterOrder
                    onFilter={onFilter}
                    fetchOrders={fetchOrders}
                    loading={loading}
                    coupons={coupons}
                    users={users}
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
                    minWidth: column.minWidth,
                    px: 1,
                    ...(column.id === 'index' && {
                      width: '50px',
                      maxWidth: '50px'
                    }),
                    ...(column.id === 'action' && {
                      width: '130px',
                      maxWidth: '130px',
                      paddingLeft: '10px'
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
                <TableCell colSpan={columns.length} align='center'>
                  Đang tải đơn hàng...
                </TableCell>
              </TableRow>
            ) : orders.length > 0 ? (
              orders.map((order, index) => (
                <OrderRow
                  key={order._id || index}
                  order={order}
                  index={page * rowsPerPage + index + 1}
                  columns={columns}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <TableNoneData
                col={columns.length}
                message='Không có dữ liệu đơn hàng.'
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{ background: '#fff' }}
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

export default OrderTable
