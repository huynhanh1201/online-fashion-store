import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Grid,
  Typography
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const AddFlashSale = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({
    enabled: true,
    title: '',
    startTime: '',
    endTime: '',
    products: []
  })

  useEffect(() => {
    if (initialData) {
      setForm(initialData)
    }
  }, [initialData])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleProductChange = (index, field, value) => {
    const updated = [...form.products]
    updated[index][field] = value
    setForm((prev) => ({ ...prev, products: updated }))
  }

  const handleAddProduct = () => {
    setForm((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { productId: '', originalPrice: '', flashPrice: '' }
      ]
    }))
  }

  const handleRemoveProduct = (index) => {
    const updated = [...form.products]
    updated.splice(index, 1)
    setForm((prev) => ({ ...prev, products: updated }))
  }

  const handleSave = () => {
    onSave(form)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        {initialData ? 'Chỉnh sửa Flash Sale' : 'Thêm Flash Sale'}
      </DialogTitle>
      <DialogContent dividers>
        <FormControlLabel
          control={
            <Checkbox
              checked={form.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
            />
          }
          label='Kích hoạt Flash Sale'
        />

        <TextField
          fullWidth
          label='Tiêu đề'
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          margin='normal'
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type='datetime-local'
              label='Thời gian bắt đầu'
              value={form.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type='datetime-local'
              label='Thời gian kết thúc'
              value={form.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Typography variant='h6' mt={3}>
          Sản phẩm Flash Sale
        </Typography>
        {form.products.map((product, index) => (
          <Grid container spacing={2} key={index} alignItems='center' mt={1}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label='Product ID'
                value={product.productId}
                onChange={(e) =>
                  handleProductChange(index, 'productId', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label='Giá gốc'
                type='number'
                value={product.originalPrice}
                onChange={(e) =>
                  handleProductChange(index, 'originalPrice', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label='Giá Flash Sale'
                type='number'
                value={product.flashPrice}
                onChange={(e) =>
                  handleProductChange(index, 'flashPrice', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={3}>
              <IconButton onClick={() => handleRemoveProduct(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button variant='outlined' onClick={handleAddProduct} sx={{ mt: 2 }}>
          Thêm sản phẩm
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave} variant='contained'>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddFlashSale
