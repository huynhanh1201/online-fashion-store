import React from 'react'
import dayjs from 'dayjs'
import StyleAdmin, {
  StyledTableCell,
  StyledTableRow
} from '~/assets/StyleAdmin.jsx'
import { IconButton, Stack } from '@mui/material'
import { RemoveRedEye } from '@mui/icons-material'
const InventoryLogRow = ({ log, onView }) => {
  return (
    <StyledTableRow>
      <StyledTableCell>
        {dayjs(log.date).format('DD/MM/YYYY HH:mm')}
      </StyledTableCell>
      <StyledTableCell>{log.variant?.sku}</StyledTableCell>
      <StyledTableCell>{log.variant?.color.name}</StyledTableCell>
      <StyledTableCell>{log.variant?.size.name}</StyledTableCell>
      <StyledTableCell>{log.type}</StyledTableCell>
      <StyledTableCell>{log.source || '-'}</StyledTableCell>
      <StyledTableCell>{log.amount}</StyledTableCell>
      <StyledTableCell>{log.importPrice || '-'}</StyledTableCell>
      <StyledTableCell>{log.exportPrice || '-'}</StyledTableCell>
      <StyledTableCell>{log.note || '-'}</StyledTableCell>
      <StyledTableCell>
        <Stack direction='row' spacing={1}>
          <IconButton onClick={onView} size='small'>
            <RemoveRedEye color='primary' />
          </IconButton>
        </Stack>
      </StyledTableCell>
    </StyledTableRow>
  )
}

export default InventoryLogRow
