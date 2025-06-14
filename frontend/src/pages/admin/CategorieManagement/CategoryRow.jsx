import React from 'react'
import { TableCell, TableRow, IconButton, Stack } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Chip from '@mui/material/Chip'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

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
        if (column.id === 'image') {
          return (
            <TableCell
              key={column.id}
              align='center'
              sx={{ cursor: 'pointer' }}
              onClick={() => handleOpenModal('view', category)}
            >
              {category.image ? (
                <img
                  src={optimizeCloudinaryUrl(category.image)}
                  alt='Ảnh danh mục'
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #ccc'
                  }}
                />
              ) : (
                <IconButton>
                  <ImageNotSupportedIcon sx={{ width: 40, height: 40 }} />
                </IconButton>
              )}
            </TableCell>
          )
        }

        if (column.id === 'description') {
          return (
            <TableCell
              key={column.id}
              align={column.align}
              title={category[column.id]}
              sx={{
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {category[column.id] || 'Không có mô tả'}
            </TableCell>
          )
        }

        if (column.id === 'destroy') {
          return (
            <TableCell key={column.id} align={column.align}>
              <Chip
                label={category[column.id] ? 'Không hoạt động' : 'Hoạt động'}
                color={category[column.id] ? 'error' : 'success'}
                size='large'
                sx={{ width: '127px', fontWeight: '800' }}
              />
            </TableCell>
          )
        }

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
