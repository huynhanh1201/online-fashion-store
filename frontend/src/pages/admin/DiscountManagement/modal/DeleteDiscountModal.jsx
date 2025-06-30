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

const DeleteDiscountModal = ({ open, onClose, discount, onDelete }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!discount || !discount._id) return

    setLoading(true) // Bắt đầu quá trình xóa
    await onDelete(discount._id, 'delete') // Gọi hàm xóa từ props
    setLoading(false) // Kết thúc quá trình xóa
    onClose() // Đóng Chart sau khi xóa thành công
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
      <DialogTitle>Xoá mã giảm giá</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <Typography>
          Bạn có chắc muốn xoá mã giảm giá <strong>{discount.code}</strong> này
          không?
        </Typography>
        {loading && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <CircularProgress />
            <Typography variant='body2' sx={{ mt: 2 }}>
              Đang xoá...
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
          onClick={handleDelete}
          variant='contained'
          color='error'
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          {loading ? 'Đang xoá...' : 'Xoá'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDiscountModal
