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

import React from 'react'
import { TableRow, TableCell, Chip, IconButton, Stack } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import StyleAdmin from '~/assets/StyleAdmin'

const TransactionRow = ({ transaction, index, onView, onEdit, onDelete }) => {
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

  const styles = {
    groupIcon: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 1,
      width: '100%'
    }
  }
  return (
    <TableRow>
      <TableCell sx={StyleAdmin.TableColumnSTT}>{index + 1}</TableCell>
      <TableCell>{transaction?.orderId?.code || '—'}</TableCell>
      <TableCell>{transaction.transactionId || '(Thanh toán COD)'}</TableCell>
      <TableCell>{transaction.method || '—'}</TableCell>
      <TableCell>
        <Chip
          label={statusLabel[transaction.status] || '—'}
          color={statusColor[transaction.status] || 'default'}
          size='large'
          sx={{ width: '120px', fontWeight: '800' }}
        />
      </TableCell>
      <TableCell>
        {transaction?.orderId?.total != null
          ? `${transaction.orderId.total.toLocaleString('vi-VN')}đ`
          : '—'}
      </TableCell>
      <TableCell>
        {new Date(transaction.createdAt).toLocaleDateString('vi-VN')}
      </TableCell>
      <TableCell align='center'>
        <Stack
          direction='row'
          spacing={1}
          justifyContent='center'
          sx={styles.groupIcon}
        >
          <IconButton onClick={() => onView(transaction)} size='small'>
            <RemoveRedEyeIcon color='primary' />
          </IconButton>
          <IconButton onClick={() => onEdit(transaction)} size='small'>
            <BorderColorIcon color='warning' />
          </IconButton>
          <IconButton onClick={() => onDelete(transaction)} size='small'>
            <DeleteForeverIcon color='error' />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  )
}

export default TransactionRow
