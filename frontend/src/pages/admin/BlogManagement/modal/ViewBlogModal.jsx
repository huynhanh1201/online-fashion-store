import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip
} from '@mui/material'
import dayjs from 'dayjs'

const ViewBlogModal = ({ open, onClose, post }) => {
  if (!post) return null

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Xem chi tiết bài viết</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Ảnh bài viết */}
          <Box
            sx={{
              width: 180,
              height: 180,
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid #ccc',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {post.image ? (
              <img
                src={post.image}
                alt='Ảnh bài viết'
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Typography variant='caption' color='text.secondary'>
                Không có ảnh
              </Typography>
            )}
          </Box>

          {/* Bảng thông tin */}
          <Box sx={{ flex: 1 }}>
            <Table size='small'>
              <TableBody>
                <TableRow>
                  <TableCell variant='head'>
                    <strong>Tiêu đề</strong>
                  </TableCell>
                  <TableCell>{post.title || 'Không có dữ liệu'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>
                    <strong>Nội dung</strong>
                  </TableCell>
                  <TableCell>{post.content || 'Không có dữ liệu'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>
                    <strong>Trạng thái</strong>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={post.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      color={post.isActive ? 'success' : 'default'}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>
                    <strong>Ngày tạo</strong>
                  </TableCell>
                  <TableCell>
                    {post.createdAt
                      ? dayjs(post.createdAt).format('DD/MM/YYYY HH:mm')
                      : 'Không có dữ liệu'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>
                    <strong>Ngày cập nhật</strong>
                  </TableCell>
                  <TableCell>
                    {post.updatedAt
                      ? dayjs(post.updatedAt).format('DD/MM/YYYY HH:mm')
                      : 'Không có dữ liệu'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined' color='error'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewBlogModal
