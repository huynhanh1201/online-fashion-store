import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box
} from '@mui/material'

export default function ViewPermissionModal({ open, onClose, permission }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Chi tiết quyền</DialogTitle>
      <DialogContent dividers>
        <Box>
          <Typography variant='body1'>
            <strong>Key:</strong> {permission.key}
          </Typography>
          <Typography variant='body1'>
            <strong>Tên hiển thị:</strong> {permission.label}
          </Typography>
          <Typography variant='body1'>
            <strong>Nhóm:</strong> {permission.group}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
