import React, { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import styleAdmin from '~/assets/StyleAdmin.jsx'

const RestoreProductModal = ({ open, onClose, product, onRestore }) => {
  const [isRestoring, setIsRestoring] = useState(false)

  if (!product) return null

  const handleConfirmRestore = async () => {
    setIsRestoring(true)
    try {
      await onRestore(product._id, 'restore')
    } catch (error) {
      console.error('Khôi phục sản phẩm thất bại:', error)
    } finally {
      setIsRestoring(false)
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      BackdropProps={{
        sx: styleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Khôi phục sản phẩm</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc muốn <strong>khôi phục</strong> sản phẩm{' '}
          <strong>{product.name}</strong> này không?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color='inherit'>
          Hủy
        </Button>
        <Button
          onClick={handleConfirmRestore}
          color='primary'
          variant='contained'
          disabled={isRestoring}
          sx={{ textTransform: 'none' }}
        >
          {isRestoring ? 'Đang khôi phục...' : 'Khôi phục'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RestoreProductModal
