import { TableRow, TableCell, IconButton, Chip, Stack } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import React from 'react'

const SizePaletteRow = ({ index, size, onEdit, onDelete, onView }) => {
  const styles = {
    groupIcon: {
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'center',
      gap: 1,
      width: '130px'
    },
    cellPadding: {
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
    }
  }

  return (
    <TableRow hover>
      <TableCell align='center'>{index}</TableCell>
      <TableCell sx={styles.cellPadding}>
        {size.productId || 'Không có tên sản phẩm'}
      </TableCell>
      <TableCell sx={styles.cellPadding}>
        {size.name || 'Không có tên'}
      </TableCell>
      <TableCell sx={styles.cellPadding}>
        <Chip
          label={size.isActive ? 'Hoạt động' : 'Ẩn'}
          color={size.isActive ? 'success' : 'default'}
          size='large'
          sx={{ width: 127, fontWeight: 800 }}
        />
      </TableCell>
      <TableCell align='left' sx={styles.cellPadding}>
        <Stack direction='row' sx={styles.groupIcon}>
          <Tooltip title='Xem'>
            <IconButton
              onClick={() => onView(size)}
              size='small'
              color='primary'
            >
              <RemoveRedEyeIcon color='primary' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Sửa'>
            <IconButton onClick={() => onEdit(size)} size='small' color='info'>
              <BorderColorIcon color='warning' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Xoá'>
            <IconButton
              onClick={() => onDelete(size)}
              size='small'
              color='error'
            >
              <DeleteForeverIcon color='error' />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  )
}

export default SizePaletteRow
