import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'

export default function DeletePermissionModal({
  open,
  permission,
  onClose,
  onConfirm
}) {
  if (!permission) return null

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xóa quyền</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc muốn xóa quyền <strong>{permission.label}</strong>?
        </Typography>
        <Typography color='error' sx={{ mt: 2 }}>
          Hành động này không thể hoàn tác.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={onConfirm} variant='contained' color='error'>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  )
}
