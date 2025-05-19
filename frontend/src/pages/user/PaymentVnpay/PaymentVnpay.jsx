import React from 'react'
import { Container, Box, Typography, Button } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useNavigate } from 'react-router-dom'

const PaymentVnpay = () => {

  const navigate = useNavigate()

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
            mb: 3,
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 50 }} />
        </Box>

        <Typography variant="h4" gutterBottom>
          Thanh toán thành công!
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          Cảm ơn bạn đã thanh toán qua VNPay. Đơn hàng của bạn đã được xử lý.
        </Typography>

        <Button variant="contained" color="primary" onClick={handleGoHome}>
          Quay về trang chủ
        </Button>
      </Container>
    </Box>
  )
}

export default PaymentVnpay
