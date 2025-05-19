import React from 'react'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import dayjs from 'dayjs'
import StyleAdmin, {
  StyledTableCell,
  StyledTableRow
} from '~/components/StyleAdmin'

const OrderRow = ({ order, index, onView, onEdit, onDelete }) => {
  const {
    _id,
    customerName = order.userId.name,
    status,
    paymentStatus,
    createdAt
  } = order

  return (
    <StyledTableRow hover>
      <StyledTableCell sx={StyleAdmin.TableColumnSTT}>
        {index + 1}
      </StyledTableCell>

      <StyledTableCell>{_id}</StyledTableCell>

      <StyledTableCell
        sx={{
          maxWidth: '200px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {customerName || '—'}
      </StyledTableCell>

      <StyledTableCell>
        <Chip
          label={
            status === 'Pending'
              ? 'Đang chờ'
              : status === 'Processing'
                ? 'Đang xử lý'
                : status === 'Shipped'
                  ? 'Đã gửi hàng'
                  : status === 'Delivered'
                    ? 'Đã giao'
                    : status === 'Cancelled'
                      ? 'Đã hủy'
                      : '—'
          }
          color={
            status === 'Pending'
              ? 'warning'
              : status === 'Cancelled'
                ? 'error'
                : 'success'
          }
          size='small'
        />
      </StyledTableCell>

      <StyledTableCell>
        <Chip
          label={
            paymentStatus === 'Pending'
              ? 'Đang chờ'
              : paymentStatus === 'Completed'
                ? 'Đã thanh toán'
                : paymentStatus === 'Failed'
                  ? 'Thất bại'
                  : '—'
          }
          color={
            paymentStatus === 'Completed'
              ? 'success'
              : paymentStatus === 'Failed'
                ? 'error'
                : 'warning'
          }
          size='small'
        />
      </StyledTableCell>

      <StyledTableCell>
        {createdAt ? dayjs(createdAt).format('DD/MM/YYYY HH:mm') : '—'}
      </StyledTableCell>

      <StyledTableCell sx={{ maxWidth: 130, width: 130 }}>
        <Stack direction='row' spacing={1}>
          <IconButton onClick={() => onView(order)} size='small'>
            <RemoveRedEyeIcon color='primary' />
          </IconButton>
          <IconButton onClick={() => onEdit(order)} size='small'>
            <BorderColorIcon color='warning' />
          </IconButton>
          <IconButton onClick={() => onDelete(order)} size='small'>
            <DeleteForeverIcon color='error' />
          </IconButton>
        </Stack>
      </StyledTableCell>
    </StyledTableRow>
  )
}

export default OrderRow
