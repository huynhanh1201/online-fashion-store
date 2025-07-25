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
      maxWidth='xl' // Adjusted to a smaller maxWidth
      sx={{ '& .MuiDialog-paper': { width: 'auto', maxWidth: 'xl', minWidth: 600 } }}
      PaperProps={{
        sx: {
          marginTop: '50px',
          maxHeight: '90vh', // Reduced maxHeight for a more compact view
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle>Mô tả sản phẩm</DialogTitle>
      <DialogContent dividers sx={{ overflowY: 'auto' }}>
        {' '}
        {/* Added overflowY for scrollable content */}
        <Box
          className='content-selectable'
          sx={{
            width: '100%',
            '& img': {
              maxWidth: '100%', // Ensure images fit within the Chart
              height: 'auto',
              display: 'block',
              margin: '8px auto',
              borderRadius: '6px',
              objectFit: 'contain'
            },
            '& p': {
              margin: '8px 0',
              lineHeight: 1.4, // Reduced line height for compactness
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
        {' '}
        {/* Reduced padding for a more compact button area */}
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
