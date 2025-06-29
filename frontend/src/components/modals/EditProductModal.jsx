import React, { useState } from 'react'
import { Modal, Box, Typography, TextField, Button } from '@mui/material'

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

export default function EditProductModal({ open, onClose, product, onSave }) {
  const [updatedProduct, setUpdatedProduct] = useState(product)

  const handleChange = (e) => {
    const { name, value } = e.target
    setUpdatedProduct({ ...updatedProduct, [name]: value })
  }

  const handleSubmit = () => {
    onSave(updatedProduct)
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
          Chỉnh sửa sản phẩm
        </Typography>
        <TextField
          label='Tên sản phẩm'
          name='name'
          fullWidth
          value={updatedProduct.name}
          onChange={handleChange}
          margin='normal'
        />
        <TextField
          label='Mô tả'
          name='description'
          fullWidth
          value={updatedProduct.description}
          onChange={handleChange}
          margin='normal'
        />
        <TextField
          label='Giá'
          name='price'
          type='number'
          fullWidth
          value={updatedProduct.price}
          onChange={handleChange}
          margin='normal'
        />
        <Box mt={2} display='flex' justifyContent='flex-end' gap={2}>
          <Button color='#001f5d' onClick={onClose}>
            Hủy
          </Button>
          <Button
            sx={{ backgroundColor: 'var(--primary-color)' }}
            variant='contained'
            onClick={handleSubmit}
          >
            Lưu
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
