import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material'

function ViewAddressDialog({ open, onClose, address }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Xem địa chỉ</DialogTitle>
      <DialogContent>
        {address && (
          <>
            <TextField
              margin='dense'
              label='Họ và tên'
              fullWidth
              value={address.fullName}
              InputProps={{ readOnly: true }}
            />
            <TextField
              margin='dense'
              label='Số điện thoại'
              fullWidth
              value={address.phone}
              InputProps={{ readOnly: true }}
            />
            <TextField
              margin='dense'
              label='Số nhà, tên đường'
              fullWidth
              value={address.address}
              InputProps={{ readOnly: true }}
            />
            <TextField
              margin='dense'
              label='Phường/Xã'
              fullWidth
              value={address.ward}
              InputProps={{ readOnly: true }}
            />
            <TextField
              margin='dense'
              label='Quận/Huyện'
              fullWidth
              value={address.district}
              InputProps={{ readOnly: true }}
            />
            <TextField
              margin='dense'
              label='Tỉnh/Thành phố'
              fullWidth
              value={address.city}
              InputProps={{ readOnly: true }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewAddressDialog
