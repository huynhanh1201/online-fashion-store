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
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '80vh',
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
      <DialogContent>
        <img
          src={optimizeCloudinaryUrl(imageSrc)}
          alt={productName}
          style={{
            width: '100%',
            height: '500px',
            objectFit: 'cover'
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
