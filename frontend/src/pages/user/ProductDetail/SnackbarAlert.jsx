import React from 'react'
import { Snackbar, Alert, Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Link } from 'react-router-dom'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'


const SnackbarAlert = ({
  open,
  onClose,
  severity,
  message,
  variantImage,
  productName
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{
        vertical: isMobile ? 'bottom' : 'top',
        horizontal: isMobile ? 'center' : 'right'
      }}
      sx={{
        mt: isMobile ? 0 : 12,
        mb: isMobile ? 2 : 0,
        mx: isMobile ? 2 : 0,
        '& .MuiSnackbar-root': {
          width: isMobile ? 'calc(100% - 32px)' : 'auto'
        }
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: '100%',
          alignItems: 'flex-start',
          minWidth: isMobile ? '300px' : '350px',
          maxWidth: isMobile ? 'calc(100vw - 32px)' : '450px',
          padding: isMobile ? '8px 12px' : '16px'
        }}
      >
        {severity === 'success' ? (
          <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: isMobile ? 1 : 2,
            flexDirection: 'column',
            width: '100%'
          }}>
            {/* Product Info Row */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              width: '100%'
            }}>
              <img
                src={optimizeCloudinaryUrl(variantImage)}
                alt='Product'
                style={{
                  width: isMobile ? 36 : 50,
                  height: isMobile ? 36 : 50,
                  objectFit: 'cover',
                  borderRadius: '6px',
                  flexShrink: 0
                }}
                onError={(e) => (e.target.src = '/default.jpg')}
              />
              <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <Typography
                  variant={isMobile ? 'caption' : 'body2'}
                  fontWeight={600}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  }}
                >
                  {productName}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{
                    fontSize: isMobile ? '0.65rem' : '0.75rem',
                    opacity: 0.8,
                    display: 'block'
                  }}
                >
                  {message}
                </Typography>
              </Box>
            </Box>

            {/* Button Row */}
            <Box sx={{
              width: '100%',
              display: 'flex',
              justifyContent: isMobile ? 'stretch' : 'flex-end'
            }}>
              <Button
                component={Link}
                to='/cart'
                variant='contained'
                size='small'
                startIcon={<ShoppingCartIcon sx={{ fontSize: isMobile ? '14px' : '16px' }} />}
                sx={{
                  backgroundColor: 'var(--surface-color)',
                  color: 'var(--primary-color)',
                  fontSize: isMobile ? '0.65rem' : '0.75rem',
                  padding: isMobile ? '6px 12px' : '6px 16px',
                  minWidth: isMobile ? '100%' : '120px',
                  height: isMobile ? '32px' : '36px',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    backgroundColor: 'var(--surface-color)',
                    opacity: 0.9
                  }
                }}
              >
                Xem giỏ hàng
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography
            variant='body2'
            sx={{
              fontSize: isMobile ? '0.8rem' : '0.875rem',
              lineHeight: 1.4,
              wordBreak: 'break-word'
            }}
          >
            {message}
          </Typography>
        )}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarAlert
