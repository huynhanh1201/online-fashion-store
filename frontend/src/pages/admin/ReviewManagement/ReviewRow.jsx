import React from 'react'
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
  permissions = {}
}) => {
  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      {columns.map((column) => {
        let value = ''
        if (column.id === 'index') value = index
        else if (column.id === 'comment') value = review.comment
        else if (column.id === 'rating') value = review.rating
        else if (column.id === 'moderationStatus') {
          return (
            <TableCell key={column.id} align={column.align}>
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
              />
            </TableCell>
          )
        } else if (column.id === 'action') {
          return (
            <TableCell key={column.id} align={column.align}>
              <Stack direction='row' spacing={1}>
                {permissions.canView && (
                  <Tooltip title='Xem chi tiết'>
                    <IconButton onClick={() => handleOpenModal('view', review)}>
                      <RemoveRedEyeIcon color='primary' />
                    </IconButton>
                  </Tooltip>
                )}
                {permissions.canDelete && (
                  <Tooltip title='Xoá'>
                    <IconButton
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
          <TableCell key={column.id} align={column.align}>
            {value}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export default ReviewRow
