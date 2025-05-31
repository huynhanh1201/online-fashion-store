// modal/Variant/ViewVariantModal.jsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material'

const ViewVariantModal = ({ open, onClose, variant, products }) => {
  if (!variant) return null

  const product = products.find((p) => p.id === variant.productId)

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Chi tiết biến thể</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant='subtitle1'>
            <strong>SKU:</strong> {variant.sku || 'N/A'}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Tên biến thể:</strong> {variant.name || 'N/A'}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Màu sắc:</strong> {variant.color?.name || 'N/A'}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Kích thước:</strong> {variant.size?.name || 'N/A'}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Giá nhập:</strong>{' '}
            {variant.importPrice
              ? variant.importPrice.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })
              : 'N/A'}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Giá bán:</strong>{' '}
            {variant.exportPrice
              ? variant.exportPrice.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })
              : 'N/A'}
          </Typography>
          <Typography variant='subtitle1'>
            <strong>Sản phẩm:</strong>{' '}
            {variant.productName || product?.name || 'N/A'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewVariantModal
