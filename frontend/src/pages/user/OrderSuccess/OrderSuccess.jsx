import React from 'react'
import { Container, Box, Typography, Button, Stack } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useNavigate } from 'react-router-dom'
import { useCart } from '~/hooks/useCarts'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const { refresh } = useCart()

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const handleGoHome = () => {
    navigate('/')
    setTimeout(() => {
      refresh()
    }, 0)
  }

  const handleGoOrders = () => {
    navigate('/orders')
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
            bgcolor: 'success.main',
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
          <CheckCircleOutlineIcon sx={{ fontSize: 50 }} />
        </Box>

        <Typography variant="h4" gutterBottom>
          Đặt hàng thành công!
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          Cảm ơn bạn đã mua sắm cùng chúng tôi. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
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
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'var(--primary-color)',
              '&:hover': {
                backgroundColor: 'var(--accent-color)',
              }
            }}
            onClick={handleGoOrders}
          >
            Đơn mua của bạn
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

export default OrderSuccess
