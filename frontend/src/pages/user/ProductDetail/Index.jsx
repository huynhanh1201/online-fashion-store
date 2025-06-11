import React, { useState } from 'react'
import { Container, Grid, Typography, Button, Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import useProductDetail from '~/hooks/useProductDetail'
import ProductImageSection from './ProductImageSection'
import ProductInfoSection from './ProductInfoSection'
import ProductDescription from './ProductDescription'
import VoucherDrawer from './VoucherDrawer'
import SnackbarAlert from './SnackbarAlert'

const ProductDetail = () => {
  const { productId } = useParams()
  // eslint-disable-next-line no-unused-vars
  const [isViewingThumbnails, setIsViewingThumbnails] = useState(false)

  const {
    product,
    isLoading,
    error,
    fetchProduct,
    selectedImageIndex,
    setSelectedImageIndex,
    fadeIn,
    setFadeIn,
    quantity,
    setQuantity,
    variants,
    selectedVariant,
    availableColors,
    availableSizes,
    selectedColor,
    selectedSize,
    handleColorChange,
    handleSizeChange,
    getCurrentPrice,
    getCurrentImages,
    coupons,
    openVoucherDrawer,
    setOpenVoucherDrawer,
    snackbar,
    setSnackbar,
    isAdding,
    handleAddToCart,
    handleBuyNow,
    handleCopy,
    copiedCode,
    formatCurrencyShort,
    inventory,
  } = useProductDetail(productId)

  // console.log('ProductDetail - productId:', productId)
  // console.log('ProductDetail - selectedColor:', selectedColor)
  // console.log('ProductDetail - colors:', colors)
  // console.log('ProductDetail - isViewingThumbnails:', isViewingThumbnails)

  if (isLoading) {
    return (
      <Container maxWidth='lg' sx={{ py: 4, mt: 20, textAlign: 'center' }}>
        <Typography variant='h6'>Đang tải...</Typography>
      </Container>
    )
  }

  if (error || !product) {
    return (
      <Container maxWidth='lg' sx={{ py: 4, mt: 20, textAlign: 'center' }}>
        <Typography variant='h6' color='error'>
          {error || 'Không tìm thấy sản phẩm.'}
        </Typography>
        <Button variant='contained' sx={{ mt: 2 }} onClick={fetchProduct}>
          Thử lại
        </Button>
      </Container>
    )
  }

  return (
    <Container
      maxWidth='lg'
      sx={{ py: 4, mt: 20, justifyContent: 'center', alignItems: 'center' }}
    >
      <Grid container spacing={10} justifyContent='center'>
        <Grid item xs={12} md={6}>
          <ProductImageSection
            images={selectedColor?.images || product.images}
            selectedImageIndex={selectedImageIndex}
            fadeIn={fadeIn}
            onImageClick={(index) => {
              if (index !== selectedImageIndex) {
                setFadeIn(false)
                setTimeout(() => {
                  setSelectedImageIndex(index)
                  setFadeIn(true)
                }, 150)
              }
            }}
            getCurrentImages={getCurrentImages}
            selectedVariant={selectedVariant}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ProductInfoSection
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            coupons={coupons}
            isAdding={isAdding[product._id] || false}
            handleAddToCart={() => handleAddToCart(product._id)}
            handleBuyNow={handleBuyNow}
            setOpenVoucherDrawer={setOpenVoucherDrawer}
            variants={variants}
            selectedVariant={selectedVariant}
            availableColors={availableColors}
            availableSizes={availableSizes}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            handleColorChange={(color) => {
              handleColorChange(color)
              setIsViewingThumbnails(false)
            }}
            handleSizeChange={handleSizeChange}
            getCurrentPrice={getCurrentPrice}
            getCurrentImages={getCurrentImages}
            inventory={inventory}
            setSnackbar={setSnackbar}

          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 10 }}>
        <ProductDescription description={product.description} productId={product._id} />
      </Box>
      <VoucherDrawer
        open={openVoucherDrawer}
        onClose={() => setOpenVoucherDrawer(false)}
        coupons={coupons}
        copiedCode={copiedCode}
        handleCopy={handleCopy}
        formatCurrencyShort={formatCurrencyShort}
      />
      <SnackbarAlert
        open={snackbar?.open || false}
        message={snackbar?.message || ''}
        severity={snackbar?.severity || 'info'}
        variantImage={snackbar?.variantImage || '/default.jpg'}
        productName={snackbar?.productName || ''}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />

    </Container>
  )
}

export default ProductDetail
