import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import StyleAdmin from '~/components/StyleAdmin'

const ViewCategoryModal = ({ open, onClose, category }) => {
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
      <DialogTitle>Xem thông tin danh mục</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <form id='view-category-form'>
          {/* Tên danh mục - chỉ đọc */}
          <TextField
            label='Tên danh mục'
            fullWidth
            margin='normal'
            defaultValue={category.name}
            InputProps={{
              readOnly: true // Đặt trường này chỉ để đọc, không thể chỉnh sửa
            }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />
          {/* Mô tả - chỉ đọc */}
          <TextField
            label='Mô tả'
            fullWidth
            margin='normal'
            multiline
            minRows={3}
            defaultValue={category.description}
            InputProps={{
              readOnly: true // Đặt trường này chỉ để đọc, không thể chỉnh sửa
            }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />
        </form>
      </DialogContent>
      <Divider sx={{ my: 0 }} />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color='error' variant='contained'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewCategoryModal
