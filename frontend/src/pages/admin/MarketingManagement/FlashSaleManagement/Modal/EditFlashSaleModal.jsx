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
  alpha
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
    const originalPrice = Number(product.originalPrice)

    if (!form.flashPrice || isNaN(flashPrice) || flashPrice <= 0) {
      errors.push('Giá Flash Sale phải là số dương')
    }
    if (flashPrice >= originalPrice) {
      errors.push('Giá Flash Sale phải thấp hơn giá gốc')
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
      await onSave(updatedProduct)
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi cập nhật sản phẩm.')
    } finally {
      setLoading(false)
    }
  }

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
                backgroundColor: '#fff'
              }
            }}
          />
          <TextField
            fullWidth
            label='Giá gốc'
            type='number'
            value={product?.originalPrice || ''}
            InputProps={{ readOnly: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#fff'
              }
            }}
          />
          <TextField
            fullWidth
            label='Giá Flash Sale *'
            type='number'
            value={form.flashPrice}
            onChange={handleChange}
            required
            inputProps={{ min: 0 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#fff'
              }
            }}
          />
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
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              transform: 'translateY(-1px)'
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