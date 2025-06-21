import React, { useState, useEffect } from 'react'
import { Button, Box } from '@mui/material'
import { styled } from '@mui/system'
import { getHeaderConfig } from '~/services/admin/webConfig/headerService'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

const LogoButton = styled(Button)(({ theme }) => ({
  fontSize: '28px',
  fontWeight: 700,
  color: '#03235e',
  textTransform: 'none',
  letterSpacing: '1px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '22px'
  }
}))

const LogoImage = styled('img')(({ theme }) => ({
  height: '40px',
  width: 'auto',
  maxWidth: '200px',
  objectFit: 'contain',
  [theme.breakpoints.down('sm')]: {
    height: '32px',
    maxWidth: '150px'
  }
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

  // Nếu có logo image và đang hiển thị
  if (logoData?.imageUrl && logoData?.visible !== false) {
    return (
      <Box component="a" href="/" sx={{ textDecoration: 'none' }}>
        <LogoImage
          src={optimizeCloudinaryUrl(logoData.imageUrl, { 
            width: 200, 
            height: 40,
            quality: 'auto',
            format: 'auto'
          })}
          alt={logoData.alt || 'Logo'}
        />
      </Box>
    )
  }

  // Fallback về text logo
  return (
    <LogoButton href='/'>
      {logoData?.text || 'FASHIONSTORE™'}
    </LogoButton>
  )
}

export default Logo
