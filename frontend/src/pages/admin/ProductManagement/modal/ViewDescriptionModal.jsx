import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box
} from '@mui/material'

export default function ViewDescriptionModal({ open, onClose, product }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xl'
      fullWidth
      PaperProps={{
        sx: {
          marginTop: '50px',
          // height: '85vh', // hoặc '600px' tùy ý
          maxHeight: '85vh', // đảm bảo không vượt quá
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle>Mô tả sản phẩm</DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            width: '100%',
            '& img': {
              width: '873px !important',
              height: '873px !important',
              display: 'block',
              margin: '8px auto',
              borderRadius: '6px',
              objectFit: 'contain'
            },
            '& p': {
              margin: '8px 0',
              lineHeight: 1.6,
              wordBreak: 'break-word'
            },
            '& ul, & ol': {
              paddingLeft: '20px',
              margin: '8px 0'
            },
            '& li': {
              marginBottom: '4px'
            },
            '& strong': {
              fontWeight: 600
            },
            '& em': {
              fontStyle: 'italic'
            },
            '& a': {
              color: '#1976d2',
              textDecoration: 'underline',
              wordBreak: 'break-all'
            },
            '& span': {
              wordBreak: 'break-word'
            },
            '& *': {
              boxSizing: 'border-box'
            }
          }}
          dangerouslySetInnerHTML={{ __html: product?.description || '' }}
        />
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          variant='outlined'
          color='error'
          sx={{ textTransform: 'none' }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
