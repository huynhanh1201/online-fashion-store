import React from 'react'
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Chip,
  CircularProgress
} from '@mui/material'
import { styled } from '@mui/system'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'
import SizeGuide from './SizeGuide/SizeGuide.jsx'

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

const VariantBox = styled(Box)(({ selected }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  backgroundColor: selected ? '#e3f2fd' : '#f9f9f9',
  border: selected ? '1px solid #1A3C7B' : '1px solid #e0e0e0',
  borderRadius: '8px',
  cursor: 'pointer',
  gap: 10,
  '&:hover': {
    backgroundColor: selected ? '#e3f2fd' : '#f0f0f0',
    borderColor: selected ? '#1A3C7B' : '#bdbdbd'
  }
}))

const VariantImage = styled('img')({
  width: 40,
  height: 40,
  objectFit: 'cover',
  borderRadius: '6px'
})

const ProductInfoSection = ({
  product,
  quantity,
  setQuantity,
  coupons,
  isAdding,
  handleAddToCart,
  handleBuyNow,
  setOpenVoucherDrawer,
  variants,
  selectedVariant,
  availableColors,
  availableSizes,
  selectedColor,
  selectedSize,
  handleColorChange,
  handleSizeChange,
  getCurrentPrice,
  inventory
}) => {
  const currentPrice = getCurrentPrice()

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 670 }}
    >
      <Typography
        variant='h5'
        fontWeight={700}
        sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', mb: 1 }}
      >
        {product?.name}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {currentPrice?.discountPrice ? (
          <>
            <Typography
              variant='h5'
              sx={{
                color: 'text.secondary',
                textDecoration: 'line-through',
                fontSize: 20
              }}
            >
              {currentPrice.price.toLocaleString('vi-VN')}đ
            </Typography>
            <PriceTypography variant='h5' sx={{ fontSize: 22 }}>
              {currentPrice.discountPrice.toLocaleString('vi-VN')}đ
            </PriceTypography>
          </>
        ) : (
          <PriceTypography variant='h5' sx={{ fontSize: 22 }}>
            {typeof currentPrice?.price === 'number'
              ? currentPrice.price.toLocaleString('vi-VN') + 'đ'
              : 'Liên hệ'}
          </PriceTypography>
        )}
      </Box>

      <Box sx={{ border: '1px dashed #d32f2f', p: 1, borderRadius: 1, mb: 1 }}>
        <Typography
          variant='body2'
          color='error'
          fontWeight={700}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
        >
          <LocalOfferIcon /> KHUYẾN MÃI - ƯU ĐÃI
        </Typography>
        {coupons?.length > 0 ? (
          <Box>
            {coupons.slice(0, 3).map((coupon) => (
              <Typography key={coupon.code} variant='body2' sx={{ mb: 0.25 }}>
                👉 Nhập mã <b>{coupon.code}</b> GIẢM{' '}
                {coupon.type === 'percent'
                  ? `${coupon.amount}%${coupon.maxDiscount ? ` tối đa ${coupon.maxDiscount.toLocaleString()}đ` : ''}`
                  : `${coupon.amount.toLocaleString()}đ`}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant='body2'>
            👉 Đang cập nhật khuyến mãi mới!
          </Typography>
        )}
      </Box>

      {coupons?.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography variant='body2' fontWeight={700} sx={{ mb: 0.25 }}>
            Mã giảm giá
          </Typography>
          {coupons.slice(0, 3).map((coupon) => (
            <VoucherChip
              key={coupon.code}
              label={`VOUCHER ${coupon.type === 'percent' ? `${coupon.amount}%` : `${coupon.amount.toLocaleString()}đ`}`}
              onClick={() => setOpenVoucherDrawer(true)}
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>
      )}

      {variants?.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography variant='body2' fontWeight={700} sx={{ mb: 0.5 }}>
            Chọn phiên bản
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {availableColors?.map((color) => (
              <Box key={color.name} sx={{ mb: 0.5 }}>
                <Typography
                  variant='body2'
                  fontWeight={600}
                  sx={{ mb: 0.5, color: '#666' }}
                >
                  Màu: {color.name}
                </Typography>
                <Box
                  sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}
                >
                  {availableSizes
                    ?.filter((size) =>
                      variants.some(
                        (v) =>
                          v.color.name === color.name &&
                          v.size.name === size.name
                      )
                    )
                    ?.map((size) => {
                      const variant = variants.find(
                        (v) =>
                          v.color.name === color.name &&
                          v.size.name === size.name
                      )
                      const isSelected =
                        selectedColor === color.name &&
                        selectedSize === size.name

                      return (
                        <VariantBox
                          key={`${color.name}-${size.name}`}
                          selected={isSelected}
                          onClick={() => {
                            if (isSelected) {
                              handleColorChange(null)
                              handleSizeChange(null)
                            } else {
                              handleColorChange(color.name)
                              handleSizeChange(size.name)
                            }
                          }}
                          sx={{ p: '4px 8px', minHeight: 40 }}
                        >
                          <VariantImage
                            src={
                              optimizeCloudinaryUrl(color.image) ||
                              '/default.jpg'
                            }
                            alt={color.name}
                            onError={(e) => (e.target.src = '/default.jpg')}
                          />

                          <Box>
                            <Typography
                              variant='body2'
                              fontWeight={600}
                              sx={{ fontSize: 14 }}
                            >
                              Size {size.name}
                            </Typography>
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              {variant?.exportPrice?.toLocaleString('vi-VN')}đ
                            </Typography>
                          </Box>
                        </VariantBox>
                      )
                    })}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1
        }}
      >
        {/* Bên trái: Số lượng + Kho */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant='body2' fontWeight={700}>
            Số lượng
          </Typography>
          <IconButton
            onClick={() => setQuantity((q) => Math.max(1, Number(q) - 1))}
            size='small'
          >
            <RemoveIcon fontSize='small' />
          </IconButton>
          <TextField
            value={quantity === '' ? '' : quantity}
            size='small'
            sx={{ width: 40 }}
            inputProps={{
              style: { textAlign: 'center', padding: 4 },
              readOnly: true
            }}
          />
          <IconButton
            onClick={() =>
              setQuantity((q) => {
                const maxQuantity =
                  inventory?.quantity ??
                  selectedVariant?.quantity ??
                  product?.quantity ??
                  0
                return q < maxQuantity ? q + 1 : q
              })
            }
            size='small'
          >
            <AddIcon fontSize='small' />
          </IconButton>
          <Typography color='text.secondary' sx={{ fontSize: 13 }}>
            Kho:{' '}
            {inventory?.quantity ??
              selectedVariant?.quantity ??
              product?.quantity ??
              0}
          </Typography>
        </Box>

        {/* Bên phải: Hướng dẫn chọn size */}
        <SizeGuide />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
        <Button
          variant='contained'
          disabled={
            isAdding ||
            quantity >
              (inventory?.quantity ??
                selectedVariant?.quantity ??
                product?.quantity ??
                0)
          }
          onClick={() => handleAddToCart(product._id)}
          sx={{ backgroundColor: '#1A3C7B', color: 'white', flex: 1, py: 1 }}
          startIcon={
            isAdding ? <CircularProgress size={18} color='inherit' /> : null
          }
        >
          {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ'}
        </Button>

        <Button
          variant='outlined'
          onClick={handleBuyNow}
          sx={{ borderColor: '#1A3C7B', color: '#1A3C7B', flex: 1, py: 1 }}
        >
          Mua ngay
        </Button>
      </Box>
    </Box>
  )
}

export default ProductInfoSection
