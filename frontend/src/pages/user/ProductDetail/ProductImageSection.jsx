import React, { useEffect } from 'react'
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
  onImageClick,
  selectedColor,
  colors,
  isViewingThumbnails
}) => {
  const getSelectedImage = () => {
    if (!isViewingThumbnails && selectedColor && colors?.length > 0) {
      const selectedColorObj = colors.find(
        (color) =>
          (color.name || color).toLowerCase() === selectedColor.toLowerCase()
      )
      return (
        selectedColorObj?.image ||
        images?.[selectedImageIndex] ||
        '/default.jpg'
      )
    }
    return images?.[selectedImageIndex] || '/default.jpg'
  }

  const currentImage = getSelectedImage()

  return (
    <Box sx={{ width: 400, height: 450, mb: 5 }}>
      <Fade
        in={fadeIn}
        timeout={300}
        key={`${selectedColor || ''}-${selectedImageIndex}-${isViewingThumbnails}`}
      >
        <div style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
          <ProductImage
            src={currentImage}
            alt='Sản phẩm'
            onError={(e) => {
              // console.log('Image load error:', e);
              e.target.src = '/default.jpg'
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
              // console.log('Thumbnail load error:', e);
              e.target.src = '/default.jpg'
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default ProductImageSection
