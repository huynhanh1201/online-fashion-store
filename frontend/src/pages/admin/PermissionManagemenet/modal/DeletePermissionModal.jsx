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
  onClose,
  onConfirm,
  permission
}) {
  const handleDelete = async () => {
    try {
      // await deletePermission(permission.key)
      onConfirm()
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle>Xóa quyền</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn xóa quyền <strong>{permission.label}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleDelete} color='error' variant='contained'>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  )
}
