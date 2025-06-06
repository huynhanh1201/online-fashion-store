import React, { useState, useEffect } from 'react'
import { Box, IconButton } from '@mui/material'
import { ArrowForward, ArrowBack } from '@mui/icons-material'

const images = [
  'https://file.hstatic.net/1000360022/file/banner_trang_ch__pc__2048x813px__c3710b6015564c6d8cdac098c4a482d2.jpg',
  'https://file.hstatic.net/1000360022/file/banner_web_desk__5_.jpg',
  'https://file.hstatic.net/1000360022/file/banner_web_desk_copy_ea4e281a9290450d8b3e1eeb11e29a17.jpg'
]

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

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
        height: { xs: 200, sm: 400, md: 622 }, // chiều cao responsive
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
          left: '10px',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' }
        }}
      >
        <ArrowBack />
      </IconButton>

      <IconButton
        onClick={goToNext}
        sx={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' }
        }}
      >
        <ArrowForward />
      </IconButton>
    </Box>
  )
}

export default Slider
