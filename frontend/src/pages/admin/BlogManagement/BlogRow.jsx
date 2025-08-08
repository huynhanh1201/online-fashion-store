import React, { useEffect, useState } from 'react'
import {
  TableRow,
  TableCell,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Stack,
  Tooltip
} from '@mui/material'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import usePermissions from '~/hooks/usePermissions'
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
    background: '#fff !important'
  }
}

const BlogRow = ({
  blog,
  onEdit,
  onDelete,
  onView,
  onRestore,
  filters,
  index
}) => {
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  const { hasPermission } = usePermissions()
  const [showRestoreIcon, setShowRestoreIcon] = useState(false)

  const destroyValue = filters?.destroy
  useEffect(() => {
    if (destroyValue === 'true') {
      setShowRestoreIcon(false)

      const timer = setTimeout(() => {
        setShowRestoreIcon(false)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      setShowRestoreIcon(true)
    }
  }, [destroyValue])
  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      <TableCell align='center' sx={{ ...styles.cellPadding, width: 50 }}>
        {index}
      </TableCell>
      <TableCell align='left' sx={styles.cellPadding}>
        <Avatar
          variant='rounded'
          src={blog.coverImage || ''}
          alt={blog.title}
          sx={{ width: 35, height: 35 }}
        />
      </TableCell>

      <TableCell
        align='left'
        title={blog.title}
        onClick={hasPermission('blog:read') ? () => onView(blog) : null}
        sx={{
          whiteSpace: 'nowrap',
          maxWidth: 300,
          ...styles.cellPadding,
          cursor: hasPermission('blog:read') ? 'pointer' : 'default'
        }}
      >
        {blog.title || 'Không có tiêu đề'}
      </TableCell>

      <TableCell align='left' sx={styles.cellPadding}>
        {blog.category || 'Không có chuyên mục'}
      </TableCell>

      <TableCell align='left' sx={styles.cellPadding}>
        {blog.author?.name || 'Không rõ'}
      </TableCell>

      <TableCell sx={styles.cellPadding}>
        <Chip
          size='large'
          sx={{ width: '127px', fontWeight: '800' }}
          label={
            blog.status === 'published'
              ? 'Đã xuất bản'
              : blog.status === 'draft'
                ? 'Bản nháp'
                : 'Lưu trữ'
          }
          color={
            blog.status === 'published'
              ? 'success'
              : blog.status === 'draft'
                ? 'warning'
                : 'default'
          }
        />
      </TableCell>

      <TableCell align='left' sx={styles.cellPadding}>
        {formatDate(blog.createdAt)}
      </TableCell>

      <TableCell align='left' sx={styles.cellPadding}>
        <Stack direction='row' sx={styles.groupIcon}>
          {hasPermission('blog:read') && (
            <Tooltip title='Xem'>
              <IconButton size='small' onClick={() => onView(blog)}>
                <RemoveRedEyeIcon color='primary' />
              </IconButton>
            </Tooltip>
          )}
          {showRestoreIcon === false ? (
            hasPermission('blog:restore') && (
              <Tooltip title='Khôi phục'>
                <IconButton size='small' onClick={() => onRestore(blog)}>
                  <RestartAltIcon color='success' />
                </IconButton>
              </Tooltip>
            )
          ) : (
            <>
              {hasPermission('blog:update') && (
                <Tooltip title='Sửa'>
                  <IconButton size='small' onClick={() => onEdit(blog)}>
                    <BorderColorIcon color='warning' />
                  </IconButton>
                </Tooltip>
              )}
              {hasPermission('blog:delete') && (
                <Tooltip title='Xoá'>
                  <IconButton size='small' onClick={() => onDelete(blog)}>
                    <DeleteForeverIcon color='error' />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  )
}

export default BlogRow
