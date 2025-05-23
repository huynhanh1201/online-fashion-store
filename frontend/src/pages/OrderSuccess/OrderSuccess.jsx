import React, { useEffect } from 'react'
import { Container, Box, Typography, Button } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useNavigate } from 'react-router-dom'
import { useCart } from '~/hooks/useCarts'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const { refresh } = useCart()

  useEffect(() => {
    setTimeout(() => {
      refresh()
    }, 0)
  }, [])

  const handleGoHome = () => {
    navigate('/')
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

        <Button variant="contained" color="primary" onClick={handleGoHome}>
          Quay về trang chủ
        </Button>
      </Container>
    </Box>
  )
}

export default OrderSuccess
