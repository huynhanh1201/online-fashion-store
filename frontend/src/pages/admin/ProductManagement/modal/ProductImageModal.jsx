import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { Divider } from '@mui/material'

import styleAdmin from '~/assets/StyleAdmin.jsx'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
const ProductImageModal = ({ open, onClose, imageSrc, productName }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xl'
      sx={{
        '& .MuiDialog-paper': {
          width: 'auto', // Chiều rộng theo nội dung
          maxWidth: 'xl', // Giới hạn không vượt quá md
          minWidth: 600 // (tuỳ chọn) đảm bảo không quá nhỏ
        }
      }}
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
      BackdropProps={{
        sx: styleAdmin.OverlayModal
      }}
    >
      {/* ===== Header ===== */}
      <DialogTitle sx={{ position: 'relative', pr: 6 }}>
        Ảnh sản phẩm
        {/*<IconButton*/}
        {/*  onClick={onClose}*/}
        {/*  sx={{*/}
        {/*    position: 'absolute',*/}
        {/*    top: 8,*/}
        {/*    right: 8,*/}
        {/*    width: 48,*/}
        {/*    height: 48*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <CloseIcon />*/}
        {/*</IconButton>*/}
      </DialogTitle>
      <Divider />
      {/* ===== EditContent ===== */}
      <DialogContent
        sx={{ flex: 1, display: 'flex', justifyContent: 'center', p: 0 }}
      >
        <img
          src={imageSrc}
          alt={productName}
          style={{
            width: '100%',
            height: '500px',
            objectFit: 'contain',
            backgroundColor: '#ccc'
          }}
        />
      </DialogContent>
      <Divider />
      {/* ===== Footer ===== */}
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          color='error'
          variant='outlined'
          sx={{ textTransform: 'none' }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductImageModal
