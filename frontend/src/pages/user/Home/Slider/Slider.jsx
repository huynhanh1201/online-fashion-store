import React, { useState, useEffect } from 'react'
import { Box, IconButton, useTheme, useMediaQuery, Skeleton } from '@mui/material'
import { ArrowForward, ArrowBack } from '@mui/icons-material'
import { getBanners } from '~/services/admin/webConfig/bannerService.js'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  // Fetch hero banners
  const fetchHeroBanners = async () => {
    try {
      setError('')
      const allBanners = await getBanners()
      // Filter banners with position 'hero' and visible = true
      const today = new Date().setHours(0,0,0,0)
      const heroBanners = allBanners.filter(banner => {
        if (banner.position !== 'hero' || banner.visible !== true) return false;
        if (!banner.endDate) return true; // Nếu không có endDate thì luôn hiển thị
        const end = new Date(banner.endDate).setHours(23,59,59,999)
        return end >= today
      })
      setBanners(heroBanners)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching hero banners:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHeroBanners()
  }, [])

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [banners.length])

  const goToPrevious = () => {
    if (banners.length === 0) return
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? banners.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    if (banners.length === 0) return
    const isLastSlide = currentIndex === banners.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  // Loading skeleton
  if (loading) {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: {
            xs: '200px',
            sm: '300px',
            md: '400px',
            lg: '500px',
            xl: '622px'
          },
          overflow: 'hidden'
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{ borderRadius: 0 }}
        />
      </Box>
    )
  }

  // No banners or error
  if (banners.length === 0) {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: {
            xs: '200px',
            sm: '300px',
            md: '400px',
            lg: '500px',
            xl: '622px'
          },
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          component="img"
          src="https://file.hstatic.net/1000360022/file/banner_trang_ch__pc__2048x813px__c3710b6015564c6d8cdac098c4a482d2.jpg"
          alt="default-banner"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: {
          xs: '200px',    // Mobile
          sm: '300px',    // Tablet
          md: '400px',    // Small desktop
          lg: '500px',    // Large desktop
          xl: '622px'     // Extra large desktop
        },
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: `${banners.length * 100}%`,
          height: '100%',
          transform: `translateX(-${currentIndex * (100 / banners.length)}%)`,
          transition: 'transform 0.5s ease-in-out'
        }}
      >
        {banners.map((banner, index) => (
          <Box
            key={banner._id || index}
            component='img'
            src={banner.imageUrl ? optimizeCloudinaryUrl(banner.imageUrl, { 
              width: 2048, 
              height: 813,
              quality: 'auto',
              format: 'auto'
            }) : undefined}
            alt={banner.title || `slide-${index}`}
            sx={{
              width: `${100 / banners.length}%`,
              height: '100%',
              objectFit: 'cover',
              cursor: banner.link ? 'pointer' : 'default'
            }}
            onClick={() => {
              if (banner.link) {
                window.open(banner.link, '_blank')
              }
            }}
          />
        ))}
      </Box>

      {/* Navigation arrows - only show if there are multiple banners */}
      {banners.length > 1 && (
        <>
          <IconButton
            onClick={goToPrevious}
            sx={{
              position: 'absolute',
              top: '50%',
              left: { xs: '5px', sm: '10px' },
              transform: 'translateY(-50%)',
              backgroundColor: 'var(--surface-color)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
              display: { xs: 'none', sm: 'flex' },
              padding: { xs: '4px', sm: '8px' }
            }}
          >
            <ArrowBack sx={{ fontSize: { xs: '20px', sm: '24px' } }} />
          </IconButton>

          <IconButton
            onClick={goToNext}
            sx={{
              position: 'absolute',
              top: '50%',
              right: { xs: '5px', sm: '10px' },
              transform: 'translateY(-50%)',
              backgroundColor: 'var(--surface-color)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
              display: { xs: 'none', sm: 'flex' },
              padding: { xs: '4px', sm: '8px' }
            }}
          >
            <ArrowForward sx={{ fontSize: { xs: '20px', sm: '24px' } }} />
          </IconButton>
        </>
      )}

      {/* Dots indicator - only show if there are multiple banners */}
      {banners.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '10px', sm: '20px' },
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1
          }}
        >
          {banners.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: '8px', sm: '12px' },
                height: { xs: '8px', sm: '12px' },
                borderRadius: '50%',
                backgroundColor: index === currentIndex 
                  ? 'rgba(255, 255, 255, 0.9)' 
                  : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.7)'
                }
              }}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default Slider
