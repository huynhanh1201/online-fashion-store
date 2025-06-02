import React, { useState } from 'react'
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
  getCurrentImages,
  selectedColor,
  selectedSize,
  selectedVariant
}) => {
  const [isThumbnailClicked, setIsThumbnailClicked] = useState(false)

  // Reset isThumbnailClicked khi selectedVariant thay đổi
  React.useEffect(() => {
    setIsThumbnailClicked(false)
  }, [selectedVariant])

  // Lấy danh sách ảnh hiện tại
  const currentImages = getCurrentImages
    ? getCurrentImages()
    : images?.length > 0
      ? images
      : ['/default.jpg']

  // Thumbnail luôn hiển thị danh sách ảnh của sản phẩm
  const displayImages = images?.length > 0 ? images : ['/default.jpg']

  // Ảnh chính
  const mainImage = isThumbnailClicked
    ? displayImages[selectedImageIndex] || displayImages[0] || '/default.jpg'
    : selectedVariant?.color?.image
      ? selectedVariant.color.image
      : displayImages[selectedImageIndex] || displayImages[0] || '/default.jpg'

  return (
    <Box sx={{ width: 400, height: 450, mb: 5 }}>
      <Fade
        in={fadeIn}
        timeout={300}
        key={`${selectedColor || ''}-${selectedSize || ''}-${selectedVariant?._id || ''}`}
      >
        <div style={{ width: '100%', height: '100%' }}>
          <ProductImage
            src={mainImage}
            alt={selectedVariant?.name || 'Sản phẩm'}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = '/default.jpg'
            }}
          />
        </div>
      </Fade>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
        {displayImages.map((img, index) => (
          <Thumbnail
            key={`${img}-${index}`}
            src={img}
            alt={`thumb-${index}`}
            selected={index === selectedImageIndex}
            onClick={() => {
              setIsThumbnailClicked(true)
              onImageClick(index)
              console.log('Clicked thumbnail index:', index) // Debug
            }}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = '/default.jpg'
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default ProductImageSection
