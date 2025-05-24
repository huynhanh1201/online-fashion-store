import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import StyleAdmin from '~/assets/StyleAdmin.jsx'

const ViewColorModal = ({ open, onClose, color }) => {
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
      <DialogTitle>Xem thông tin màu</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <form id='view-color-form'>
          {/* Tên màu - chỉ đọc */}
          <TextField
            label='Tên màu'
            fullWidth
            margin='normal'
            defaultValue={color?.name || ''}
            InputProps={{
              readOnly: true
            }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />
        </form>
      </DialogContent>
      <Divider sx={{ my: 0 }} />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color='error' variant='contained'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewColorModal
