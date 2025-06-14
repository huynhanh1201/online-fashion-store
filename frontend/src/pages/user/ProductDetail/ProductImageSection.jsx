import React, { useState, useEffect } from 'react'
import { Box, Fade, Modal } from '@mui/material'
import { styled } from '@mui/system'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'

const ProductImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'zoom-in',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
  }
}))

const EnlargedImage = styled('img')(() => ({
  width: 'min(90vw, 700px)',
  height: 'min(90vh, 600px)',
  objectFit: 'cover',
  borderRadius: '8px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
}))

const ModalContent = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'transparent',
  padding: 0,
  outline: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const ModalOverlay = styled(Box)(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1300
}))

const Thumbnail = styled('img')(({ selected }) => ({
  width: 100,
  height: 100,
  border: selected ? '3px solid #1976d2' : '2px solid #e0e0e0',
  cursor: 'pointer',
  objectFit: 'cover',
  transition: 'all 0.3s ease',
  boxShadow: selected
    ? '0 4px 20px rgba(25, 118, 210, 0.3)'
    : '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: selected
      ? '0 6px 25px rgba(25, 118, 210, 0.4)'
      : '0 4px 15px rgba(0, 0, 0, 0.15)',
    border: selected ? '3px solid #1976d2' : '2px solid #bdbdbd'
  }
}))

const MainImageContainer = styled(Box)(() => ({
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)',
    pointerEvents: 'none',
    zIndex: 1
  }
}))

const ThumbnailContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  marginRight: 20,
  overflowY: 'auto',
  padding: '8px 0',
  background:
    'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(248,249,250,0.8))',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
  maxHeight: 420,
  '&::-webkit-scrollbar': {
    width: 8
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(0,0,0,0.05)',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
    '&:hover': {
      background: 'linear-gradient(45deg, #1565c0, #1976d2)'
    }
  },
  scrollbarWidth: 'thin',
  scrollbarColor: '#1976d2 rgba(0,0,0,0.05)'
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
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setIsThumbnailClicked(false)
  }, [selectedVariant])

  const currentImages = getCurrentImages
    ? getCurrentImages()
    : images?.length > 0
      ? images
      : ['/default.jpg']

  const displayImages = images?.length > 0 ? images : ['/default.jpg']

  const mainImage = isThumbnailClicked
    ? displayImages[selectedImageIndex] || displayImages[0] || '/default.jpg'
    : selectedVariant?.color?.image
      ? selectedVariant.color.image
      : displayImages[selectedImageIndex] || displayImages[0] || '/default.jpg'

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Box
        sx={{
          width: { xs: '100%', md: 550 },
          height: { xs: 'auto', md: 600 },
          mb: 6,
          p: { xs: 1, sm: 2, md: 2 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          justifyContent: 'center',
        }}
      >
        {/* Thumbnail bên trái ở md trở lên */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <ThumbnailContainer>
            {displayImages.map((img, index) => (
              <Thumbnail
                key={`${img}-${index}`}
                src={img}
                alt={`thumb-${index}`}
                selected={index === selectedImageIndex}
                onClick={() => {
                  setIsThumbnailClicked(true)
                  onImageClick(index)
                }}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/default.jpg'
                }}
              />
            ))}
          </ThumbnailContainer>
        </Box>

        <Fade
          in={fadeIn}
          timeout={300}
          key={`${selectedColor || ''}-${selectedSize || ''}-${selectedVariant?._id || ''}`}
        >
          <MainImageContainer
            sx={{
              width: { xs: 220, sm: 320, md: 520 },
              height: { xs: 220, sm: 320, md: 520 },
              mb: 2
            }}
          >
            <ProductImage
               src={optimizeCloudinaryUrl(mainImage)}
              alt={selectedVariant?.name || 'Sản phẩm'}
              onClick={handleOpenModal}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/default.jpg'
              }}
            />
          </MainImageContainer>
        </Fade>

        {/* Thumbnail dưới ảnh ở màn nhỏ */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, width: '100%', justifyContent: 'center', mt: 2 }}>
          <ThumbnailContainer sx={{ flexDirection: 'row', maxHeight: 80 }}>
            {displayImages.map((img, index) => (
              <Thumbnail
                key={`${img}-${index}`}
                src={img}
                alt={`thumb-${index}`}
                selected={index === selectedImageIndex}
                onClick={() => {
                  setIsThumbnailClicked(true)
                  onImageClick(index)
                }}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/default.jpg'
                }}
                style={{ width: 60, height: 60 }}
              />
            ))}
          </ThumbnailContainer>
        </Box>
      </Box>

      {/* Modal zoom ảnh */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="zoom-image-modal"
      >
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <EnlargedImage
               src={optimizeCloudinaryUrl(mainImage)}
              alt={selectedVariant?.name || 'Sản phẩm'}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/default.jpg'
              }}
            />
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  )
}

export default ProductImageSection
