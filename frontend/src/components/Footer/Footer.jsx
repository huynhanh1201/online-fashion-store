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
import { getAllPolicies } from '~/services/policyService.js'
import { Link } from 'react-router-dom'
function Footer() {
  const [footer, setFooter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [policies, setPolicies] = useState([])

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

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const all = await getAllPolicies()
        // Chỉ lấy active, không destroy
        setPolicies(
          all.filter((p) => p.status === 'active' && p.destroy === false)
        )
      } catch {
        setPolicies([])
      }
    }
    fetchPolicies()
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
                <img
                  src={footer.logo}
                  alt='logo'
                  style={{
                    maxWidth: '200px',
                    width: '100%',
                    maxHeight: '100px',
                    height: '100%',
                    borderRadius: 8,
                    background: '#fff',
                    padding: 4,
                    objectFit: 'cover'
                  }}
                />
              </Box>
            )}
            {/* Show all phone numbers */}
            {footer?.about
              ?.filter((a) => a.phone)
              .map((a, idx) => (
                <Typography
                  key={`phone-${idx}`}
                  variant='body2'
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                    fontWeight: 700
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 16, mr: 1 }} /> {a.phone}
                </Typography>
              ))}
            {/* Show all emails */}
            {footer?.about
              ?.filter((a) => a.email)
              .map((a, idx) => (
                <Typography
                  key={`email-${idx}`}
                  variant='body2'
                  sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                >
                  <EmailIcon sx={{ fontSize: 16, mr: 1 }} /> {a.email}
                </Typography>
              ))}
          </Box>

          {/* Cột 2: Chính sách + Hỗ trợ */}
          <Box sx={{ flex: 1, minWidth: 180 }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
              HỖ TRỢ KHÁCH HÀNG
            </Typography>
            <Stack spacing={0.5}>
              {policies.map((policy) => (
                <Typography
                  key={policy._id}
                  // component='a'
                  component={Link}
                  to={`/policy#${policy.category}`}
                  sx={{
                    color: 'inherit',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  {policy.title}
                </Typography>
              ))}
            </Stack>
          </Box>

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
              {footer?.fanpageImage && (
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'start' }}>
                  <img
                    src={footer.fanpageImage}
                    alt='fanpage'
                    style={{
                      width: 300,
                      height: 'auto',
                      borderRadius: 8,
                      background: '#fff',
                      padding: 4
                    }}
                  />
                </Box>
              )}
              <Stack spacing={1}>
                {footer?.socialLinks?.map((s, idx) => (
                  <Box
                    key={idx}
                    // component='a'
                    component={Link}
                    to={s.link}
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
