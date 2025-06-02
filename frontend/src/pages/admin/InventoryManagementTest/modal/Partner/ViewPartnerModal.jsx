import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip
} from '@mui/material'

const getPartnerTypeLabel = (type) => {
  switch (type) {
    case 'supplier':
      return <Chip label='Nhà cung cấp' color='primary' size='small' />
    case 'customer':
      return <Chip label='Khách hàng' color='success' size='small' />
    case 'both':
      return <Chip label='Khách hàng & NCC' color='warning' size='small' />
    default:
      return <Chip label='Không xác định' size='small' />
  }
}

export default function ViewPartnerModal({ open, onClose, partner }) {
  if (!partner) return null
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Thông tin đối tác</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant='subtitle1'>
            <strong>Tên:</strong> {partner.name || '---'}
          </Typography>
          <Typography
            variant='subtitle1'
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <strong>Loại:</strong> {getPartnerTypeLabel(partner.type)}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Điện thoại:</strong> {partner.contact?.phone || '---'}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Email:</strong> {partner.contact?.email || '---'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='contained'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
