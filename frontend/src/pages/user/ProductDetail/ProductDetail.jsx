/* eslint-disable no-console */
import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Chip,
  ButtonGroup,
  TextField,
  Fade,
  Snackbar,
  Alert,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Card,
  Tooltip,
  CircularProgress
} from '@mui/material'
import { styled } from '@mui/system'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import { useParams } from 'react-router-dom'
import { getProductById } from '~/services/productService'
import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { getDiscounts } from '~/services/discountService'
import ContentCopyIcon from '@mui/icons-material/ContentCopy' // Thêm import ở đầu file
import { addToCart, getCart } from '~/services/cartService'
import { useDispatch } from 'react-redux'
import { setCartItems } from '~/redux/cart/cartSlice'
import { useNavigate } from 'react-router-dom'
import { setTempCart } from '~/redux/cart/cartSlice'

// Utility format tiền gọn
const formatCurrencyShort = (value) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}Tr`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return `${value.toLocaleString()}đ`
}

// Styled component
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

const PriceTypography = styled(Typography)({
  color: '#d32f2f',
  fontWeight: 700
})

const VoucherChip = styled(Chip)({
  margin: '4px',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  cursor: 'pointer'
})

const ProductDetail = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [color, setColor] = useState('Đen')
  const [size, setSize] = useState('S')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openVoucherDrawer, setOpenVoucherDrawer] = useState(false)
  const [coupons, setCoupons] = useState([])
  const [copiedCode, setCopiedCode] = useState('')
  const [snackbar, setSnackbar] = useState(null)
  const [isAdding, setIsAdding] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const colors = ['Đen', 'Trắng', 'Xanh', 'Đỏ']
  const sizes = ['S', 'M', 'L', 'XL']

  // Fetch product detail
  const fetchProduct = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
      setError('ID sản phẩm không hợp lệ.')
      setIsLoading(false)
      return
    }
    try {
      const data = await getProductById(productId)
      if (data && Object.keys(data).length) {
        setProduct({
          ...data,
          images:
            data.images || data.image
              ? Array.isArray(data.images)
                ? data.images
                : [data.image]
              : ['/default.jpg'],
          name: data.name || 'Sản phẩm không tên'
        })
      } else {
        setError('Sản phẩm không tồn tại.')
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          'Không thể tải thông tin sản phẩm.'
      )
    } finally {
      setIsLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { discounts } = await getDiscounts()
        const sortedCoupons = discounts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        setCoupons(sortedCoupons)
      } catch (err) {
        console.error('Lỗi khi lấy coupon:', err)
      }
    }
    fetchCoupons()
  }, [])

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const handleImageClick = (index) => {
    if (index === selectedImageIndex) return
    setFadeIn(false)
    setTimeout(() => {
      setSelectedImageIndex(index)
      setFadeIn(true)
    }, 150)
  }
  const handleAddToCart = async () => {
    if (isAdding) return
    if (!product) return

    setIsAdding(true)

    try {
      const updatedCart = await getCart()
      const existingItem = updatedCart?.cartItems?.find(
        (item) => item.productId._id === product._id
      )
      const currentQty = existingItem?.quantity || 0

      if (currentQty + quantity > product.quantity) {
        setSnackbar({
          type: 'warning',
          message: 'Không thể vượt quá số lượng tồn kho!'
        })
        // Bật lại nút ngay trước khi return
        setTimeout(() => setIsAdding(false), 500)
        return
      }

      const res = await addToCart({
        cartItems: [{ productId: product._id, quantity }]
      })

      dispatch(setCartItems(res?.cartItems || updatedCart?.cartItems || []))
      setSnackbar({
        type: 'success',
        message: 'Thêm sản phẩm vào giỏ hàng thành công!'
      })
      setQuantity(1)
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ:', error)
      setSnackbar({
        type: 'error',
        message: 'Không thể thêm sản phẩm vào giỏ hàng!'
      })
    } finally {
      setTimeout(() => setIsAdding(false), 1000)
    }
  }

  // Giảm SL
  const handleIncrease = () => {
    if (product && quantity < product.quantity) {
      setQuantity((prev) => prev + 1)
    }
  }

  // Buy now: set temp cart & navigate to payment
  const handleBuyNow = () => {
    if (!product) return

    const itemToBuy = {
      productId: product._id,
      quantity,
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || (product.images && product.images[0]) || ''
      }
    }

    dispatch(setTempCart({ cartItems: [itemToBuy] }))
    navigate('/payment')
  }

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
          <Box sx={{ width: 400, height: 450, mb: 5 }}>
            <Fade in={fadeIn} timeout={300} key={selectedImageIndex}>
              <div
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <ProductImage
                  src={product.images?.[selectedImageIndex] || '/default.jpg'}
                  alt={product.name}
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
              {product.images?.map((img, index) => (
                <Thumbnail
                  key={`${img}-${index}`}
                  src={img}
                  alt={`thumb-${index}`}
                  selected={index === selectedImageIndex}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography
              variant='h5'
              fontWeight={700}
              sx={{
                maxWidth: '670px', // giới hạn theo container
                wordBreak: 'break-word', // cho phép xuống dòng khi quá dài
                whiteSpace: 'pre-wrap' // giữ nguyên khoảng trắng và xuống dòng
              }}
            >
              {product.name}
            </Typography>

            <PriceTypography variant='h5'>
              {typeof product.price === 'number'
                ? product.price.toLocaleString('vi-VN') + 'đ'
                : 'Liên hệ'}
            </PriceTypography>

            {/* Promotions */}
            <Box sx={{ border: '1px dashed #d32f2f', p: 1.5, borderRadius: 1 }}>
              <Typography variant='body2' color='error' fontWeight={700}>
                <LocalOfferIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                KHUYẾN MÃI - ƯU ĐÃI
              </Typography>

              {/* 👇 Thêm các voucher từ API ở đây */}
              {coupons.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {coupons.slice(0, 3).map((coupon) => (
                    <Typography key={coupon.code} variant='body2'>
                      👉 Nhập mã <b>{coupon.code}</b> GIẢM{' '}
                      {coupon.type === 'percent'
                        ? `${coupon.amount}%${coupon.maxDiscount ? ` tối đa ${coupon.maxDiscount.toLocaleString()}đ` : ''}`
                        : `${coupon.amount.toLocaleString()}đ`}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>

            {/* Coupon Chips */}
            <Box>
              <Typography variant='body2' fontWeight={700} sx={{ mb: 0.5 }}>
                Mã giảm giá
              </Typography>
              {coupons.length > 0 &&
                coupons
                  .slice(0, 3)
                  .map((coupon) => (
                    <VoucherChip
                      key={coupon.code}
                      label={`VOUCHER ${
                        coupon.type === 'percent'
                          ? `${coupon.amount}%`
                          : `${coupon.amount.toLocaleString()}đ`
                      }`}
                      onClick={() => setOpenVoucherDrawer(true)}
                    />
                  ))}
            </Box>

            {/* Màu, size, số lượng */}
            <Box>
              <Typography variant='body2' fontWeight={700}>
                Chọn màu
              </Typography>
              <div>
                <strong>Màu sắc:</strong>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  {product.colors.map((color, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '5px'
                      }}
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </Box>

            <Box>
              <Typography variant='body2' fontWeight={700}>
                Chọn kích cỡ
              </Typography>
              <ButtonGroup>
                {sizes.map((s) => (
                  <Button
                    key={s}
                    variant={size === s ? 'contained' : 'outlined'}
                    onClick={() => setSize(s)}
                    sx={
                      size === s
                        ? {
                            backgroundColor: '#1A3C7B',
                            color: '#fff',
                            '&:hover': {
                              backgroundColor: '#162f63'
                            }
                          }
                        : undefined
                    }
                  >
                    {s}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant='body2' fontWeight={700}>
                Số lượng
              </Typography>
              <IconButton
                onClick={() => setQuantity((q) => Math.max(1, Number(q) - 1))}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                value={quantity === '' ? '' : quantity}
                size='small'
                sx={{ width: 50, mx: 1 }}
                inputProps={{ style: { textAlign: 'center' }, readOnly: true }}
              />
              <IconButton
                onClick={handleIncrease}
                disabled={quantity >= product.quantity}
              >
                <AddIcon />
              </IconButton>
              <Typography color='text.secondary' ml={2}>
                Kho: {product.quantity}
              </Typography>
            </Box>

            {/* Nút thao tác */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant='contained'
                color='primary'
                disabled={isAdding}
                onClick={handleAddToCart}
                sx={{ backgroundColor: '#1A3C7B', color: 'white' }}
                startIcon={
                  isAdding ? (
                    <CircularProgress size={20} color='inherit' />
                  ) : null
                }
              >
                {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ'}
              </Button>
              <Button
                variant='outlined'
                onClick={handleBuyNow}
                sx={{ backgroundColor: '#1A3C7B', color: 'white' }}
              >
                Mua ngay
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* Mô tả sản phẩm */}
      <Box sx={{ mt: 5 }}>
        <Typography variant='h6'>MÔ TẢ SẢN PHẨM</Typography>
        <Typography variant='body2'>
          {product.description || 'Không có mô tả.'}
        </Typography>
      </Box>

      {/* Snackbar + Drawer */}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(null)}
          severity={snackbar?.type}
          sx={{ width: '100%' }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>

      <Drawer
        anchor='right'
        open={openVoucherDrawer}
        onClose={() => setOpenVoucherDrawer(false)}
      >
        <Box
          sx={{
            width: 400,
            height: '100vh', // cho Drawer full chiều cao màn hình
            pt: 8,
            px: 2,
            pb: 4,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant='h6' gutterBottom>
            Danh sách mã giảm giá
          </Typography>

          {/* Container danh sách voucher scroll được */}
          <Box
            sx={{
              flexGrow: 1, // phần này chiếm hết không gian còn lại
              overflowY: 'auto',
              pr: 1,
              mt: 1
            }}
          >
            {coupons.map((coupon) => {
              const valueText =
                coupon.type === 'percent'
                  ? `${coupon.amount}%`
                  : `${coupon.amount.toLocaleString()}đ`
              const minOrderText = coupon.minOrderValue
                ? `Đơn tối thiểu ${formatCurrencyShort(coupon.minOrderValue)}`
                : ''

              return (
                <Card
                  key={coupon.code}
                  sx={{
                    borderRadius: 4,
                    boxShadow: 6,
                    p: 2,
                    backgroundColor: '#fff',
                    border: '3px dashed #a6a6a6',
                    height: 130,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2
                  }}
                >
                  {/* Left Section */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant='subtitle2' color='text.secondary'>
                      VOUCHER
                    </Typography>
                    <Typography variant='h6' fontWeight='bold' color='#1A3C7B'>
                      {valueText}
                    </Typography>
                    <Tooltip title={coupon.code}>
                      <Typography
                        variant='body1'
                        color='#1A3C7B'
                        mt={0.5}
                        sx={{
                          maxWidth: '150px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        Mã: <strong>{coupon.code}</strong>
                      </Typography>
                    </Tooltip>
                  </Box>

                  {/* Right Section */}
                  <Box sx={{ ml: 3, minWidth: 130 }}>
                    {minOrderText && (
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        display='block'
                      >
                        {minOrderText}
                      </Typography>
                    )}
                    <Tooltip
                      title={
                        copiedCode === coupon.code
                          ? 'Đã sao chép'
                          : 'Sao chép mã'
                      }
                    >
                      <Button
                        variant='contained'
                        size='medium'
                        sx={{
                          backgroundColor: '#1A3C7B',
                          color: '#fff',
                          mt: 2
                        }}
                        onClick={() => handleCopy(coupon.code)}
                        fullWidth
                      >
                        Sao chép
                      </Button>
                    </Tooltip>
                  </Box>
                </Card>
              )
            })}
          </Box>

          <Button
            variant='outlined'
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => setOpenVoucherDrawer(false)}
          >
            Đóng
          </Button>
        </Box>
      </Drawer>
    </Container>
  )
}

export default ProductDetail
