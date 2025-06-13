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
//   Box
// } from '@mui/material'
//
// import DiscountRow from './DiscountRow'
// import AddIcon from '@mui/icons-material/Add'
// import Button from '@mui/material/Button'
// import FilterDiscount from '~/components/FilterAdmin/FilterDiscount.jsx'
// const DiscountTable = ({
//   discounts,
//   loading,
//   page,
//   rowsPerPage,
//   onAction,
//   addDiscount,
//   fetchDiscounts,
//   total,
//   onFilter,
//   onPageChange,
//   onChangeRowsPerPage
// }) => {
//   const columns = [
//     { id: 'index', label: 'STT', minWidth: 50, align: 'center' },
//     { id: 'code', label: 'Mã giảm', minWidth: 150 },
//     { id: 'type', label: 'Loại', minWidth: 100 },
//     { id: 'amount', label: 'Giá trị giảm', minWidth: 120 },
//     { id: 'minOrderValue', label: 'Giá tối thiểu', minWidth: 100 },
//     { id: 'usageLimit', label: 'SL tối đa', minWidth: 100 },
//     { id: 'remaining', label: 'SL còn lại', minWidth: 100 },
//     { id: 'status', label: 'Trạng thái', minWidth: 150 },
//     { id: 'validFrom', label: 'Ngày bắt đầu', minWidth: 180 },
//     { id: 'validUntil', label: 'Ngày kết thúc', minWidth: 180 },
//     { id: 'action', label: 'Hành động', minWidth: 130, align: 'center' }
//   ]
//
//   return (
//     <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
//       <TableContainer>
//         <Table stickyHeader aria-label='discount table'>
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
//                       Danh Sách Mã Giảm Giá
//                     </Typography>
//                     <Button
//                       variant='contained'
//                       color='primary'
//                       onClick={addDiscount}
//                       startIcon={<AddIcon />}
//                       sx={{
//                         textTransform: 'none',
//                         width: 100,
//                         display: 'flex',
//                         alignItems: 'center'
//                       }}
//                     >
//                       Thêm
//                     </Button>
//                   </Box>
//                   <FilterDiscount
//                     fetchDiscounts={fetchDiscounts}
//                     onFilter={onFilter}
//                     discounts={discounts}
//                     loading={loading}
//                   />
//                 </Box>
//               </TableCell>
//             </TableRow>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableCell
//                   key={column.id}
//                   align={column.align || 'left'}
//                   sx={{ minWidth: column.minWidth }}
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
//             ) : discounts.length > 0 ? (
//               discounts.map((discount, idx) => (
//                 <DiscountRow
//                   key={discount._id}
//                   discount={discount}
//                   index={page * rowsPerPage + idx + 1}
//                   columns={columns}
//                   onAction={onAction}
//                 />
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} align='center'>
//                   Không có mã giảm giá nào
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
import FilterDiscount from '~/components/FilterAdmin/FilterDiscount'

const DiscountTable = ({
  discounts = [],
  loading = false,
  page = 0,
  rowsPerPage = 10,
  onAction,
  fetchDiscounts,
  total,
  onFilter
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
    { id: 'action', label: 'Hành động', minWidth: 150, align: 'start' }
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
                    alignItems: 'start'
                  }}
                >
                  <Typography variant='h6' sx={{ fontWeight: '800' }}>
                    Danh Sách Mã Giảm Giá
                  </Typography>
                  <FilterDiscount
                    fetchDiscounts={fetchDiscounts}
                    onFilter={onFilter}
                    discounts={discounts}
                    loading={loading}
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
                    ...(column.id === 'action' && {
                      width: '130px',
                      maxWidth: '130px',
                      paddingLeft: '20px'
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
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : discounts.length > 0 ? (
              discounts.map((discount, idx) => (
                <DiscountRow
                  key={discount._id}
                  discount={discount}
                  index={page * rowsPerPage + idx + 1}
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
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => onFilter({ page: newPage + 1 })}
        onRowsPerPageChange={(event) =>
          onFilter({ limit: parseInt(event.target.value, 10) })
        }
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`
        }
      />
    </Paper>
  )
}

export default DiscountTable
