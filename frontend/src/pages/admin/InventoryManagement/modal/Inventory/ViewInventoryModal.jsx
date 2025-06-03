import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Grid,
  Divider,
  Box
} from '@mui/material'

const ViewInventoryModal = ({ open, onClose, inventory }) => {
  const statusColor =
    inventory?.status === 'in-stock'
      ? 'success'
      : inventory?.status === 'low-stock'
        ? 'warning'
        : 'error'

  const statusLabel =
    inventory?.status === 'in-stock'
      ? 'Còn hàng'
      : inventory?.status === 'low-stock'
        ? 'Cảnh báo'
        : 'Hết hàng'
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Chi tiết tồn kho</DialogTitle>
      <DialogContent dividers>
        {inventory ? (
          <Box sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item size={6}>
                <Typography variant='body2' color='text.secondary'>
                  Mã biến thể
                </Typography>
                <Typography variant='subtitle1'>
                  {inventory.variantId.sku}
                </Typography>
              </Grid>
              <Grid item size={6}>
                <Typography variant='body2' color='text.secondary'>
                  kho hàng
                </Typography>
                <Typography variant='subtitle1'>
                  {inventory.warehouseId.name || 'N/A'}
                </Typography>
              </Grid>

              <Grid item size={6}>
                <Typography variant='body2' color='text.secondary'>
                  sản phẩm
                </Typography>
                <Typography variant='subtitle1'>
                  {inventory?.variantId.name || 'N/A'}
                </Typography>
              </Grid>
              <Grid item size={6}>
                <Typography variant='body2' color='text.secondary'>
                  Trạng thái
                </Typography>
                <Chip label={statusLabel} color={statusColor} size='small' />
              </Grid>

              <Grid item size={6}>
                <Typography variant='body2' color='text.secondary'>
                  Số lượng
                </Typography>
                <Typography variant='subtitle1'>
                  {inventory.quantity}
                </Typography>
              </Grid>
              <Grid item size={6}>
                <Typography variant='body2' color='text.secondary'>
                  Ngưỡng cảnh báo
                </Typography>
                <Typography variant='subtitle1'>
                  {inventory.minQuantity}
                </Typography>
              </Grid>

              <Grid item size={6}>
                <Typography variant='body2' color='text.secondary'>
                  Giá nhập
                </Typography>
                <Typography variant='subtitle1'>
                  {inventory.importPrice?.toLocaleString()}đ
                </Typography>
              </Grid>
              <Grid item size={6}>
                <Typography variant='body2' color='text.secondary'>
                  Giá bán
                </Typography>
                <Typography variant='subtitle1'>
                  {inventory.exportPrice?.toLocaleString()}đ
                </Typography>
              </Grid>

              <Grid item size={6}>
                <Typography variant='body2' color='text.secondary'>
                  Ngày tạo
                </Typography>
                <Typography variant='subtitle2'>
                  {inventory.createdAt
                    ? new Date(inventory.createdAt).toLocaleString('vi-VN')
                    : '—'}
                </Typography>
              </Grid>
              <Grid item size={6}>
                <Typography variant='body2' color='text.secondary'>
                  Ngày cập nhật
                </Typography>
                <Typography variant='subtitle2'>
                  {inventory.updatedAt
                    ? new Date(inventory.updatedAt).toLocaleString('vi-VN')
                    : '—'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Typography>Không có dữ liệu tồn kho</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined' color='primary'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewInventoryModal
