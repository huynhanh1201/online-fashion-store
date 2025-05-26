import React from 'react'
import { Stack, IconButton } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import { StyledTableCell, StyledTableRow } from '~/assets/StyleAdmin.jsx'

const formatDateTime = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  }
}

export default function SizeRow({ size, idx, handleOpenModal }) {
  return (
    <StyledTableRow>
      <StyledTableCell sx={{ textAlign: 'center' }}>{idx + 1}</StyledTableCell>
      <StyledTableCell
        sx={{
          maxWidth: 200,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {size.name}
      </StyledTableCell>
      <StyledTableCell>{formatDateTime(size.createdAt)}</StyledTableCell>
      <StyledTableCell>{formatDateTime(size.updatedAt)}</StyledTableCell>
      <StyledTableCell sx={{ width: '130px', maxWidth: '130px' }}>
        <Stack direction='row' spacing={1} sx={styles.groupIcon}>
          <IconButton
            onClick={() => handleOpenModal('view', size)}
            size='small'
          >
            <RemoveRedEyeIcon color='primary' />
          </IconButton>
          <IconButton
            onClick={() => handleOpenModal('edit', size)}
            size='small'
          >
            <BorderColorIcon color='warning' />
          </IconButton>
          <IconButton
            onClick={() => handleOpenModal('delete', size)}
            size='small'
          >
            <DeleteForeverIcon color='error' />
          </IconButton>
        </Stack>
      </StyledTableCell>
    </StyledTableRow>
  )
}
