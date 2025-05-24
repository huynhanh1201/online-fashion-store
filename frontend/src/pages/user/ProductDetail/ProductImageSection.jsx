import React from 'react'
import { Box, Fade } from '@mui/material'
import { styled } from '@mui/system'

const ProductImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  objectFit: 'cover'
}))

const Thumbnail = styled('img')(({ selected }) => ({
  width: 80,
  height: 80,
  borderRadius: 4,
  border: selected ? '2px solid #1976d2' : '1px solid #ccc',
  cursor: 'pointer',
  objectFit: 'cover',
  transition: 'border 0.3s ease'
}))

const ProductImageSection = ({
  images,
  selectedImageIndex,
  fadeIn,
  onImageClick
}) => (
  <Box sx={{ width: 400, height: 450, mb: 5 }}>
    <Fade in={fadeIn} timeout={300} key={selectedImageIndex}>
      <div style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
        <ProductImage
          src={images?.[selectedImageIndex] || '/default.jpg'}
          alt='Sản phẩm'
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400'
          }}
        />
      </div>
    </Fade>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 1,
        mt: 2,
        objectFit: 'contain'
      }}
    >
      {images?.map((img, index) => (
        <Thumbnail
          key={`${img}-${index}`}
          src={img}
          alt={`thumb-${index}`}
          selected={index === selectedImageIndex}
          onClick={() => onImageClick(index)}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400'
          }}
        />
      ))}
    </Box>
  </Box>
)

export default ProductImageSection
