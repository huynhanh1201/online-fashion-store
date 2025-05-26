import React, { useState } from 'react'
import {
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress
} from '@mui/material'
import { useParams } from 'react-router-dom'
import useProductDetail from '~/hooks/useProductDetail'
import ProductImageSection from './ProductImageSection'
import ProductInfoSection from './ProductInfoSection'
import ProductDescription from './ProductDescription'
import VoucherDrawer from './VoucherDrawer'
import SnackbarAlert from './SnackbarAlert'

const ProductDetail = () => {
  const { productId } = useParams()
  const [selectedColor, setSelectedColor] = useState(null)
  const [isViewingThumbnails, setIsViewingThumbnails] = useState(false) // Thêm state mới
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
    size = [],
    setSize,
    sizes,
    colors,
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
    formatCurrencyShort
  } = useProductDetail(productId)

  // console.log('ProductDetail - productId:', productId)
  // console.log('ProductDetail - selectedColor:', selectedColor)
  console.log('ProductDetail - colors:', colors)
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
            images={product.images}
            selectedImageIndex={selectedImageIndex}
            fadeIn={fadeIn}
            onImageClick={(index) => {
              setIsViewingThumbnails(true) // Kích hoạt chế độ xem thumbnail
              if (index !== selectedImageIndex) {
                setFadeIn(false)
                setTimeout(() => {
                  setSelectedImageIndex(index)
                  setFadeIn(true)
                }, 150)
              }
            }}
            selectedColor={selectedColor}
            colors={colors}
            isViewingThumbnails={isViewingThumbnails}
            setIsViewingThumbnails={setIsViewingThumbnails}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ProductInfoSection
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            size={size}
            setSize={setSize}
            colors={colors}
            sizes={sizes}
            coupons={coupons}
            isAdding={isAdding}
            handleAddToCart={handleAddToCart}
            handleBuyNow={handleBuyNow}
            setOpenVoucherDrawer={setOpenVoucherDrawer}
            selectedColor={selectedColor}
            setSelectedColor={(color) => {
              setSelectedColor(color)
              setIsViewingThumbnails(false) // Tắt chế độ xem thumbnail khi chọn màu
            }}
          />
        </Grid>
      </Grid>
      <ProductDescription description={product.description} />
      <VoucherDrawer
        open={openVoucherDrawer}
        onClose={() => setOpenVoucherDrawer(false)}
        coupons={coupons}
        copiedCode={copiedCode}
        handleCopy={handleCopy}
        formatCurrencyShort={formatCurrencyShort}
      />
      <SnackbarAlert snackbar={snackbar} onClose={() => setSnackbar(null)} />
    </Container>
  )
}

export default ProductDetail
