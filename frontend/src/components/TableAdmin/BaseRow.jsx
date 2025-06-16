import React from 'react'
import { TableCell, TableRow, IconButton, Stack, Chip } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'

const cellStyle = {
  height: 49,
  py: 0,
  px: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  verticalAlign: 'middle'
}

export default function CategoryRow({
  item: category,
  index,
  columns,
  handleOpenModal
}) {
  return (
    <TableRow hover>
      {columns.map((column) => {
        const id = column.id
        if (id === 'index') {
          return (
            <TableCell key={id} align='center' sx={cellStyle}>
              {index}
            </TableCell>
          )
        }

        if (id === 'image') {
          return (
            <TableCell key={id} align='center' sx={cellStyle}>
              {category.image ? (
                <img
                  src={optimizeCloudinaryUrl(category.image)}
                  alt='Ảnh'
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #ccc'
                  }}
                />
              ) : (
                <ImageNotSupportedIcon sx={{ width: 40, height: 40 }} />
              )}
            </TableCell>
          )
        }

        if (id === 'destroy') {
          return (
            <TableCell key={id} align='center' sx={cellStyle}>
              <Chip
                label={category.destroy ? 'Không hoạt động' : 'Hoạt động'}
                color={category.destroy ? 'error' : 'success'}
                size='small'
              />
            </TableCell>
          )
        }

        if (id === 'createdAt' || id === 'updatedAt') {
          const date = new Date(category[id])
          const formatted = date.toLocaleDateString('vi-VN')
          return (
            <TableCell key={id} align={column.align} sx={cellStyle}>
              {formatted}
            </TableCell>
          )
        }

        if (id === 'action') {
          return (
            <TableCell key={id} align='center' sx={cellStyle}>
              <Stack direction='row' justifyContent='center' spacing={1}>
                <IconButton
                  onClick={() => handleOpenModal('view', category)}
                  size='small'
                >
                  <RemoveRedEyeIcon color='primary' />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal('edit', category)}
                  size='small'
                >
                  <BorderColorIcon color='warning' />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal('delete', category)}
                  size='small'
                >
                  <DeleteForeverIcon color='error' />
                </IconButton>
              </Stack>
            </TableCell>
          )
        }

        return (
          <TableCell
            key={id}
            align={column.align}
            sx={{ ...cellStyle, maxWidth: 200 }}
            title={category[id]}
          >
            {category[id] ?? '—'}
          </TableCell>
        )
      })}
    </TableRow>
  )
}
