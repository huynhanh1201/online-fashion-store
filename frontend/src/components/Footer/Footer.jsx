import React from 'react'
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Stack,
  IconButton,
  InputAdornment
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SearchIcon from '@mui/icons-material/Search'

function Footer() {
  return (
    <Box
      sx={{ bgcolor: '#002f6c', color: 'white', pt: 6, pb: 3, fontSize: 14 }}
    >
      <Container maxWidth='1450px'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 4,
            mb: 4,
            justifyItems: 'center',
            padding: '20px'
          }}
        >
          {/* Cột 1: Logo + Đăng ký nhận tin */}
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>
              ICONDEWIM™
            </Typography>
            <Typography
              variant='body2'
              sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
            >
              <PhoneIcon sx={{ fontSize: 16, mr: 1 }} /> Tổng đài CSKH: 0287 050
              6060
            </Typography>
            <Typography
              variant='body2'
              sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
            >
              <EmailIcon sx={{ fontSize: 16, mr: 1 }} /> cskh@icondewim.com
            </Typography>

            <Typography sx={{ mb: 1, fontWeight: 500 }}>
              ĐĂNG KÝ NHẬN TIN
            </Typography>
            <Typography variant='caption'>
              Hãy là người đầu tiên nhận khuyến mãi lớn!
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <TextField
                placeholder='Nhập địa chỉ email'
                variant='outlined'
                fullWidth
                sx={{
                  bgcolor: 'white',
                  borderRadius: '4px',
                  '& input': { fontSize: 15 }
                }}
              />
              <Button
                size='small'
                sx={{ bgcolor: '#1a3c7b', color: 'white', width: '100px' }}
                variant='contained'
              >
                ĐĂNG KÝ
              </Button>
            </Box>

            <Typography sx={{ mt: 2, mb: 1 }}>KẾT NỐI VỚI CHÚNG TÔI</Typography>
            <Stack direction='row' spacing={1}>
              <IconButton color='inherit'>
                <FacebookIcon />
              </IconButton>
              <IconButton color='inherit'>
                <InstagramIcon />
              </IconButton>
              <IconButton color='inherit'>
                <YouTubeIcon />
              </IconButton>
            </Stack>
          </Box>

          {/* Cột 2: Chính sách */}
          <Box sx={{ flex: 1, minWidth: 180 }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
              CHÍNH SÁCH WEBSITE
            </Typography>
            <Stack spacing={0.5}>
              <Typography component="a" href="/policy" sx={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                Chính sách của FashionStore
              </Typography>
            </Stack>
            <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 , mt: 2}}>
              HỖ TRỢ KHÁCH HÀNG
            </Typography>
            <Stack spacing={0.5}>
              <Typography component="a" href="/policy" sx={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                032323232323
              </Typography>
            </Stack>
          </Box>

          {/* Cột 3: Danh sách cửa hàng */}
          <Box sx={{ flex: 1.2, minWidth: 200 }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
              HỆ THỐNG CỬA HÀNG (11 CH)
            </Typography>
            <Typography sx={{ display: 'flex', mb: 1 }}>
              <LocationOnIcon sx={{ fontSize: 16, mr: 1 }} />
              <strong>HỒ CHÍ MINH (9 CH)</strong>
              <br />
            </Typography>
            <Typography variant='body2' sx={{ ml: 3, mb: 1 }}>
              477–479–481 D. Sư Vạn Hạnh, P.12, Q.10, HCM
            </Typography>
            <Typography sx={{ display: 'flex', mb: 1 }}>
              <LocationOnIcon sx={{ fontSize: 16, mr: 1 }} />
              <strong>ĐỒNG NAI</strong>
            </Typography>
            <Typography variant='body2' sx={{ ml: 3, mb: 1 }}>
              1557 Phạm Văn Thuận, Biên Hòa, Đồng Nai
            </Typography>
            <Typography sx={{ display: 'flex', mb: 1 }}>
              <LocationOnIcon sx={{ fontSize: 16, mr: 1 }} />
              <strong>BÌNH DƯƠNG</strong>
            </Typography>
            <Typography variant='body2' sx={{ ml: 3 }}>
              79 Yersin, P.Phú Cường, Thủ Dầu Một, Bình Dương
            </Typography>
            <Button
              variant='text'
              size='small'
              sx={{ mt: 1, pl: 0, color: 'white', textTransform: 'none' }}
            >
              XEM TẤT CẢ CỬA HÀNG
            </Button>
          </Box>

          {/* Cột 4: Fanpage + thanh toán */}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
              FANPAGE CHÚNG TÔI
            </Typography>
            <Box
              component='img'
              src='https://file.hstatic.net/1000360022/file/artboard_1-min_1643d2c0f0bb4e81ae8841e0ba2f1ba7.jpg'
              alt='Fanpage'
              sx={{ width: '100%', borderRadius: 2, mb: 2 }}
            />

            <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
              PHƯƠNG THỨC THANH TOÁN
            </Typography>
            <Stack direction='row' spacing={1} sx={{ mb: 2 }}>
              <Box
                sx={{ width: '60px', height: '30px' }}
                component='img'
                src='https://file.hstatic.net/1000360022/file/img_payment_method_4_7fdbf4cdf59647e684a29799683114f7.png'
              />
            </Stack>
          </Box>
        </Box>

        <Typography variant='body2' align='center'>
          © Bản quyền thuộc về <strong>FASHIONSTORE</strong>
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer
