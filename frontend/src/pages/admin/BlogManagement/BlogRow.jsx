import {
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Avatar,
  Stack
} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import React from 'react'

const BlogRow = ({ index, post, onEdit, onDelete, onView }) => {
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
        <Avatar src={post.image || ''} alt={post.title} variant='rounded' />
      </TableCell>
      <TableCell sx={styles.cellPadding}>
        {post.title || 'Không có tiêu đề'}
      </TableCell>
      <TableCell sx={styles.cellPadding}>
        {post.content?.slice(0, 100) || 'Không có nội dung'}
      </TableCell>
      <TableCell sx={styles.cellPadding}>{post.createdAt}</TableCell>
      <TableCell sx={styles.cellPadding}>{post.updatedAt}</TableCell>
      <TableCell sx={styles.cellPadding}>
        <Chip
          label={post.isActive ? 'Hoạt động' : 'Ẩn'}
          color={post.isActive ? 'success' : 'default'}
          size='medium'
          sx={{ fontWeight: 600, width: 127 }}
        />
      </TableCell>
      <TableCell align='left' sx={styles.cellPadding}>
        <Stack direction='row' sx={styles.groupIcon}>
          <Tooltip title='Xem'>
            <IconButton
              onClick={() => onView(post)}
              size='small'
              color='primary'
            >
              <RemoveRedEyeIcon color='primary' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Sửa'>
            <IconButton onClick={() => onEdit(post)} size='small' color='info'>
              <BorderColorIcon color='warning' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Xoá'>
            <IconButton
              onClick={() => onDelete(post)}
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

export default BlogRow
