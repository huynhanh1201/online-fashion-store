import React from 'react'

import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import { StyledTableCell, StyledTableRow } from '~/assets/StyleAdmin.jsx'

const DiscountRow = ({ discount, index, onAction }) => {
  const remaining = discount.usageLimit - discount.usedCount

  return (
    <StyledTableRow>
      <StyledTableCell sx={{ textAlign: 'center' }}>
        {index + 1}
      </StyledTableCell>
      <StyledTableCell>{discount.code.toUpperCase()}</StyledTableCell>
      <StyledTableCell>
        {discount.type === 'fixed' ? 'Cố định' : 'Phần trăm'}
      </StyledTableCell>
      <StyledTableCell>
        {discount.type === 'fixed'
          ? `${discount.amount?.toLocaleString('vi-VN')} VNĐ`
          : `${discount.amount}%`}
      </StyledTableCell>

      <StyledTableCell>{discount.usageLimit}</StyledTableCell>
      <StyledTableCell>{remaining >= 0 ? remaining : 0}</StyledTableCell>
      <StyledTableCell>
        <Chip
          label={discount.status !== 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
          color={discount.status !== 'active' ? 'success' : 'error'}
          size='small'
        />
      </StyledTableCell>
      <StyledTableCell>
        {discount.validFrom
          ? new Date(discount.validFrom).toLocaleString()
          : ''}
      </StyledTableCell>
      <StyledTableCell>
        {discount.validUntil
          ? new Date(discount.validUntil).toLocaleString()
          : ''}
      </StyledTableCell>
      <StyledTableCell>
        <Stack direction='row' spacing={1}>
          <IconButton onClick={() => onAction('view', discount)} size='small'>
            <RemoveRedEyeIcon color='primary' />
          </IconButton>
          <IconButton onClick={() => onAction('edit', discount)} size='small'>
            <BorderColorIcon color='warning' />
          </IconButton>
          <IconButton onClick={() => onAction('delete', discount)} size='small'>
            <DeleteForeverIcon color='error' />
          </IconButton>
        </Stack>
      </StyledTableCell>
    </StyledTableRow>
  )
}

export default DiscountRow
