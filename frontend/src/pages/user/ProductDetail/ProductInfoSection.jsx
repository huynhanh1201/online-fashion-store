import React from 'react'
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  IconButton,
  TextField,
  Chip,
  CircularProgress
} from '@mui/material'
import { styled } from '@mui/system'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'

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

const ColorBox = styled(Box)(({ selected }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '5px 10px',
  backgroundColor: selected ? '#e3f2fd' : '#f0f0f0',
  border: selected ? '2px solid #1A3C7B' : 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  gap: 8
}))

const ColorImage = styled('img')({
  width: 24,
  height: 24,
  objectFit: 'cover',
  borderRadius: '4px'
})

const ProductInfoSection = ({
  product,
  quantity,
  setQuantity,
  size,
  setSize,
  colors,
  sizes = [],
  coupons,
  isAdding,
  handleAddToCart,
  handleBuyNow,
  setOpenVoucherDrawer,
  selectedColor,
  setSelectedColor
}) => {
  const handleColorSelect = (color) => {
    setSelectedColor(color)
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 670 }}
    >
      <Typography
        variant='h5'
        fontWeight={700}
        sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
      >
        {product?.name || 'Sản phẩm không tên'}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {product?.discountPrice ? (
          <>
            <Typography
              variant='h5'
              sx={{ color: 'text.secondary', textDecoration: 'line-through' }}
            >
              {product.price.toLocaleString('vi-VN')}đ
            </Typography>
            <PriceTypography variant='h5'>
              {product.discountPrice.toLocaleString('vi-VN')}đ
            </PriceTypography>
          </>
        ) : (
          <PriceTypography variant='h5'>
            {typeof product?.price === 'number'
              ? product.price.toLocaleString('vi-VN') + 'đ'
              : 'Liên hệ'}
          </PriceTypography>
        )}
      </Box>

      <Box sx={{ border: '1px dashed #d32f2f', p: 1.5, borderRadius: 1 }}>
        <Typography variant='body2' color='error' fontWeight={700}>
          <LocalOfferIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          KHUYẾN MÃI - ƯU ĐÃI
        </Typography>
        {coupons?.length > 0 ? (
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
        ) : (
          <Typography variant='body2' sx={{ mt: 1 }}>
            👉 Đang cập nhật khuyến mãi mới!
          </Typography>
        )}
      </Box>

      {coupons?.length > 0 && (
        <Box>
          <Typography variant='body2' fontWeight={700} sx={{ mb: 0.5 }}>
            Mã giảm giá
          </Typography>
          {coupons.slice(0, 3).map((coupon) => (
            <VoucherChip
              key={coupon.code}
              label={`VOUCHER ${coupon.type === 'percent' ? `${coupon.amount}%` : `${coupon.amount.toLocaleString()}đ`}`}
              onClick={() => setOpenVoucherDrawer(true)}
            />
          ))}
        </Box>
      )}

      <Box>
        <Typography variant='body2' fontWeight={700}>
          Chọn màu
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
          {colors?.length > 0 ? (
            colors
              .filter((color) => color.isActive)
              .map((color, index) => (
                <ColorBox
                  key={color._id || index}
                  selected={selectedColor === color.name}
                  onClick={() => handleColorSelect(color.name)}
                >
                  <ColorImage
                    src={color.image || '/default.jpg'}
                    alt={color.name}
                    onError={(e) => (e.target.src = '/default.jpg')}
                  />
                  <Typography variant='body2'>{color.name}</Typography>
                </ColorBox>
              ))
          ) : (
            <Typography variant='body2' color='text.secondary'>
              Không có màu sắc nào.
            </Typography>
          )}
        </Box>
      </Box>

      <Box>
        <Typography variant='body2' fontWeight={700}>
          Chọn kích cỡ
        </Typography>
        <ButtonGroup sx={{ mt: 0.5 }}>
          {sizes?.length > 0 ? (
            sizes.map((s, index) => (
              <Button
                key={s || index}
                variant={size === s ? 'contained' : 'outlined'}
                onClick={() => setSize(s)}
                sx={
                  size === s
                    ? {
                        backgroundColor: '#1A3C7B',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#162f63' }
                      }
                    : undefined
                }
              >
                {s}
              </Button>
            ))
          ) : (
            <Typography variant='body2' color='text.secondary'>
              Không có kích thước nào.
            </Typography>
          )}
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
          sx={{ width: 50 }}
          inputProps={{ style: { textAlign: 'center' }, readOnly: true }}
        />
        <IconButton
          onClick={() =>
            setQuantity((q) =>
              product && q < product.quantity ? Number(q) + 1 : q
            )
          }
        >
          <AddIcon />
        </IconButton>
        <Typography color='text.secondary'>
          Kho: {product?.quantity || 0}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant='contained'
          disabled={isAdding}
          onClick={handleAddToCart}
          sx={{ backgroundColor: '#1A3C7B', color: 'white', flex: 1, py: 1.5 }}
          startIcon={
            isAdding ? <CircularProgress size={20} color='inherit' /> : null
          }
        >
          {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ'}
        </Button>
        <Button
          variant='outlined'
          onClick={handleBuyNow}
          sx={{ borderColor: '#1A3C7B', color: '#1A3C7B', flex: 1, py: 1.5 }}
        >
          Mua ngay
        </Button>
      </Box>
    </Box>
  )
}

export default ProductInfoSection
