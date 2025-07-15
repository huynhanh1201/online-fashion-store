import React from 'react'
import { Modal, Box, Typography, Button } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4
}

export default function DeleteProductModal({
  open,
  onClose,
  product,
  onDelete
}) {
  const handleDelete = () => {
    onDelete(product)
    onClose()
  }

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
          Xác nhận xóa
        </Typography>
        <Typography>Bạn có chắc muốn xóa sản phẩm "{product.name}"?</Typography>
        <Box mt={3} display='flex' justifyContent='flex-end' gap={2}>
          <Button color='#001f5d' onClick={onClose}>
            Hủy
          </Button>
          <Button variant='contained' color='error' onClick={handleDelete}>
            Xóa
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
