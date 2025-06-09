// import React, { useEffect, useState } from 'react'
//
// import IconButton from '@mui/material/IconButton'
// import Tooltip from '@mui/material/Tooltip'
// import Chip from '@mui/material/Chip'
//
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
// import BorderColorIcon from '@mui/icons-material/BorderColor'
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
//
// import useOrderAdmin from '~/hooks/admin/useOrder'
// import StyleAdmin, {
//   StyledTableCell,
//   StyledTableRow
// } from '~/assets/StyleAdmin.jsx'
//
// const TransactionRow = ({ transaction, onView, onEdit, onDelete, index }) => {
//   const [orderTotal, setOrderTotal] = useState(null)
//   const { getOrderId } = useOrderAdmin()
//
//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const order = await getOrderId(transaction.orderId)
//         setOrderTotal(order?.total)
//       } catch (error) {
//         console.error('Lỗi khi lấy đơn hàng:', error)
//       }
//     }
//
//     if (transaction.orderId) {
//       fetchOrder()
//     }
//   }, [transaction.orderId])
//   return (
//     <StyledTableRow>
//       <StyledTableCell sx={StyleAdmin.TableColumnSTT}>
//         {index + 1}
//       </StyledTableCell>
//       <StyledTableCell>
//         {transaction.transactionId || '(Thanh toán COD)'}
//       </StyledTableCell>
//       <StyledTableCell>{transaction.orderId}</StyledTableCell>
//       <StyledTableCell>{transaction.method}</StyledTableCell>
//       <StyledTableCell>
//         <Chip
//           label={
//             transaction.status === 'Pending'
//               ? 'Đang xử lý'
//               : transaction.status === 'Completed'
//                 ? 'Thành công'
//                 : transaction.status === 'Failed'
//                   ? 'Thất bại'
//                   : '—'
//           }
//           color={
//             transaction.status === 'Completed'
//               ? 'success'
//               : transaction.status === 'Failed'
//                 ? 'error'
//                 : 'warning'
//           }
//           size='small'
//         />
//       </StyledTableCell>
//       <StyledTableCell>
//         {orderTotal !== null
//           ? `${orderTotal.toLocaleString()} VNĐ`
//           : 'Đang tải...'}
//       </StyledTableCell>
//       <StyledTableCell
//         sx={{
//           maxWidth: '130px',
//           whiteSpace: 'nowrap',
//           overflow: 'hidden',
//           textOverflow: 'ellipsis'
//         }}
//       >
//         {transaction.note || ' '}
//       </StyledTableCell>
//       <StyledTableCell>
//         {new Date(transaction.createdAt).toLocaleString()}
//       </StyledTableCell>
//       <StyledTableCell>
//         <Tooltip title='Xem'>
//           <IconButton onClick={() => onView(transaction)}>
//             <RemoveRedEyeIcon color='primary' />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title='Sửa'>
//           <IconButton onClick={() => onEdit(transaction)}>
//             <BorderColorIcon color='warning' />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title='Xoá'>
//           <IconButton onClick={() => onDelete(transaction)}>
//             <DeleteForeverIcon color='error' />
//           </IconButton>
//         </Tooltip>
//       </StyledTableCell>
//     </StyledTableRow>
//   )
// }
//
// export default TransactionRow
import React, { useEffect, useState } from 'react'
import {
  IconButton,
  Tooltip,
  Chip,
  TableRow,
  TableCell,
  Stack
} from '@mui/material'

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import useOrderAdmin from '~/hooks/admin/useOrder'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const TransactionRow = ({ transaction, onView, onEdit, onDelete, index }) => {
  const [orderTotal, setOrderTotal] = useState(null)
  const { getOrderId } = useOrderAdmin()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const order = await getOrderId(transaction.orderId)
        setOrderTotal(order?.total)
      } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error)
      }
    }

    if (transaction.orderId) {
      fetchOrder()
    }
  }, [transaction.orderId])

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
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      maxWidth: '130px'
    }
  }

  return (
    <TableRow>
      <TableCell sx={StyleAdmin.TableColumnSTT}>{index + 1}</TableCell>
      <TableCell>{transaction.transactionId || '(Thanh toán COD)'}</TableCell>
      <TableCell>{transaction.orderId}</TableCell>
      <TableCell>{transaction.method}</TableCell>
      <TableCell>
        <Chip
          label={statusLabel[transaction.status] || '—'}
          color={statusColor[transaction.status] || 'default'}
          size='large'
          sx={{ width: '120px', fontWeight: '800' }}
        />
      </TableCell>
      <TableCell>
        {orderTotal !== null
          ? `${orderTotal.toLocaleString('vi-VN')} VNĐ`
          : 'Đang tải...'}
      </TableCell>
      <TableCell>
        {new Date(transaction.createdAt).toLocaleString('vi-VN')}
      </TableCell>
      <TableCell>
        <Stack direction='row' spacing={1} sx={styles.groupIcon}>
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
