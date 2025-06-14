import React, { useState, useEffect } from 'react'
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material'
import { ArrowForward, ArrowBack } from '@mui/icons-material'

const images = [
  'https://file.hstatic.net/1000360022/file/banner_trang_ch__pc__2048x813px__c3710b6015564c6d8cdac098c4a482d2.jpg',
  'https://file.hstatic.net/1000360022/file/banner_web_desk_copy_ea4e281a9290450d8b3e1eeb11e29a17.jpg',
  'https://file.hstatic.net/1000360022/file/banner_trang_ch__pc__2048x813px__11c095c817cf48bd99137aa5c555d2fa.jpg',
  'https://file.hstatic.net/1000360022/file/banner_t3_pc1-2048x812.jpg'
]

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
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
          width: `${images.length * 100}%`,
          height: '100%',
          transform: `translateX(-${currentIndex * (100 / images.length)}%)`,
          transition: 'transform 0.5s ease-in-out'
        }}
      >
        {images.map((image, index) => (
          <Box
            key={index}
            component='img'
            src={image}
            alt={`slide-${index}`}
            sx={{
              width: `${100 / images.length}%`,
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ))}
      </Box>

      <IconButton
        onClick={goToPrevious}
        sx={{
          position: 'absolute',
          top: '50%',
          left: { xs: '5px', sm: '10px' },
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
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
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
          display: { xs: 'none', sm: 'flex' },
          padding: { xs: '4px', sm: '8px' }
        }}
      >
        <ArrowForward sx={{ fontSize: { xs: '20px', sm: '24px' } }} />
      </IconButton>
    </Box>
  )
}

export default Slider
