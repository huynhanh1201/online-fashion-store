import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'

export default function DeleteWarehouseModal({
  open,
  onClose,
  warehouse,
  onSave
}) {
  if (!warehouse) return null

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xoá kho hàng</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xoá kho <strong>{warehouse.code}</strong> không?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined'>
          Hủy
        </Button>
        <Button
          onClick={() => {
            onSave(warehouse._id)
            onClose()
          }}
          color='error'
          variant='contained'
        >
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  )
}
