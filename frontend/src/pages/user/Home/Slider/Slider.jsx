import React, { useState, useEffect } from 'react'
import { Box, IconButton } from '@mui/material'
import { ArrowForward, ArrowBack } from '@mui/icons-material'

const images = [
  'https://hellomida.vn/wp-content/uploads/2023/09/THU-DONG-2.jpg',
  'https://hellomida.vn/wp-content/uploads/2023/09/banner-hlmd-1.jpg'
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
        height: '622px',
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
          <img
            key={index}
            src={image}
            alt={`slide-${index}`}
            style={{
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
          backgroundColor: 'rgba(255, 255, 255, 0.6)'
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
          backgroundColor: 'rgba(255, 255, 255, 0.6)'
        }}
      >
        <ArrowForward />
      </IconButton>
    </Box>
  )
}

export default Slider
