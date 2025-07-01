import React from 'react'
import { TableCell, TableRow, IconButton, Stack } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Chip from '@mui/material/Chip'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
import Tooltip from '@mui/material/Tooltip'
import { useNavigate } from 'react-router-dom'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
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
    lineHeight: '49px',
    py: 0,
    px: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    verticalAlign: 'middle',
    background: '#fff '
  }
}

export default function CategoryRow({
  category,
  index,
  columns,
  handleOpenModal,
  permissions = {},
  filters
}) {
  const navigate = useNavigate()
  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      {columns.map((column) => {
        if (column.id === 'image') {
          return (
            <TableCell
              key={column.id}
              align='center'
              sx={{
                ...styles.cellPadding,
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                height: 50,
                minHeight: 55,
                maxHeight: 55
              }}
              onClick={() => handleOpenModal('view', category)}
            >
              {category.image ? (
                <img
                  src={optimizeCloudinaryUrl(category.image)}
                  alt='Ảnh danh mục'
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #ccc'
                  }}
                />
              ) : (
                <IconButton sx={{ width: 40, height: 40, p: '0 !important' }}>
                  <ImageNotSupportedIcon
                    sx={{ width: 40, height: 40, p: '0 !important' }}
                  />
                </IconButton>
              )}
            </TableCell>
          )
        }

        if (column.id === 'name' || column.id === 'description') {
          if (column.id === 'name') {
            const name = category[column.id] || 'Không có tên'
            category[column.id] = name
              .split(' ')
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(' ')
          }

          return (
            <TableCell
              key={column.id}
              align={column.align}
              title={category[column.id]}
              sx={{
                ...styles.cellPadding,
                maxWidth: 200,
                display: 'table-cell'
              }}
            >
              {category[column.id] ||
                (column.id === 'name' ? 'Không có tên' : 'Không có mô tả')}
            </TableCell>
          )
        }

        if (column.id === 'destroy') {
          return (
            <TableCell
              key={column.id}
              align={column.align}
              sx={styles.cellPadding}
            >
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
            <TableCell
              key={column.id}
              align={column.align}
              sx={styles.cellPadding}
            >
              {formattedDate}
            </TableCell>
          )
        }

        if (column.id === 'more') {
          return (
            <TableCell
              key={column.id}
              align={column.align}
              sx={{ ...styles.cellPadding, cursor: 'pointer' }}
              onClick={() => {
                if (category._id) {
                  navigate(
                    `/admin/product-management?categoryId=${category._id}`
                  )
                }
              }}
            >
              Xem sản phẩm thuộc danh mục này
            </TableCell>
          )
        }

        if (column.id === 'action') {
          return (
            <TableCell
              key={column.id}
              align={column.align}
              sx={styles.cellPadding}
            >
              <Stack direction='row' sx={styles.groupIcon}>
                {permissions.canView && (
                  <Tooltip title='Xem'>
                    <IconButton
                      onClick={() => handleOpenModal('view', category)}
                      size='small'
                      color='primary'
                    >
                      <RemoveRedEyeIcon color='primary' />
                    </IconButton>
                  </Tooltip>
                )}

                {filters.destroy === 'true' ? (
                  permissions.canRestore && (
                    <Tooltip title='Khôi phục'>
                      <IconButton
                        onClick={() => handleOpenModal('restore', category)}
                        size='small'
                      >
                        <RestartAltIcon color='success' />
                      </IconButton>
                    </Tooltip>
                  )
                ) : (
                  <>
                    {permissions.canEdit && (
                      <Tooltip title='Chỉnh sửa'>
                        <IconButton
                          onClick={() => handleOpenModal('edit', category)}
                          size='small'
                        >
                          <BorderColorIcon color='warning' />
                        </IconButton>
                      </Tooltip>
                    )}

                    {permissions.canDelete && (
                      <Tooltip title='Xoá'>
                        <IconButton
                          onClick={() => handleOpenModal('delete', category)}
                          size='small'
                          color='error'
                        >
                          <DeleteForeverIcon color='error' />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                )}
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
            sx={styles.cellPadding}
          >
            {value ?? 'Không có dữ liệu'}
          </TableCell>
        )
      })}
    </TableRow>
  )
}
