import React, { useEffect } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'

import StyleAdmin from '~/components/StyleAdmin'

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
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Chi tiết người dùng</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <TextField
          label='Tên người dùng'
          fullWidth
          margin='normal'
          value={user?.name || ''}
          InputProps={{ readOnly: true }}
          sx={{
            ...StyleAdmin.InputCustom,
            ...StyleAdmin.InputCustom.CursorNone
          }}
        />
        <TextField
          label='Email'
          fullWidth
          margin='normal'
          value={user?.email || ''}
          InputProps={{ readOnly: true }}
          sx={{
            ...StyleAdmin.InputCustom,
            ...StyleAdmin.InputCustom.CursorNone
          }}
        />
        <TextField
          label='Quyền'
          fullWidth
          margin='normal'
          value={user?.role === 'admin' ? 'QUẢN TRỊ' : 'KHÁCH HÀNG'}
          InputProps={{ readOnly: true }}
          sx={{
            ...StyleAdmin.InputCustom,
            ...StyleAdmin.InputCustom.CursorNone
          }}
        />
        <TextField
          label='Ngày tạo'
          fullWidth
          margin='normal'
          value={
            user?.createdAt ? new Date(user.createdAt).toLocaleString() : ''
          }
          InputProps={{ readOnly: true }}
          sx={{
            ...StyleAdmin.InputCustom,
            ...StyleAdmin.InputCustom.CursorNone
          }}
        />
        <TextField
          label='Ngày cập nhật'
          fullWidth
          margin='normal'
          value={
            user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : ''
          }
          InputProps={{ readOnly: true }}
          sx={{
            ...StyleAdmin.InputCustom,
            ...StyleAdmin.InputCustom.CursorNone
          }}
        />
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} variant='contained' color='error'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default ViewUserModal
