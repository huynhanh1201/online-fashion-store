// import React from 'react'
// import { TableRow, TableCell, IconButton, Stack, Chip } from '@mui/material'
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
// import BorderColorIcon from '@mui/icons-material/BorderColor'
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
// import dayjs from 'dayjs'
// const styles = {
//   groupIcon: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 1
//   }
// }
// const OrderRow = ({ order, index, columns, onView, onEdit, onDelete }) => {
//   const formatDate = (date) => (date ? dayjs(date).format('DD/MM/YYYY') : '—')
//
//   return (
//     <TableRow hover>
//       {columns.map((col) => {
//         const { id, align } = col
//         let value = '—'
//
//         switch (id) {
//           case 'index':
//             value = index
//             break
//           case '_id':
//             value = order.code
//             break
//           case 'customerName':
//             value = order.customerName || order.userId?.name || '—'
//             break
//           case 'paymentMethod':
//             value = order.paymentMethod || '—'
//             break
//           case 'status':
//             value = (
//               <Chip
//                 label={
//                   order.status === 'Pending'
//                     ? 'Đang chờ'
//                     : order.status === 'Processing'
//                       ? 'Đang xử lý'
//                       : order.status === 'Shipped'
//                         ? 'Đã gửi hàng'
//                         : order.status === 'Delivered'
//                           ? 'Đã giao'
//                           : order.status === 'Cancelled'
//                             ? 'Đã hủy'
//                             : '—'
//                 }
//                 color={
//                   order.status === 'Pending'
//                     ? 'warning'
//                     : order.status === 'Cancelled'
//                       ? 'error'
//                       : 'success'
//                 }
//                 size='large'
//                 sx={{ width: '120px', fontWeight: '800' }}
//               />
//             )
//             break
//           case 'paymentStatus':
//             value = (
//               <Chip
//                 label={
//                   order.paymentStatus === 'Pending'
//                     ? 'Đang chờ'
//                     : order.paymentStatus === 'Completed'
//                       ? 'Đã thanh toán'
//                       : order.paymentStatus === 'Failed'
//                         ? 'Thất bại'
//                         : '—'
//                 }
//                 color={
//                   order.paymentStatus === 'Completed'
//                     ? 'success'
//                     : order.paymentStatus === 'Failed'
//                       ? 'error'
//                       : 'warning'
//                 }
//                 size='large'
//                 sx={{ width: '120px', fontWeight: '800' }}
//               />
//             )
//             break
//           case 'createdAt':
//             value = formatDate(order.createdAt)
//             break
//           case 'action':
//             value = (
//               <Stack direction='row' spacing={1} sx={styles.groupIcon}>
//                 <IconButton
//                   sx={{ width: 35, height: 35 }}
//                   onClick={() => onView(order)}
//                   size='small'
//                 >
//                   <RemoveRedEyeIcon color='primary' />
//                 </IconButton>
//                 <IconButton
//                   sx={{ width: 35, height: 35 }}
//                   onClick={() => onEdit(order)}
//                   size='small'
//                 >
//                   <BorderColorIcon color='warning' />
//                 </IconButton>
//                 <IconButton
//                   sx={{ width: 35, height: 35 }}
//                   onClick={() => onDelete(order)}
//                   size='small'
//                 >
//                   <VisibilityOffIcon color='error' />
//                 </IconButton>
//               </Stack>
//             )
//             break
//           default:
//             value = '—'
//         }
//
//         return (
//           <TableCell
//             key={id}
//             align={align || 'left'}
//             sx={{ minHeight: 90, height: 90, alignItems: 'center' }}
//           >
//             {value}
//           </TableCell>
//         )
//       })}
//     </TableRow>
//   )
// }
//
// export default OrderRow

import React from 'react'
import { TableRow, TableCell, IconButton, Stack, Chip } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import dayjs from 'dayjs'
import { Tooltip } from '@mui/material'
import usePermissions from '~/hooks/usePermissions'
const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    gap: 1,
    width: '130px'
  },
  cellPadding: {
    height: 55,
    minHeight: 55,
    maxHeight: 55,
    lineHeight: '49px',
    py: 0,
    px: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    verticalAlign: 'middle',
    background: '#fff'
  }
}

const orderOptions = [
  { value: 'Pending', label: 'Đang chờ' },
  { value: 'Processing', label: 'Đang xử lý' },
  { value: 'Shipping', label: 'Đang vận chuyển' },
  { value: 'Shipped', label: 'Đã gửi hàng' },
  { value: 'Delivered', label: 'Đã giao' },
  { value: 'Cancelled', label: 'Đã hủy' },
  { value: 'Failed', label: 'Thất bại' }
]
const colorOrder = [
  { value: 'Pending', color: 'warning' },
  { value: 'Processing', color: 'info' },
  { value: 'Shipping', color: 'primary' },
  { value: 'Shipped', color: 'warning' },
  { value: 'Delivered', color: 'success' },
  { value: 'Cancelled', color: 'error' },
  { value: 'Failed', color: 'error' }
]

const OrderRow = ({ order, index, columns, onView, onEdit, onDelete }) => {
  const { hasPermission } = usePermissions()
  const formatDate = (date) =>
    date ? dayjs(date).format('DD/MM/YYYY') : 'Không có dữ liệu'
  const orderUserId = order.userId?.name || 'không có dữ liệu'
  return (
    <TableRow hover>
      {columns.map((col) => {
        const { id, align } = col
        let value = 'Không có dữ liệu'

        switch (id) {
          case 'index':
            value = index
            break
          case '_id':
            value = order.code
            break
          case 'customerName':
            value =
              orderUserId
                .split(' ')
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(' ') || 'Không có dữ liệu'
            break
          case 'paymentMethod':
            value = order.paymentMethod === 'COD' ? 'COD' : 'VNPay'
            break
          case 'status':
            value = (
              <Chip
                label={
                  orderOptions.find((option) => option.value === order.status)
                    ?.label || 'Không xác định'
                }
                color={
                  colorOrder.find((option) => option.value === order.status)
                    ?.color || 'primary'
                }
                size='large'
                sx={{ width: '137px', fontWeight: '800' }}
              />
            )
            break
          case 'paymentStatus':
            value = (
              <Chip
                label={
                  order.paymentStatus === 'Pending'
                    ? 'Đang chờ'
                    : order.paymentStatus === 'Completed'
                      ? 'Đã thanh toán'
                      : order.paymentStatus === 'Failed'
                        ? 'Thất bại'
                        : 'Không xác định'
                }
                color={
                  order.paymentStatus === 'Completed'
                    ? 'success'
                    : order.paymentStatus === 'Failed'
                      ? 'error'
                      : 'warning'
                }
                size='large'
                sx={{ width: '137px', fontWeight: '800' }}
              />
            )
            break
          case 'createdAt':
            value = formatDate(order.createdAt)
            break
          case 'action':
            value = (
              <Stack direction='row' sx={styles.groupIcon}>
                {hasPermission('order:read') && (
                  <Tooltip title='Xem'>
                    <IconButton onClick={() => onView(order)} size='small'>
                      <RemoveRedEyeIcon color='primary' />
                    </IconButton>
                  </Tooltip>
                )}
                {/*{hasPermission('order:update') && (*/}
                {/*  <Tooltip title='Sửa'>*/}
                {/*    <IconButton onClick={() => onEdit(order)} size='small'>*/}
                {/*      <BorderColorIcon color='warning' />*/}
                {/*    </IconButton>*/}
                {/*  </Tooltip>*/}
                {/*)}*/}
              </Stack>
            )
            break
          default:
            value = order[id] ?? 'Không có dữ liệu'
        }

        return (
          <TableCell
            key={id}
            align={align || 'left'}
            onClick={
              id === '_id' && hasPermission('order:read')
                ? () => onView(order)
                : null
            }
            sx={{
              ...styles.cellPadding,
              ...(id === '_id' && hasPermission('order:read')
                ? { cursor: 'pointer' }
                : {})
            }}
          >
            {value}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export default OrderRow
