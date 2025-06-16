import React, { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import StyleAdmin from '~/assets/StyleAdmin.jsx'

const DeleteCategoryModal = ({ open, onClose, category, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(category._id) // Đợi quá trình xoá hoàn tất
      onClose()
    } catch (error) {
      console.error('Xoá thất bại:', error)
    } finally {
      setIsDeleting(false)
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
      <DialogTitle>Xoá danh mục sản phẩm</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        Bạn có chắc chắn muốn xoá danh mục <strong>{category.name}</strong> này
        không?
      </DialogContent>
      <Divider sx={{ my: 0 }} />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          color='inherit'
          disabled={isDeleting}
          sx={{ textTransform: 'none' }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleDelete}
          color='error'
          variant='contained'
          disabled={isDeleting}
          sx={{ textTransform: 'none' }}
        >
          {isDeleting ? 'Đang xoá...' : 'Xoá'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteCategoryModal
