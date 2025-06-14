import React from 'react'
import { TableCell, TableRow, IconButton, Stack } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
    width: '130px'
  }
}

export default function CategoryRow({
  category,
  index,
  columns,
  handleOpenModal
}) {
  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      {columns.map((column) => {
        if (column.id === 'createdAt' || column.id === 'updatedAt') {
          const date = new Date(category[column.id])
          const formattedDate = date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
          return (
            <TableCell key={column.id} align={column.align}>
              {formattedDate}
            </TableCell>
          )
        }
        if (column.id === 'action') {
          return (
            <TableCell key={column.id} align={column.align}>
              <Stack direction='row' sx={styles.groupIcon}>
                <IconButton
                  onClick={() => handleOpenModal('view', category)}
                  size='small'
                  color='primary'
                >
                  <RemoveRedEyeIcon color='primary' />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal('edit', category)}
                  size='small'
                  color='info'
                >
                  <BorderColorIcon color='warning' />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal('delete', category)}
                  size='small'
                  color='error'
                >
                  <DeleteForeverIcon color='error' />
                </IconButton>
              </Stack>
            </TableCell>
          )
        }

        const value = column.id === 'index' ? index : category[column.id]
        return (
          <TableCell
            key={column.id}
            align={column.align}
            title={
              ['name', 'description'].includes(column.id) ? value : undefined
            }
          >
            {value ?? 'Không có dữ liệu'}
          </TableCell>
        )
      })}
    </TableRow>
  )
}
