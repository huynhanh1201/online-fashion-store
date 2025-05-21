import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import StyleAdmin from '~/assets/StyleAdmin.jsx'

const ViewDiscountModal = ({ open, onClose, discount }) => {
  if (!discount) return null
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='lg'
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Chi tiết mã giảm giá</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <Box display='flex' gap={4} flexDirection={{ xs: 'column', md: 'row' }}>
          {/* Cột trái */}
          <Box flex={1}>
            <TextField
              label='Mã giảm giá'
              value={discount.code}
              fullWidth
              margin='normal'
              InputProps={{ readOnly: true }}
              sx={{
                ...StyleAdmin.InputCustom,
                ...StyleAdmin.InputCustom.CursorNone
              }}
            />
            <TextField
              label='Loại giảm giá'
              value={
                discount.type === 'fixed'
                  ? 'Giảm theo số tiền'
                  : 'Giảm theo phần trăm'
              }
              fullWidth
              margin='normal'
              InputProps={{ readOnly: true }}
              sx={{
                ...StyleAdmin.InputCustom,
                ...StyleAdmin.InputCustom.CursorNone
              }}
            />
            <TextField
              label={
                discount.type === 'fixed'
                  ? 'Giá trị giảm (VNĐ)'
                  : 'Giá trị giảm (%)'
              }
              value={discount.amount}
              type='number'
              fullWidth
              margin='normal'
              InputProps={{ readOnly: true }}
              sx={{
                ...StyleAdmin.InputCustom,
                ...StyleAdmin.InputCustom.CursorNone
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={discount.isActive}
                  InputProps={{ readOnly: true }}
                />
              }
              label='Kích hoạt'
            />
          </Box>

          {/* Cột phải */}
          <Box flex={1}>
            <TextField
              label='Giá trị đơn hàng tối thiểu'
              value={discount.minOrderValue}
              type='number'
              fullWidth
              margin='normal'
              InputProps={{ readOnly: true }}
              sx={{
                ...StyleAdmin.InputCustom,
                ...StyleAdmin.InputCustom.CursorNone
              }}
            />
            <TextField
              label='Số lượt sử dụng tối đa'
              value={discount.usageLimit}
              type='number'
              fullWidth
              margin='normal'
              InputProps={{ readOnly: true }}
              sx={{
                ...StyleAdmin.InputCustom,
                ...StyleAdmin.InputCustom.CursorNone
              }}
            />
            <TextField
              label='Số lượt còn lại'
              value={discount.usageLimit - discount.usedCount}
              type='number'
              fullWidth
              margin='normal'
              InputProps={{ readOnly: true }}
              sx={{
                ...StyleAdmin.InputCustom,
                ...StyleAdmin.InputCustom.CursorNone
              }}
            />
            <TextField
              label='Hiệu lực từ'
              value={new Date(discount.validFrom).toLocaleString()}
              type='text'
              fullWidth
              margin='normal'
              InputProps={{ readOnly: true }}
              sx={{
                ...StyleAdmin.InputCustom,
                ...StyleAdmin.InputCustom.CursorNone
              }}
            />
            <TextField
              label='Hiệu lực đến'
              value={new Date(discount.validUntil).toLocaleString()}
              type='text'
              fullWidth
              margin='normal'
              InputProps={{ readOnly: true }}
              sx={{
                ...StyleAdmin.InputCustom,
                ...StyleAdmin.InputCustom.CursorNone
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <Divider sx={{ my: 0 }} />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} variant='contained' color='error'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewDiscountModal
