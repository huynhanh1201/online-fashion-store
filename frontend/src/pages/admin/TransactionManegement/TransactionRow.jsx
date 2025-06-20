// import React from 'react'
// import {
//   IconButton,
//   Tooltip,
//   Chip,
//   TableRow,
//   TableCell,
//   Stack
// } from '@mui/material'
//
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
// import BorderColorIcon from '@mui/icons-material/BorderColor'
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
//
// import StyleAdmin from '~/assets/StyleAdmin.jsx'
//
// const TransactionRow = ({ transaction, onView, onEdit, onDelete, index.jsx }) => {
//   const statusLabel = {
//     Pending: 'Đang xử lý',
//     Completed: 'Thành công',
//     Failed: 'Thất bại'
//   }
//
//   const statusColor = {
//     Pending: 'warning',
//     Completed: 'success',
//     Failed: 'error'
//   }
//   const styles = {
//     groupIcon: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       width: '100%',
//       maxWidth: '130px'
//     }
//   }
//
//   return (
//     <TableRow>
//       <TableCell sx={StyleAdmin.TableColumnSTT}>{index.jsx + 1}</TableCell>
//       <TableCell>{transaction?.orderId?.code}</TableCell>
//       <TableCell>{transaction.transactionId || '(Thanh toán COD)'}</TableCell>
//       <TableCell>{transaction.method}</TableCell>
//       <TableCell>
//         <Chip
//           label={statusLabel[transaction.status] || '—'}
//           color={statusColor[transaction.status] || 'default'}
//           size='large'
//           sx={{ width: '120px', fontWeight: '800' }}
//         />
//       </TableCell>
//       <TableCell>
//         {transaction?.orderId?.total !== null
//           ? `${transaction?.orderId?.total.toLocaleString('vi-VN')}đ`
//           : 'Đang tải...'}
//       </TableCell>
//       <TableCell>
//         {new Date(transaction.createdAt).toLocaleDateString()}
//       </TableCell>
//       <TableCell>
//         <Stack direction='row' spacing={1} sx={styles.groupIcon}>
//           <IconButton onClick={() => onView(transaction)} size='small'>
//             <RemoveRedEyeIcon color='primary' />
//           </IconButton>
//           <IconButton onClick={() => onEdit(transaction)} size='small'>
//             <BorderColorIcon color='warning' />
//           </IconButton>
//           <IconButton onClick={() => onDelete(transaction)} size='small'>
//             <DeleteForeverIcon color='error' />
//           </IconButton>
//         </Stack>
//       </TableCell>
//     </TableRow>
//   )
// }
//
// export default TransactionRow

// import React from 'react'
// import { TableRow, TableCell, Chip, IconButton, Stack } from '@mui/material'
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
// import BorderColorIcon from '@mui/icons-material/BorderColor'
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
// import StyleAdmin from '~/assets/StyleAdmin'
//
// const TransactionRow = ({ transaction, index, onView, onEdit, onDelete }) => {
//   const statusLabel = {
//     Pending: 'Đang xử lý',
//     Completed: 'Thành công',
//     Failed: 'Thất bại'
//   }
//
//   const statusColor = {
//     Pending: 'warning',
//     Completed: 'success',
//     Failed: 'error'
//   }
//
//   const styles = {
//     groupIcon: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       gap: 1,
//       width: '100%'
//     }
//   }
//   return (
//     <TableRow>
//       <TableCell
//         sx={{ minHeight: 90, height: 90, ...StyleAdmin.TableColumnSTT }}
//       >
//         {index + 1}
//       </TableCell>
//       <TableCell sx={{ minHeight: 90, height: 90 }}>
//         {transaction?.orderId?.code || '—'}
//       </TableCell>
//       <TableCell sx={{ minHeight: 90, height: 90 }}>
//         {transaction.transactionId || '(Thanh toán COD)'}
//       </TableCell>
//       <TableCell sx={{ minHeight: 90, height: 90 }}>
//         {transaction.method || '—'}
//       </TableCell>
//       <TableCell sx={{ minHeight: 90, height: 90 }}>
//         <Chip
//           label={statusLabel[transaction.status] || '—'}
//           color={statusColor[transaction.status] || 'default'}
//           size='large'
//           sx={{ width: '120px', fontWeight: '800' }}
//         />
//       </TableCell>
//       <TableCell sx={{ minHeight: 90, height: 90 }}>
//         {transaction?.orderId?.total != null
//           ? `${transaction.orderId.total.toLocaleString('vi-VN')}đ`
//           : '—'}
//       </TableCell>
//       <TableCell sx={{ minHeight: 90, height: 90 }}>
//         {new Date(transaction.createdAt).toLocaleDateString('vi-VN')}
//       </TableCell>
//       <TableCell align='center' sx={{ minHeight: 90, height: 90 }}>
//         <Stack
//           direction='row'
//           spacing={1}
//           justifyContent='center'
//           sx={styles.groupIcon}
//         >
//           <IconButton onClick={() => onView(transaction)} size='small'>
//             <RemoveRedEyeIcon color='primary' />
//           </IconButton>
//           <IconButton onClick={() => onEdit(transaction)} size='small'>
//             <BorderColorIcon color='warning' />
//           </IconButton>
//           <IconButton onClick={() => onDelete(transaction)} size='small'>
//             <VisibilityOffIcon color='error' />
//           </IconButton>
//         </Stack>
//       </TableCell>
//     </TableRow>
//   )
// }
//
// export default TransactionRow

import React from 'react'
import { TableRow, TableCell, Chip, IconButton, Stack } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import Tooltip from '@mui/material/Tooltip'
import usePermissions from '~/hooks/usePermissions'
const styles = {
  cell: {
    height: 55,
    minHeight: 55,
    maxHeight: 55,
    lineHeight: '49px',
    py: 0,
    px: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    verticalAlign: 'middle'
  },
  groupIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
    width: '130px'
  }
}

const TransactionRow = ({ transaction, index, onView, onEdit, onDelete }) => {
  const { hasPermission } = usePermissions()
  const statusLabel = {
    Pending: 'Đang xử lý',
    Completed: 'Thành công',
    Failed: 'Thất bại'
  }

  const statusColor = {
    Pending: 'warning',
    Completed: 'success',
    Failed: 'error'
  }

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      : '—'

  return (
    <TableRow hover>
      <TableCell sx={StyleAdmin.TableColumnSTT}>{index + 1}</TableCell>
      <TableCell sx={styles.cell} title={transaction?.orderId?.code}>
        {transaction?.orderCode || '—'}
      </TableCell>
      <TableCell sx={styles.cell} title={transaction.transactionId}>
        {transaction.transactionId || '(Thanh toán COD)'}
      </TableCell>
      <TableCell sx={styles.cell}>
        {transaction.method ? transaction.method.toLocaleUpperCase() : '—'}
      </TableCell>

      <TableCell sx={{ ...styles.cell, pr: 10 }} align='right'>
        {transaction?.orderId?.total != null
          ? `${transaction.orderId.total.toLocaleString('vi-VN')}đ`
          : '—'}
      </TableCell>
      <TableCell sx={styles.cell}>
        {formatDate(transaction.createdAt)}
      </TableCell>
      <TableCell sx={styles.cell}>
        <Chip
          label={statusLabel[transaction.status] || '—'}
          color={statusColor[transaction.status] || 'default'}
          size='large'
          sx={{ width: '120px', fontWeight: '800' }}
        />
      </TableCell>
      <TableCell align='center' sx={{ ...styles.cell, width: '130px' }}>
        <Stack direction='row' sx={styles.groupIcon}>
          {hasPermission('payment:read') && (
            <Tooltip title='Xem'>
              <IconButton onClick={() => onView(transaction)} size='small'>
                <RemoveRedEyeIcon color='primary' />
              </IconButton>
            </Tooltip>
          )}
          {hasPermission('payment:update') && (
            <Tooltip title='Sửa'>
              <IconButton onClick={() => onEdit(transaction)} size='small'>
                <BorderColorIcon color='warning' />
              </IconButton>
            </Tooltip>
          )}
          {hasPermission('payment:delete') && (
            <Tooltip title='Ẩn'>
              <IconButton onClick={() => onDelete(transaction)} size='small'>
                <VisibilityOffIcon color='error' />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  )
}

export default TransactionRow
