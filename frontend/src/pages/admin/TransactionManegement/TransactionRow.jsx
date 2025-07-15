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
    verticalAlign: 'middle',
    background: '#fff'
  },
  groupIcon: {
    display: 'flex',
    justifyContent: 'start',
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
      <TableCell sx={{ ...styles.cell, ...StyleAdmin.TableColumnSTT }}>
        {index + 1}
      </TableCell>
      <TableCell
        sx={{
          ...styles.cell,
          cursor: hasPermission('payment:read') ? 'pointer' : ''
        }}
        title={transaction?.orderId?.code}
        onClick={
          hasPermission('payment:read') ? () => onView(transaction) : null
        }
      >
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
          ? `${transaction.orderId.total.toLocaleString('vi-VN')}₫`
          : '0₫'}
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
      <TableCell align='left' sx={{ ...styles.cell, width: '130px' }}>
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
