import React from 'react'
import { Box, Typography, Button } from '@mui/material'

const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: '#f9f9f9',
        textAlign: { xs: 'center', md: 'left' },
        px: 2
      }}
    >
      {/* Image */}
      <Box
        component='img'
        src='https://vk.com/sticker/1-54545-512' // 👈 Đổi thành đường dẫn ảnh của bạn
        alt='404 character'
        sx={{
          width: { xs: 200, md: 300 },
          mb: { xs: 3, md: 0 },
          mr: { md: 4 }
        }}
      />

      {/* Text EditContent */}
      <Box>
        <Typography variant='h3' fontWeight='bold' gutterBottom>
          OOPS! PAGE
          <br />
          NOT FOUND.
        </Typography>
        <Typography
          variant='body1'
          sx={{ mb: 3, maxWidth: 400, fontSize: '24px' }}
        >
          Có lẽ bạn đã tìm sai đường dẫn vì chúng tôi không thể tìm thấy trang
          bạn đang tìm kiếm!
        </Typography>
        <Button
          variant='contained'
          color='primary'
          href='/'
          sx={{ textTransform: 'none', fontWeight: 'bold' }}
        >
          Trở về trang chủ
        </Button>
      </Box>
    </Box>
  )
}

export default NotFound
