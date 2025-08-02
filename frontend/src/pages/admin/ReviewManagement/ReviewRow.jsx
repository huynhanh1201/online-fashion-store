import React, { useEffect, useState } from 'react'
import {
  TableRow,
  TableCell,
  IconButton,
  Stack,
  Chip,
  Tooltip
} from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import DeleteIcon from '@mui/icons-material/Delete'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

const formatDate = (isoString) => {
  if (!isoString) return 'Không xác định'
  return new Date(isoString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const ReviewRow = ({
  review,
  index,
  columns,
  handleOpenModal,
  permissions = {},
  filter
}) => {
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
      verticalAlign: 'middle',
      background: '#fff'
    }
  }
  const [showRestoreIcon, setShowRestoreIcon] = useState(false)

  useEffect(() => {
    if (filters.destroy === 'true') {
      const timer = setTimeout(() => {
        setShowRestoreIcon(true)
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    } else {
      setShowRestoreIcon(true)
    }
  }, [filters.destroy])
  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      {columns.map((column) => {
        let value = ''
        if (column.id === 'index') value = index
        else if (column.id === 'user')
          value = review?.userId?.name || 'Không xác định'
        else if (column.id === 'product') {
          value = review?.productId?.name || 'không có tên sản phẩm'
          return (
            <TableCell
              key={column.id}
              align={column.align}
              onClick={
                permissions.canView
                  ? () => handleOpenModal('view', review)
                  : null
              }
              sx={{
                ...styles.cellPadding,
                cursor: permissions.canView ? 'pointer' : 'default'
              }}
            >
              {value}
            </TableCell>
          )
        } else if (column.id === 'comment') value = review.comment
        else if (column.id === 'rating') value = review.rating
        else if (column.id === 'moderationStatus') {
          return (
            <TableCell
              key={column.id}
              align={column.align}
              sx={styles.cellPadding}
            >
              <Chip
                label={
                  review.moderationStatus === 'approved'
                    ? 'Đã duyệt'
                    : review.moderationStatus === 'rejected'
                      ? 'Từ chối'
                      : 'Chờ duyệt'
                }
                color={
                  review.moderationStatus === 'approved'
                    ? 'success'
                    : review.moderationStatus === 'rejected'
                      ? 'error'
                      : 'warning'
                }
                size='large'
                sx={{ width: '130px', fontWeight: 800 }}
              />
            </TableCell>
          )
        } else if (column.id === 'action') {
          return (
            <TableCell
              key={column.id}
              align={column.align}
              sx={styles.cellPadding}
            >
              <Stack direction='row' spacing={1} sx={styles.groupIcon}>
                {permissions.canView && (
                  <Tooltip title='Xem chi tiết'>
                    <IconButton onClick={() => handleOpenModal('view', review)}>
                      <RemoveRedEyeIcon color='primary' />
                    </IconButton>
                  </Tooltip>
                )}
                {showRestoreIcon === false
                  ? permissions.canRestore && (
                      <Tooltip title='Khôi phục'>
                        <IconButton
                          onClick={() => handleOpenModal('restore', review)}
                          size='small'
                          sx={{ ml: '0 !important' }}
                        >
                          <RestartAltIcon color='success' />
                        </IconButton>
                      </Tooltip>
                    )
                  : permissions.canDelete && (
                      <Tooltip title='Xoá'>
                        <IconButton
                          sx={{ ml: '0 !important' }}
                          onClick={() => handleOpenModal('delete', review)}
                        >
                          <DeleteIcon color='error' />
                        </IconButton>
                      </Tooltip>
                    )}
              </Stack>
            </TableCell>
          )
        } else if (['createdAt'].includes(column.id)) {
          value = formatDate(review[column.id])
        } else {
          value = review[column.id] || '—'
        }

        return (
          <TableCell
            key={column.id}
            align={column.align}
            sx={{
              ...styles.cellPadding,
              ...(column.id === 'rating' && { pr: column.pr })
            }}
          >
            {value}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export default ReviewRow
