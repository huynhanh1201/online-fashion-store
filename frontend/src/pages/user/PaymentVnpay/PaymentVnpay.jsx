import React, { useEffect } from 'react'

import { Container, Box, Typography, Button, Stack } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useNavigate } from 'react-router-dom'
import { useCart } from '~/hooks/useCarts'

const PaymentVnpay = () => {

  const navigate = useNavigate()
  const { refresh } = useCart()
  const handleGoHome = () => {
    navigate('/')
  }
  const handleGoOrders = () => {
    navigate('/orders')
    setTimeout(() => {
      refresh()
    }, 0)
  }
  useEffect(() => {
    setTimeout(() => {
      refresh()
    }, 0)
  }, [])

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
            width: 150,
            height: 150,
            mx: 'auto',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            p: 2,
            boxShadow: 3,
            backgroundColor: '#ffffff',
            border: '2px solid #e0e0e0',
          }}
        >
          <img
            src="https://vinadesign.vn/uploads/thumbnails/800/2023/05/vnpay-logo-vinadesign-25-12-59-16.jpg"
            alt="VNPay Logo"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: '50%',
            }}
          />
        </Box>



        <Typography variant="h4" gutterBottom>
          Thanh toán thành công!
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          Cảm ơn bạn đã thanh toán qua VNPay. Đơn hàng của bạn đã được xử lý.
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

          <Button variant="contained"
            sx={{
              backgroundColor: 'var(--primary-color)',
              '&:hover': {
                backgroundColor: 'var(--accent-color)',
              }
            }} onClick={handleGoOrders}>
            Đơn mua của bạn
          </Button>
        </Stack>

      </Container>
    </Box>
  )
}

export default PaymentVnpay
