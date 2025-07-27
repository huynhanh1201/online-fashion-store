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
import Breadcrumbs from '@mui/material/Breadcrumbs'
// import { Link } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

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
    formatCurrencyShort
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
        maxWidth: '97vw',
        width: '100%',
        mx: 'auto'
      }}
    >
      <Box
        sx={{
          bottom: { xs: '20px', sm: '30px', md: '40px' },
          left: { xs: '20px', sm: '30px', md: '40px' },
          right: { xs: '20px', sm: '30px', md: '40px' },
          padding: '12px',
          maxWidth: '1800px',
          margin: '0 auto'
        }}
      >
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize='small' />}
          aria-label='breadcrumb'
        >
          <Link
            underline='hover'
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#007bff',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main'
              }
            }}
            href='/'
          >
            Trang chủ
          </Link>
          <Button
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#007bff',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main'
              }
            }}
            component={RouterLink}
            to={'/product'}
            // href='/product'
          >
            Sản phẩm
          </Button>
          <Link
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#007bff',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main'
              }
            }}
            href={`/productbycategory/${category?._id}`}
          >
            {category?.name}
          </Link>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.primary',
              fontWeight: 500
            }}
          >
            {product.name}
          </Typography>
        </Breadcrumbs>
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

      <Box sx={{ mt: 3, mb: 3 }}>
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
