import React, { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import styleAdmin from '~/assets/StyleAdmin.jsx'

const DeleteProductModal = ({ open, onClose, product, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!product) return null

  const handleConfirmDelete = async () => {
    setIsDeleting(true) // Bắt đầu trạng thái đang xoá
    try {
      await onDelete(product._id) // Giả sử onDelete là một async function
    } catch (error) {
      console.error('Xoá sản phẩm thất bại:', error)
    } finally {
      setIsDeleting(false) // Kết thúc trạng thái xoá
      onClose() // Đóng modal sau khi xoá thành công hoặc thất bại
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
      <DialogTitle>Xoá sản phẩm</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc muốn xoá sản phẩm <b>{product.name}</b> không?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color='#001f5d'>
          Hủy
        </Button>
        <Button
          onClick={handleConfirmDelete}
          color='error'
          variant='contained'
          disabled={isDeleting} // Vô hiệu hóa nút nếu đang xoá
        >
          {isDeleting ? 'Đang xoá...' : 'Xoá'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteProductModal
