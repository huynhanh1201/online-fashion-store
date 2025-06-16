import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider
} from '@mui/material'

export default function DeleteWarehouseModal({
  open,
  onClose,
  warehouse,
  onSave
}) {
  if (!warehouse) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Ẩn kho hàng</DialogTitle>
      <Divider />
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn ẩn kho <strong>{warehouse.code}</strong> này
          không?
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          onClick={onClose}
          color='inherit'
          sx={{ textTransform: 'none' }}
        >
          Hủy
        </Button>
        <Button
          onClick={() => {
            onSave(warehouse._id)
            onClose()
          }}
          color='error'
          variant='contained'
          sx={{ textTransform: 'none' }}
        >
          Ẩn
        </Button>
      </DialogActions>
    </Dialog>
  )
}
