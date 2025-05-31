import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material'

const AddVariantModal = ({
  open,
  onClose,
  addVariant,
  colors,
  sizes,
  products
}) => {
  const [variantData, setVariantData] = useState({
    productId: '',
    color: '',
    size: '',
    importPrice: '',
    exportPrice: '',
    overridePrice: false
  })

  const handleChange = (field, value) => {
    setVariantData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    const product = products.find((p) => p.id === variantData.productId)
    const color = colors.find((c) => c.name === variantData.color)
    const size = sizes.find((s) => s.name === variantData.size)

    if (!product || !color || !size) {
      alert('Vui lòng điền đầy đủ thông tin biến thể')
      return
    }

    const finalData = {
      productId: product.id,
      color,
      size,
      importPrice: Number(variantData.importPrice),
      exportPrice: Number(variantData.exportPrice),
      overridePrice: variantData.overridePrice
    }

    addVariant(finalData)
    onClose()
    setVariantData({
      productId: '',
      color: '',
      size: '',
      importPrice: '',
      exportPrice: '',
      overridePrice: false
    })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Thêm biến thể mới</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
      >
        <TextField
          select
          label='Sản phẩm'
          value={variantData.productId}
          onChange={(e) => handleChange('productId', e.target.value)}
          fullWidth
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label='Màu sắc'
          value={variantData.color}
          onChange={(e) => handleChange('color', e.target.value)}
          fullWidth
        >
          {Array.isArray(colors) &&
            colors.length === 0 &&
            colors.map((color) => (
              <MenuItem key={color.name} value={color.name}>
                {color.name}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          select
          label='Kích thước'
          value={variantData.size}
          onChange={(e) => handleChange('size', e.target.value)}
          fullWidth
        >
          {Array.isArray(sizes) &&
            sizes.length === 0 &&
            sizes.map((size) => (
              <MenuItem key={size.name} value={size.name}>
                {size.name}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          label='Giá nhập'
          type='number'
          value={variantData.importPrice}
          onChange={(e) => handleChange('importPrice', e.target.value)}
          fullWidth
        />

        <TextField
          label='Giá bán'
          type='number'
          value={variantData.exportPrice}
          onChange={(e) => handleChange('exportPrice', e.target.value)}
          fullWidth
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={variantData.overridePrice}
              onChange={(e) => handleChange('overridePrice', e.target.checked)}
            />
          }
          label='Ghi đè giá mặc định'
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant='contained' onClick={handleSave}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddVariantModal
