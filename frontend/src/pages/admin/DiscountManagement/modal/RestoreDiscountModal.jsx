import React, { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

import StyleAdmin from '~/assets/StyleAdmin.jsx'

const RestoreDiscountModal = ({ open, onClose, discount, onRestore }) => {
  const [loading, setLoading] = useState(false)

  const handleRestore = async () => {
    if (!discount || !discount._id) return

    setLoading(true)
    try {
      await onRestore(discount._id, 'restore')
      onClose()
    } catch (err) {
      console.error('Khôi phục mã giảm giá thất bại:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Khôi phục mã giảm giá</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <Typography>
          Bạn có chắc muốn khôi phục mã{' '}
          <strong>{discount?.code || 'Không rõ'}</strong> này không?
        </Typography>
        {loading && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <CircularProgress />
            <Typography variant='body2' sx={{ mt: 2 }}>
              Đang khôi phục...
            </Typography>
          </div>
        )}
      </DialogContent>
      <Divider sx={{ my: 0 }} />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          color='inherit'
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleRestore}
          variant='contained'
          color='primary'
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          {loading ? 'Đang khôi phục...' : 'Khôi phục'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RestoreDiscountModal
