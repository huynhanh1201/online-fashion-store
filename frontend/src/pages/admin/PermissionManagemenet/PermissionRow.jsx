import React from 'react'
import {
  TableRow,
  TableCell,
  Typography,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    gap: 1,
    width: '130px'
  },
  cellPadding: {
    height: 54,
    minHeight: 54,
    maxHeight: 54,
    py: 0,
    px: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    verticalAlign: 'middle'
  }
}

export default function PermissionRow({
  permission,
  index,
  onView,
  onEdit,
  onDelete
}) {
  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      <TableCell align='center' sx={styles.cellPadding}>
        {index}
      </TableCell>
      <TableCell align='left' sx={styles.cellPadding}>
        {permission.key}
      </TableCell>
      <TableCell align='left' sx={styles.cellPadding}>
        {permission.label}
      </TableCell>
      <TableCell align='left' sx={styles.cellPadding}>
        {permission.group}
      </TableCell>
      <TableCell align='center' sx={styles.cellPadding}>
        <Stack direction='row' spacing={1} justifyContent='center'>
          <Tooltip title='Xem'>
            <IconButton size='small' onClick={() => onView(permission)}>
              <RemoveRedEyeIcon color='primary' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Sửa'>
            <IconButton size='small' onClick={() => onEdit(permission)}>
              <BorderColorIcon color='warning' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Xoá'>
            <IconButton size='small' onClick={() => onDelete(permission)}>
              <DeleteForeverIcon color='error' />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  )
}
