import React, { useEffect } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Typography,
  Chip,
  Box
} from '@mui/material'

import StyleAdmin from '~/assets/StyleAdmin.jsx'

const ViewUserModal = React.memo(({ open, onClose, user }) => {
  useEffect(() => {
    if (!open) {
      // Reset dữ liệu khi đóng modal
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      BackdropProps={{ sx: StyleAdmin.OverlayModal }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Chi tiết người dùng</DialogTitle>
      <DialogContent>
        {user ? (
          <Box sx={{ mt: 1 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Tên người dùng</strong>
                  </TableCell>
                  <TableCell>{user.name || '—'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>{user.email || '—'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Quyền</strong>
                  </TableCell>
                  <TableCell>
                    {user.role === 'admin' ? 'QUẢN TRỊ' : 'KHÁCH HÀNG'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Ngày tạo</strong>
                  </TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                      : '—'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Ngày cập nhật</strong>
                  </TableCell>
                  <TableCell>
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                      : '—'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Typography>Không có dữ liệu người dùng</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} variant='contained' color='error'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default ViewUserModal
