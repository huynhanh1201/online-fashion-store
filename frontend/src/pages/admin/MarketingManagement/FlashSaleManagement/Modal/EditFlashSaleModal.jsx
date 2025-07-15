import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Box,
  Typography
} from '@mui/material'

const EditFlashSaleModal = ({ open, onClose, product, onSave }) => {
  const theme = useTheme()
  const [form, setForm] = useState({
    flashPrice: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        flashPrice: product.flashPrice || ''
      })
      setError('')
    }
  }, [product])

  const handleChange = (e) => {
    setForm({ ...form, flashPrice: e.target.value })
    setError('')
  }

  const validateForm = () => {
    const errors = []
    const flashPrice = Number(form.flashPrice)
    const originalPrice = Number(product?.originalPrice || 0)

    if (!form.flashPrice || isNaN(flashPrice) || flashPrice <= 0) {
      errors.push('Giá Flash Sale phải là số dương')
    }
    
    if (originalPrice > 0 && flashPrice >= originalPrice) {
      errors.push('Giá Flash Sale phải thấp hơn giá gốc')
    }

    // Kiểm tra giá flash sale không được quá thấp (ít nhất 10% giá gốc)
    if (originalPrice > 0 && flashPrice < originalPrice * 0.1) {
      errors.push('Giá Flash Sale không được thấp hơn 10% giá gốc')
    }

    // Kiểm tra giá flash sale phải là số nguyên
    if (flashPrice % 1 !== 0) {
      errors.push('Giá Flash Sale phải là số nguyên')
    }

    return errors
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const errors = validateForm()
    if (errors.length > 0) {
      setError(errors.join(', '))
      setLoading(false)
      return
    }

    try {
      const updatedProduct = {
        productId: product.productId,
        originalPrice: Number(product.originalPrice),
        flashPrice: Number(form.flashPrice)
      }
      
      console.log('Submitting updated product:', updatedProduct)
      await onSave(updatedProduct)
    } catch (err) {
      console.error('Error in EditFlashSaleModal:', err)
      setError(err.message || 'Có lỗi xảy ra khi cập nhật sản phẩm.')
    } finally {
      setLoading(false)
    }
  }

  // Kiểm tra nếu đang trong thời gian diễn ra flash sale
  const isActive = product && product.campaignStartTime && product.campaignEndTime && (new Date(product.campaignStartTime) <= new Date()) && (new Date(product.campaignEndTime) >= new Date());

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0'
        }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          py: 2,
          fontWeight: 700,
          color: '#1e293b'
        }}
      >
        Chỉnh sửa sản phẩm Flash Sale
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        {error && (
          <Alert
            severity='error'
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.error.main, 0.08),
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`
            }}
          >
            {error}
          </Alert>
        )}
        <Stack spacing={3}>
          <TextField
            fullWidth
            label='Tên sản phẩm'
            value={product?.productName || ''}
            InputProps={{ readOnly: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8fafc'
              }
            }}
          />
          <TextField
            fullWidth
            label='Giá gốc'
            type='number'
            value={product?.originalPrice ? Number(product.originalPrice).toLocaleString() : ''}
            InputProps={{ readOnly: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8fafc'
              }
            }}
          />
          {product?.originalDiscountPrice > 0 && (
            <TextField
              fullWidth
              label='Giá giảm ban đầu'
              type='number'
              value={Number(product.originalDiscountPrice).toLocaleString()}
              InputProps={{ readOnly: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8fafc'
                }
              }}
            />
          )}
          <TextField
            fullWidth
            label='Giá Flash Sale *'
            type='number'
            value={form.flashPrice}
            onChange={handleChange}
            required
            inputProps={{ 
              min: 0,
              step: 1000,
              placeholder: 'Nhập giá Flash Sale'
            }}
            helperText={`Giá phải thấp hơn giá gốc (${product?.originalPrice ? Number(product.originalPrice).toLocaleString() : 0}đ)`}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: isActive ? '#f1f5f9' : '#fff'
              }
            }}
            disabled={isActive}
          />
          {form.flashPrice && product?.originalPrice && (
            <Box sx={{ 
              p: 2, 
              backgroundColor: '#f0f9ff', 
              borderRadius: 2, 
              border: '1px solid #0ea5e9' 
            }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Thông tin giảm giá:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Giảm giá so với giá gốc: {Math.round(((Number(product.originalPrice) - Number(form.flashPrice)) / Number(product.originalPrice)) * 100)}%
              </Typography>
              {product?.originalDiscountPrice > 0 && (
                <Typography variant="body2" color="text.secondary">
                  • Giảm giá so với giá ban đầu: {Math.round(((Number(product.originalDiscountPrice) - Number(form.flashPrice)) / Number(product.originalDiscountPrice)) * 100)}%
                </Typography>
              )}
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          p: 2,
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0'
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            color: '#64748b',
            px: 3,
            py: 1,
            '&:hover': {
              backgroundColor: alpha(theme.palette.grey[500], 0.08)
            }
          }}
        >
          Hủy
        </Button>
        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1,
            background: 'var(--primary-color)',
            '&:hover': {
              background: 'var(--accent-color)'
            }
          }}
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditFlashSaleModal