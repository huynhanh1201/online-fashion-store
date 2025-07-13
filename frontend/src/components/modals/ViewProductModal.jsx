import React from 'react'
import { Modal, Box, Typography } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4
}

export default function ViewProductModal({ open, onClose, product }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '14px'
        }
      }}
    >
      <Box sx={style}>
        <Typography variant='h6' mb={2}>
          Thông tin sản phẩm
        </Typography>
        <Typography>
          <strong>Tên:</strong> {product.name}
        </Typography>
        <Typography>
          <strong>Mô tả:</strong> {product.description}
        </Typography>
        <Typography>
          <strong>Giá:</strong> {product.price} VND
        </Typography>
        <Typography>
          <strong>Ngày thêm:</strong> {product.createdAt}
        </Typography>
        <Typography>
          <strong>Ngày cập nhật:</strong> {product.updatedAt}
        </Typography>
      </Box>
    </Modal>
  )
}
