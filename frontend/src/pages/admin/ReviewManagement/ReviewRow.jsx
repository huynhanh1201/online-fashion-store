import React from 'react'
import {
  TableCell,
  TableRow,
  IconButton,
  Stack,
  Tooltip,
  Chip
} from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import StarIcon from '@mui/icons-material/Star'
import usePermissions from '~/hooks/usePermissions'

const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'center',
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
    verticalAlign: 'middle'
  }
}

export default function ReviewRow({ review, index, columns, handleOpenModal }) {
  const { hasPermission } = usePermissions()

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      {columns.map((column) => {
        const colId = column.id

        if (colId === 'index') {
          return (
            <TableCell key={colId} align='center' sx={styles.cellPadding}>
              {index}
            </TableCell>
          )
        }

        if (colId === 'product') {
          return (
            <TableCell key={colId} align='left' sx={styles.cellPadding}>
              {review.product?.name || 'Không rõ sản phẩm'}
            </TableCell>
          )
        }

        if (colId === 'user') {
          return (
            <TableCell key={colId} align='left' sx={styles.cellPadding}>
              {review.user?.fullName || 'Ẩn danh'}
            </TableCell>
          )
        }

        if (colId === 'rating') {
          return (
            <TableCell key={colId} align='center' sx={styles.cellPadding}>
              {review.rating}
              <StarIcon sx={{ color: '#ffb400', fontSize: 18, ml: 0.5 }} />
            </TableCell>
          )
        }

        if (colId === 'comment') {
          return (
            <TableCell key={colId} align='left' sx={styles.cellPadding}>
              {review.comment || 'Không có nội dung'}
            </TableCell>
          )
        }

        if (colId === 'createdAt') {
          const date = new Date(review.createdAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
          return (
            <TableCell key={colId} align='left' sx={styles.cellPadding}>
              {date}
            </TableCell>
          )
        }

        if (colId === 'status') {
          const label =
            review.status === 'active'
              ? 'Hiển thị'
              : review.status === 'hidden'
                ? 'Đã ẩn'
                : 'Chưa duyệt'
          const color =
            review.status === 'active'
              ? 'success'
              : review.status === 'hidden'
                ? 'default'
                : 'warning'

          return (
            <TableCell key={colId} align='center' sx={styles.cellPadding}>
              <Chip
                label={label}
                color={color}
                sx={{ width: '110px', fontWeight: 'bold' }}
              />
            </TableCell>
          )
        }

        if (colId === 'action') {
          return (
            <TableCell key={colId} align='center' sx={styles.cellPadding}>
              <Stack direction='row' sx={styles.groupIcon}>
                {hasPermission('review:read') && (
                  <Tooltip title='Xem chi tiết'>
                    <IconButton
                      onClick={() => handleOpenModal('view', review)}
                      size='small'
                      color='primary'
                    >
                      <RemoveRedEyeIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {hasPermission('review:delete') && (
                  <Tooltip title='Xoá đánh giá'>
                    <IconButton
                      onClick={() => handleOpenModal('delete', review)}
                      size='small'
                      color='error'
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </TableCell>
          )
        }

        return (
          <TableCell key={colId} align={column.align} sx={styles.cellPadding}>
            {review[colId] ?? 'Không có dữ liệu'}
          </TableCell>
        )
      })}
    </TableRow>
  )
}
