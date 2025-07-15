import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

const ViewAccountModal = ({ open, onClose, user, roles }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Không có thông tin'
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
      BackdropProps={{ sx: StyleAdmin.OverlayModal }}
    >
      <DialogTitle>Thông tin tài khoản</DialogTitle>
      <Divider />
      <DialogContent sx={{ maxHeight: '69vh' }}>
        {user ? (
          <Box
            display='flex'
            gap={3}
            flexDirection={{ xs: 'column', sm: 'row' }}
          >
            {/* Avatar trái */}
            <Box
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              border='2px dashed #ccc'
              borderRadius={2}
              minHeight={200}
              sx={{
                backgroundColor: '#fafafa',
                width: 300,
                height: 300
              }}
            >
              {user.avatarUrl ? (
                <Avatar
                  src={optimizeCloudinaryUrl(user.avatarUrl)}
                  alt={user.name}
                  sx={{ width: '100%', height: '100%', borderRadius: '0' }}
                />
              ) : (
                <Box textAlign='center' color='#999'>
                  <ImageNotSupportedIcon fontSize='large' />
                  <Typography fontSize={14} mt={1}>
                    Không có ảnh đại diện
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Thông tin phải */}
            <Box flex={1}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>
                      Tên tài khoản
                    </TableCell>
                    <TableCell>{user.name || '—'}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell>{user.email || '—'}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Vai trò</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          roles.find((r) => r.name === user?.role)?.label ||
                          'Không có vai trò'
                        }
                        size='medium'
                        sx={{
                          maxWidth: 300,
                          fontWeight: 800,
                          backgroundColor: 'var(--primary-color)',
                          color: '#fff',
                          textTransform: 'uppercase'
                        }}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Ngày cập nhật
                    </TableCell>
                    <TableCell>{formatDate(user.updatedAt)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Box>
        ) : (
          <Typography>Không có dữ liệu người dùng</Typography>
        )}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          color='error'
          variant='outlined'
          sx={{ textTransform: 'none' }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewAccountModal
