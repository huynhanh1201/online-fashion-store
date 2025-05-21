import React, { useEffect, useState } from 'react'

import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import useOrderAdmin from '~/hooks/admin/useOrder'
import StyleAdmin, {
  StyledTableCell,
  StyledTableRow
} from '~/assets/StyleAdmin.jsx'

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
  return (
    <StyledTableRow>
      <StyledTableCell sx={StyleAdmin.TableColumnSTT}>
        {index + 1}
      </StyledTableCell>
      <StyledTableCell>
        {transaction.transactionId || '(Thanh toán COD)'}
      </StyledTableCell>
      <StyledTableCell>{transaction.orderId}</StyledTableCell>
      <StyledTableCell>{transaction.method}</StyledTableCell>
      <StyledTableCell>
        <Chip
          label={
            transaction.status === 'Pending'
              ? 'Đang xử lý'
              : transaction.status === 'Completed'
                ? 'Thành công'
                : transaction.status === 'Failed'
                  ? 'Thất bại'
                  : '—'
          }
          color={
            transaction.status === 'Completed'
              ? 'success'
              : transaction.status === 'Failed'
                ? 'error'
                : 'warning'
          }
          size='small'
        />
      </StyledTableCell>
      <StyledTableCell>
        {orderTotal !== null
          ? `${orderTotal.toLocaleString()} VNĐ`
          : 'Đang tải...'}
      </StyledTableCell>
      <StyledTableCell
        sx={{
          maxWidth: '130px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {transaction.note || ' '}
      </StyledTableCell>
      <StyledTableCell>
        {new Date(transaction.createdAt).toLocaleString()}
      </StyledTableCell>
      <StyledTableCell>
        <Tooltip title='Xem'>
          <IconButton onClick={() => onView(transaction)}>
            <RemoveRedEyeIcon color='primary' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Sửa'>
          <IconButton onClick={() => onEdit(transaction)}>
            <BorderColorIcon color='warning' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Xoá'>
          <IconButton onClick={() => onDelete(transaction)}>
            <DeleteForeverIcon color='error' />
          </IconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  )
}

export default TransactionRow
