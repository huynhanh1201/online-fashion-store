import React from 'react'
import { Snackbar, Alert, Box, Typography, Button } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'

import { Link } from 'react-router-dom'

const SnackbarAlert = ({
  open,
  onClose,
  severity,
  message,
  variantImage,
  productName
}) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    sx={{ mt: 12 }}
  >
    <Alert
      onClose={onClose}
      severity={severity}
      sx={{ width: '100%', alignItems: 'center' }}
    >
      {severity === 'success' ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img
            src={optimizeCloudinaryUrl(variantImage)}
            alt='Product'
            style={{
              width: 50,
              height: 50,
              objectFit: 'cover',
              borderRadius: '6px'
            }}
            onError={(e) => (e.target.src = '/default.jpg')}
          />
          <Box>
            <Typography
              variant='body2'
              fontWeight={600}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '200px'
              }}
            >
              {productName}
            </Typography>
            <Typography variant='caption'>{message}</Typography>
          </Box>
          <Button
            component={Link}
            to='/cart'
            variant='contained'
            size='small'
            startIcon={<ShoppingCartIcon />}
            sx={{
              ml: 2,
              backgroundColor: 'var(--surface-color)',
              color: 'var(--primary-color)'
            }}
          >
            Xem giỏ hàng
          </Button>
        </Box>
      ) : (
        <Typography variant='body2'>{message}</Typography>
      )}
    </Alert>
  </Snackbar>
)

export default SnackbarAlert
