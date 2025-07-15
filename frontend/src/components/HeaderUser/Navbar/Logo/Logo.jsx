import React, { useState, useEffect } from 'react'
import { Button, Box } from '@mui/material'
import { styled } from '@mui/system'
import { getHeaderConfig } from '~/services/admin/webConfig/headerService'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

const LogoButton = styled(Button)(({ theme }) => ({
  fontWeight: 700,
  color: '#03235e',
  textTransform: 'none',
  letterSpacing: '1px',
  fontSize: '28px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px'
  }
}))

const LogoImage = styled('img')(({ theme }) => ({
  height: 'auto',
  maxHeight: '40px',
  width: 'auto',
  maxWidth: '100%',
  objectFit: 'contain',
  display: 'block'
}))

const Logo = () => {
  const [logoData, setLogoData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogoData = async () => {
      try {
        const headerConfig = await getHeaderConfig()
        if (headerConfig?.content?.logo) {
          setLogoData(headerConfig.content.logo)
        }
      } catch (error) {
        console.error('Error fetching logo data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogoData()
  }, [])

  if (logoData?.imageUrl && logoData?.visible !== false) {
    return (
      <Box
        component='a'
        href='/'
        sx={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: { xs: 120, sm: 200 },
          height: 40,
          textDecoration: 'none',
          overflow: 'hidden'
        }}
      >
        <LogoImage
  src={optimizeCloudinaryUrl(logoData.imageUrl, {
    width: 400,        // gấp đôi so với kích thước hiển thị
    height: 80,
    quality: 'auto',
    format: 'auto'
  })}
  style={{ width: 200, height: 40 }} // hoặc trong styled component
  alt={logoData.alt || 'Logo'}
/>

      </Box>
    )
  }

  return <LogoButton href='/'>{logoData?.text || 'FASHIONSTORE™'}</LogoButton>
}

export default Logo
