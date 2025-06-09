import React from 'react'
import {
  Typography,
  Button,
  Box,
  Container,
  TextField,
  InputAdornment,
  Divider
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

function Footer() {
  return (
    <>
      {/* Footer */}
      <Box sx={{ bgcolor: '#1A3C7B', color: 'white', pt: 4, pb: 2 }}>
        <Container maxWidth='lg'>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              gap: 4,
              mb: 3
            }}
          >
            {/* Logo và giới thiệu */}
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 700 }}>
                ICONDEWIM™
              </Typography>
              <Typography variant='body2' sx={{ mt: 1, maxWidth: 280 }}>
                Thương hiệu thời trang hàng đầu dành cho giới trẻ hiện đại. Chất
                lượng - Phong cách - Giá trị.
              </Typography>
            </Box>

            {/* Liên kết nhanh */}
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                Liên kết nhanh
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Button
                  color='inherit'
                  size='small'
                  href='/'
                  sx={{ color: 'white', textTransform: 'none' }}
                >
                  Trang chủ
                </Button>
                <Button
                  color='inherit'
                  size='small'
                  href='/products'
                  sx={{ color: 'white', textTransform: 'none' }}
                >
                  Sản phẩm
                </Button>
                <Button
                  color='inherit'
                  size='small'
                  href='/about'
                  sx={{ color: 'white', textTransform: 'none' }}
                >
                  Giới thiệu
                </Button>
                <Button
                  color='inherit'
                  size='small'
                  href='/contact'
                  sx={{ color: 'white', textTransform: 'none' }}
                >
                  Liên hệ
                </Button>
              </Box>
            </Box>

            {/* Liên hệ */}
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                Liên hệ
              </Typography>
              <Typography variant='body2' sx={{ mt: 1 }}>
                Email: support@icondewim.com
              </Typography>
              <Typography variant='body2'>SĐT: 0901 234 567</Typography>
              <Typography variant='body2'>
                Địa chỉ: 123 Fashion St, HCM
              </Typography>
            </Box>

            {/* Tìm kiếm */}
            <Box sx={{ maxWidth: 250 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                Tìm kiếm nhanh
              </Typography>
              <TextField
                fullWidth
                size='small'
                placeholder='Tìm kiếm sản phẩm...'
                variant='outlined'
                sx={{
                  mt: 1,
                  bgcolor: 'white',
                  borderRadius: '4px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 2 }} />

          <Typography variant='body2' align='center'>
            © 2025 ICONDEWIM™ - All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  )
}

export default Footer
