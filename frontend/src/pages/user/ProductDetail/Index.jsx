import React, { useState, useEffect } from 'react'
import { Container, Grid, Typography, Button, Box } from '@mui/material'
import { useParams, Link as RouterLink } from 'react-router-dom'
import useProductDetail from '~/hooks/useProductDetail'
import ProductImageSection from './ProductImageSection'
import ProductInfoSection from './ProductInfoSection'
import ProductDescription from './ProductDescription'
import VoucherDrawer from './VoucherDrawer'
import SnackbarAlert from './SnackbarAlert'
import RelatedProducts from './RelatedProducts'
import { getCategoryById } from '~/services/categoryService'

const ProductDetail = () => {
  const { productId } = useParams()
  const [isViewingThumbnails, setIsViewingThumbnails] = useState(false)
  const [category, setCategory] = useState(null)

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
    inventory
  } = useProductDetail(productId)

  const selectedColorObj = availableColors?.find(
    (color) => color.name === selectedColor
  )

  useEffect(() => {
    const fetchCategory = async () => {
      console.log('>>> product.category:', product?.category)
      if (product?.category) {
        if (typeof product.category === 'string') {
          try {
            const res = await getCategoryById(product.category)
            console.log('>>> fetched category from API:', res)
            setCategory(res)
          } catch (err) {
            console.error('Lỗi lấy category:', err)
          }
        } else {
          console.log('>>> category là object:', product.category)
          setCategory(product.category)
        }
      }
    }

    fetchCategory()
  }, [product])

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
      maxWidth={false}
      sx={{
        py: 0,
        mt: 0,
        px: 0,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '1450px',
        width: '100%',
        mx: 'auto'
      }}
    >
      <Box sx={{ mb: 2, mt: 0, p: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 15,
            py: 1,
            px: 0,
            borderRadius: 1
          }}
        >
          <Typography
            component={RouterLink}
            to='/'
            sx={{
              color: '#1976d2',
              textDecoration: 'none',
              fontSize: 15,
              '&:hover': { textDecoration: 'underline' },
              mr: 0.5
            }}
          >
            Trang chủ
          </Typography>
          <Typography sx={{ mx: 0.5, color: '#888' }}>/</Typography>
          <Typography
            component={RouterLink}
            to='/product'
            sx={{
              color: '#1976d2',
              textDecoration: 'none',
              fontSize: 15,
              '&:hover': { textDecoration: 'underline' },
              mr: 0.5
            }}
          >
            Sản phẩm
          </Typography>
          <Typography sx={{ mx: 0.5, color: '#888' }}>/</Typography>
          <Typography
            component={RouterLink}
            to={`/productbycategory/${category?._id}`}
            sx={{
              color: '#1976d2',
              textDecoration: 'none',
              fontSize: 15,
              '&:hover': { textDecoration: 'underline' },
              mr: 0.5
            }}
          >
            {category?.name || 'Danh mục'}
          </Typography>
          <Typography sx={{ mx: 0.5, color: '#888' }}>/</Typography>
          <Typography
            sx={{ fontWeight: 500, fontSize: 15, color: 'text.primary' }}
          >
            {product?.name || 'Chi tiết sản phẩm'}
          </Typography>
        </Box>
      </Box>

      <Grid
        container
        spacing={4}
        justifyContent='center'
        sx={{
          alignItems: 'flex-start',
          flexWrap: 'nowrap',
          '@media (max-width: 1100px)': {
            flexWrap: 'wrap',
            spacing: 2
          }
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            px: { xs: 1, sm: 2 },
            width: '100%',
            maxWidth: { xs: '100%', md: '70%' },
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}
        >
          <ProductImageSection
            images={selectedColorObj?.images || product.images}
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
            selectedColor={selectedColorObj}
            selectedSize={selectedSize}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            px: { xs: 1, sm: 2 },
            width: '100%',
            maxWidth: { xs: '100%', md: '50%' },
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}
        >
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

      <Box sx={{ mt: 3 }}>
        <ProductDescription
          description={product.description}
          productId={product._id}
          product={product}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <RelatedProducts
          currentProductId={product?._id}
          categoryId={product?.categoryId?._id || product?.categoryId}
        />
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
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Container>
  )
}

export default ProductDetail
