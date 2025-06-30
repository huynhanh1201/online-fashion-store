import React, { useEffect, useState } from 'react'
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
import LinkIcon from '@mui/icons-material/Link'
import { getFooterConfig } from '~/services/admin/webConfig/footerService.js'

function Footer() {
  const [footer, setFooter] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFooter = async () => {
      setLoading(true)
      try {
        const res = await getFooterConfig()
        setFooter(res?.content?.[0] || null)
      } catch {
        setFooter(null)
      } finally {
        setLoading(false)
      }
    }
    fetchFooter()
  }, [])

  if (loading) return null

  return (
    <Box
      sx={{ 
        bgcolor: 'var(--primary-color)', 
        color: 'white', 
        pt: 6, 
        pb: 3, 
        fontSize: 14 
      }}
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
          {/* Cột 1: Logo + Đăng ký nhận tin + Thông tin liên hệ */}
          <Box sx={{ flex: 1, minWidth: 220 }}>
            {footer?.logo && (
              <Box sx={{ mb: 1 }}>
                <img src={footer.logo} alt='logo' style={{ width: 120, height: 'auto', borderRadius: 8, background: '#fff', padding: 4 }} />
              </Box>
            )}
            <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>
              {footer?.about?.[0]?.phone ? `Hotline: ${footer.about[0].phone}` : 'FASHIONSTORE'}
            </Typography>
            {footer?.about?.[0]?.email && (
              <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ fontSize: 16, mr: 1 }} /> {footer.about[0].email}
              </Typography>
            )}
            <Typography sx={{ mb: 1, fontWeight: 500 }}>ĐĂNG KÝ NHẬN TIN</Typography>
            <Typography variant='caption'>Hãy là người đầu tiên nhận khuyến mãi lớn!</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <TextField
                placeholder='Nhập địa chỉ email'
                variant='outlined'
                fullWidth
                sx={{ bgcolor: 'white', borderRadius: '4px', '& input': { fontSize: 15 } }}
              />
              <Button 
                size='small' 
                sx={{ 
                  bgcolor: 'var(--accent-color)', 
                  color: 'white', 
                  width: '100px',
                  '&:hover': {
                    bgcolor: 'var(--primary-color)'
                  }
                }} 
                variant='contained'
              >
                ĐĂNG KÝ
              </Button>
            </Box>
          </Box>

          {/* Cột 2: Chính sách + Hỗ trợ */}
          {footer?.menuColumns?.length > 0 && (
            <Box sx={{ flex: 1, minWidth: 180 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
                CHÍNH SÁCH WEBSITE
              </Typography>
              <Stack spacing={0.5}>
                <Typography component='a' href='/policy' sx={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                  Chính sách
                </Typography>
                {footer.menuColumns.map((col, idx) => (
                  <Typography key={idx} component='a' href={col.link || '#'} sx={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                    {col.title}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}

          {/* Cột 3: Danh sách cửa hàng */}
          {footer?.stores?.length > 0 && (
            <Box sx={{ flex: 1.2, minWidth: 200 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
                HỆ THỐNG CỬA HÀNG
              </Typography>
              {footer.stores.map((store, idx) => (
                <Box key={idx} sx={{ mb: 1 }}>
                  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 1 }} />
                    <strong>{store.name}</strong>
                  </Typography>
                  <Typography variant='body2' sx={{ ml: 3 }}>
                    {store.address}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Cột 4: Kết nối */}
          {footer?.socialLinks?.length > 0 && (
            <Box sx={{ flex: 1, minWidth: 180 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
                KẾT NỐI VỚI CHÚNG TÔI
              </Typography>
              <Stack spacing={1}>
                {footer?.socialLinks?.map((s, idx) => (
                  <Box
                    key={idx}
                    component='a'
                    href={s.link}
                    target='_blank'
                    rel='noopener'
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      color: 'inherit',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    <img
                      src={s.image}
                      alt={s.name}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    <Typography variant='body2'>{s.name}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>

        <Typography variant='body2' align='center'>
          © Bản quyền thuộc về <strong>FASHIONSTORE</strong>
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer
