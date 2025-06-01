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

const ViewBatchModal = ({ open, onClose, batch }) => {
  if (!batch) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Chi Tiết Lô Hàng</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant='subtitle2'>Mã lô:</Typography>
            <Typography>{batch.batchCode}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='subtitle2'>ID Biến thể:</Typography>
            <Typography>{batch.variantId}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='subtitle2'>Số lượng:</Typography>
            <Typography>{batch.quantity}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='subtitle2'>Giá nhập:</Typography>
            <Typography>{batch.importPrice}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewBatchModal
