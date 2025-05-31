import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid
} from '@mui/material'

export default function ViewWarehouseModal({ open, onClose, warehouse }) {
  if (!warehouse) return null
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Chi tiết kho hàng</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {[
            { label: 'Mã kho', value: warehouse.code },
            { label: 'Tên kho', value: warehouse.name },
            { label: 'Địa chỉ', value: warehouse.address },
            { label: 'Phường', value: warehouse.ward },
            { label: 'Quận', value: warehouse.district },
            { label: 'Thành phố', value: warehouse.city }
          ].map((item, index) => (
            <Grid item size={12} sm={6} key={index}>
              <Typography variant='subtitle2'>{item.label}:</Typography>
              <Typography variant='body1'>{item.value || '-'}</Typography>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
