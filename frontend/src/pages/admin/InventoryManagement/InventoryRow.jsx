import React from 'react'
import { Stack, IconButton } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { StyledTableCell, StyledTableRow } from '~/assets/StyleAdmin.jsx'

const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  }
}

export default function InventoryRow({ inventory, idx, handleOpenModal }) {
  return (
    <StyledTableRow>
      <StyledTableCell sx={{ textAlign: 'center' }}>{idx + 1}</StyledTableCell>
      <StyledTableCell>
        {inventory.productId?.name || 'Không xác định'}
      </StyledTableCell>
      <StyledTableCell>{inventory.variant?.color?.name}</StyledTableCell>
      <StyledTableCell>{inventory.variant?.size?.name}</StyledTableCell>
      <StyledTableCell>{inventory.quantity}</StyledTableCell>
      <StyledTableCell>
        {inventory.importPrice?.toLocaleString()}đ
      </StyledTableCell>
      <StyledTableCell>
        {inventory.exportPrice?.toLocaleString()}đ
      </StyledTableCell>
      <StyledTableCell>
        {inventory.status === 'in-stock'
          ? 'Còn hàng'
          : inventory.status === 'out-of-stock'
            ? 'Hết hàng'
            : 'Ngừng bán'}
      </StyledTableCell>
      <StyledTableCell>
        <Stack direction='row' spacing={1} sx={styles.groupIcon}>
          <IconButton
            onClick={() => handleOpenModal('view', inventory)}
            size='small'
          >
            <RemoveRedEyeIcon color='primary' />
          </IconButton>
          <IconButton
            onClick={() => handleOpenModal('edit', inventory)}
            size='small'
          >
            <BorderColorIcon color='warning' />
          </IconButton>
          <IconButton
            onClick={() => handleOpenModal('delete', inventory)}
            size='small'
          >
            <DeleteForeverIcon color='error' />
          </IconButton>
        </Stack>
      </StyledTableCell>
    </StyledTableRow>
  )
}
