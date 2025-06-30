import React from 'react'
import { Container, Box, Typography, Button, Stack } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useNavigate } from 'react-router-dom'
import { useCart } from '~/hooks/useCarts'

const OrderFailed = () => {
  const navigate = useNavigate()
  const { refresh } = useCart()

  const handleGoHome = () => {
    navigate('/')
    setTimeout(() => {
      refresh()
    }, 0)
  }

  const handleGoCart = () => {
    navigate('/cart')
    setTimeout(() => {
      refresh()
    }, 0)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        bgcolor: '#f9f9f9'
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            bgcolor: 'error.main',
            color: 'white',
            width: 80,
            height: 80,
            mx: 'auto',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 50 }} />
        </Box>

        <Typography variant="h4" gutterBottom>
          Thanh toán thất bại!
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          Rất tiếc, đã có lỗi xảy ra khi xử lý thanh toán của bạn. Vui lòng kiểm tra lại thông tin thanh toán hoặc thử lại sau.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained"
            onClick={handleGoHome}
            sx={{
              backgroundColor: 'var(--primary-color)',
              '&:hover': {
                backgroundColor: 'var(--accent-color)',
              }
            }}
          >
            Quay về trang chủ
          </Button>
          <Button variant="contained" sx={{
            backgroundColor: 'var(--primary-color)',
            '&:hover': {
              backgroundColor: 'var(--accent-color)',
            }
          }}
            onClick={handleGoCart}>
            Quay về giỏ hàng
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

export default OrderFailed