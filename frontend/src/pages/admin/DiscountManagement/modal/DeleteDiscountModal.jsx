import React, { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

import StyleAdmin from '~/components/StyleAdmin'

const DeleteDiscountModal = ({ open, onClose, discount, onDelete }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!discount || !discount._id) return

    setLoading(true) // Bắt đầu quá trình xóa
    await onDelete(discount._id)
    setLoading(false) // Kết thúc quá trình xóa
    onClose() // Đóng modal sau khi xóa thành công
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
      <DialogTitle>Xóa mã giảm giá</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <Typography>
          Bạn có chắc muốn xóa mã giảm giá <strong>{discount.code}</strong>?
        </Typography>
        {loading && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <CircularProgress />
            <Typography variant='body2' sx={{ mt: 2 }}>
              Đang xóa...
            </Typography>
          </div>
        )}
      </DialogContent>
      <Divider sx={{ my: 0 }} />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color='inherit' disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleDelete}
          variant='contained'
          color='error'
          disabled={loading} // Disable nút xóa khi đang xử lý
        >
          {loading ? 'Đang xóa...' : 'Xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDiscountModal
