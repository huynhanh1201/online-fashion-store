/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { styled } from '@mui/system'
import { ChooseAddressModal } from './Modal/ChooseAddressModal'
import { useAddress } from '~/hooks/useAddress'
import useCoupon from '~/hooks/useCoupon'
import { useCart } from '~/hooks/useCarts'
import { useOrder } from '~/hooks/useOrder'
import { useSelector, useDispatch } from 'react-redux'
import { clearTempCart } from '~/redux/cart/cartSlice'
import { useLocation, useNavigate } from 'react-router-dom'
import CouponItem from '~/components/Coupon/CouponItem'
import { getDiscounts } from '~/services/discountService'

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.3rem',
  marginBottom: theme.spacing(2),
  textTransform: 'uppercase',
  color: '#1A3C7B'
}))

const ProductItem = ({ name, price, quantity, image, color, size }) => {
  if (!name || typeof price !== 'number' || typeof quantity !== 'number') {
    return (
      <tr>
        <td colSpan={3} style={{ color: 'red', padding: 8 }}>
          Lỗi: Dữ liệu sản phẩm không hợp lệ.
        </td>
      </tr>
    )
  }

  const truncatedName = name.length > 20 ? name.slice(0, 20) + '...' : name

  return (
    <tr>
      <td style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 8 }}>
        <img
          src={image || 'https://via.placeholder.com/64'}
          alt={name}
          style={{ width: 84, height: 84, borderRadius: 8, objectFit: 'cover' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography fontWeight={600}>{truncatedName}</Typography>
          <Typography variant="caption" color="text.secondary">
            {color || 'Chưa chọn màu'}, {size || 'Chưa chọn kích cỡ'}
          </Typography>
        </div>
      </td>
      <td style={{ textAlign: 'center' }}>{quantity}</td>
      <td style={{ textAlign: 'right' }}>
        {(price * quantity).toLocaleString('vi-VN')}đ
      </td>
    </tr>
  )
}

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('')
  const [openAddressModal, setOpenAddressModal] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [note, setNote] = useState('')
  const [voucherInput, setVoucherInput] = useState('')
  const [voucherApplied, setVoucherApplied] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'info',
    message: ''
  })
  const [coupons, setCoupons] = useState([])
  const [couponLoading, setCouponLoading] = useState(true)
  const [couponError, setCouponError] = useState(null)
  const [copiedCode, setCopiedCode] = useState('')

  const { addresses, fetchAddresses } = useAddress()
  const { loading: cartLoading } = useCart()
  const { createOrder, loading: orderLoading } = useOrder()
  const { discount, discountMessage, loading: voucherLoading, handleApplyVoucher, couponId } = useCoupon()
  const selectedItems = useSelector(state => state.cart.selectedItems || [])
  const cartCartItems = useSelector(state => state.cart.cartItems)
  const tempCart = useSelector(state => state.cart.tempCart)
  const isBuyNow = useSelector(state => state.cart.isBuyNow)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // Xác định cartItems
  const cartItems = isBuyNow && tempCart?.cartItems?.length > 0 ? tempCart.cartItems : cartCartItems

  const [shippingPrice, setShippingPrice] = useState(0)
  const [shippingPriceLoading, setShippingPriceLoading] = useState(false)


  // Tính selectedCartItems + subTotal
  let subTotal = 0
  const selectedCartItems = cartItems
    .filter(item => {
      if (isBuyNow) return true
      return selectedItems.some(selected => {
        const itemVariantId = String(item.variantId?._id || item.variantId)
        const selectedVariantId = String(selected.variantId)
        return (
          selectedVariantId === itemVariantId &&
          selected.color === item.color &&
          selected.size === item.size
        )
      })
    })
    .map(item => {
      const variant = item.variantId || {}
      const variantId = String(variant._id || item.variantId)
      const price = typeof variant.exportPrice === 'number' ? variant.exportPrice : 0
      const quantity = typeof item.quantity === 'number' ? item.quantity : 1
      subTotal += price * quantity
      return { variantId, color: item.color, size: item.size, quantity }
    })
  useEffect(() => {
    if (selectedAddress && selectedCartItems.length > 0) {
      fetchShippingPrice(selectedAddress, selectedCartItems)
    } else {
      setShippingPrice(0)
    }
  }, [selectedAddress])
  const fetchShippingPrice = async (address, items) => {
    if (!address || !items?.length) {
      console.warn('fetchShippingPrice: Thiếu address hoặc items', { address, items })
      setShippingPrice(0)
      return
    }

    try {
      setShippingPriceLoading(true)
      const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0)

      const payload = {
        numberItemOrder: totalItems,
        service_type_id: 2,
        to_district_id: parseInt(address.districtId, 10),
        to_ward_code: address.wardId,
        insurance_value: 0,
        coupon: null,
      }

      console.log('fetchShippingPrice payload:', payload)

      const response = await fetch('http://localhost:8017/v1/deliveries/calculate-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Lỗi từ API: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      console.log('fetchShippingPrice response:', data)

      const fee = data?.totalFeeShipping
      if (typeof fee !== 'number' || fee <= 0) {
        throw new Error('Phí vận chuyển không hợp lệ hoặc bằng 0')
      }

      setShippingPrice(fee)
    } catch (error) {
      console.error('Lỗi tính phí vận chuyển:', error.message)
      setShippingPrice(0)
      setSnackbar({
        open: true,
        severity: 'error',
        message: `Không thể tính phí vận chuyển: ${error.message}`,
      })
    } finally {
      setShippingPriceLoading(false)
    }
  }
  // Debug Redux state
  useEffect(() => {
  }, [cartItems, selectedItems, selectedCartItems, subTotal])

  // Lấy danh sách coupon
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getDiscounts()
        console.log('Dữ liệu từ getDiscounts trong Payment:', response)
        const { discounts } = response
        if (!Array.isArray(discounts)) {
          throw new Error('Dữ liệu coupon không hợp lệ')
        }
        const validCoupons = discounts
          .filter(coupon => coupon && coupon._id)
          .map(coupon => ({
            ...coupon,
            isApplicable: !coupon.minOrderValue || subTotal >= coupon.minOrderValue
          }))
          .sort((a, b) => {
            if (a.isApplicable !== b.isApplicable) {
              return b.isApplicable - a.isApplicable
            }
            return new Date(b.createdAt || new Date()) - new Date(a.createdAt || new Date())
          })
        setCoupons(validCoupons)
        setCouponLoading(false)
      } catch (error) {
        console.error('Lỗi lấy coupon:', error)
        setCouponError(error.message || 'Không thể tải coupon')
        setCouponLoading(false)
      }
    }
    fetchCoupons()
  }, [subTotal])
  const formatCurrencyShort = (value) => {
    if (typeof value !== 'number') return '0'
    const units = [
      { threshold: 1_000_000, suffix: 'Tr' },
      { threshold: 1_000, suffix: 'K' }
    ]
    for (const { threshold, suffix } of units) {
      if (value >= threshold) {
        const shortValue = Math.floor(value / threshold)
        return `${shortValue}${suffix}`
      }
    }
    return value.toString()
  }

  const handleCouponSelect = (code) => {
    if (!code || code === 'N/A') return
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setVoucherInput(code)
    setVoucherApplied(false)
    setTimeout(() => setCopiedCode(''), 1500)
  }

  const totalOrder = Math.max(subTotal - discount)
  const totalFeeShipping = totalOrder + shippingPrice

  console.log('shippingPrice:', shippingPrice)
  console.log('totalOrder:', totalOrder)

  useEffect(() => {
    const isOnPaymentPage = location.pathname.startsWith('/payment')
    if (!isOnPaymentPage && isBuyNow) {
      dispatch(clearTempCart())
    }
  }, [location, isBuyNow, dispatch])

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find(addr => addr.isDefault)
      setSelectedAddress(defaultAddr || addresses[0])
    }
  }, [addresses, selectedAddress])

  const handleOpenAddressModal = () => setOpenAddressModal(true)
  const handleCloseAddressModal = () => setOpenAddressModal(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleAddressConfirm = (addressId) => {
    const selected = addresses.find(addr => addr._id === addressId)
    setSelectedAddress(selected)
    handleCloseAddressModal()
  }

  const handleAddressListUpdated = async () => {
    await fetchAddresses(true)
  }

  const handleApplyVoucherClick = async () => {
    if (!voucherInput.trim()) {
      setSnackbar({
        open: true,
        severity: 'warning',
        message: 'Vui lòng nhập mã giảm giá'
      })
      return
    }

    try {
      const response = await handleApplyVoucher(voucherInput.trim(), subTotal)
      if (response?.valid) {
        setVoucherApplied(true)
        setSnackbar({
          open: true,
          severity: 'success',
          message: response.message || 'Áp dụng mã giảm giá thành công'
        })
      } else {
        setVoucherApplied(false)
        setSnackbar({
          open: true,
          severity: 'error',
          message: response?.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn'
        })
      }
    } catch (err) {
      setVoucherApplied(false)
      setSnackbar({
        open: true,
        severity: 'error',
        message: err.message || 'Có lỗi xảy ra khi áp dụng mã giảm giá'
      })
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setSnackbar({
        open: true,
        severity: 'warning',
        message: 'Vui lòng chọn địa chỉ nhận hàng',
      })
      return
    }
    if (!paymentMethod) {
      setSnackbar({
        open: true,
        severity: 'warning',
        message: 'Vui lòng chọn phương thức thanh toán', // Sửa thông báo
      })
      return
    }
    if (cartItems.length === 0 || selectedCartItems.length === 0) {
      setSnackbar({ open: true, severity: 'error', message: 'Giỏ hàng trống' })
      return
    }
    if (shippingPrice === 0 && !shippingPriceLoading) {
      setSnackbar({
        open: true,
        severity: 'warning',
        message: 'Phí vận chuyển không hợp lệ, vui lòng kiểm tra lại',
      })
      return
    }
    if (totalOrder <= 0) {
      setSnackbar({
        open: true,
        severity: 'warning',
        message: 'Tổng đơn hàng không hợp lệ, vui lòng kiểm tra lại',
      })
      return
    }

    const sanitizedCartItems = selectedCartItems.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }))

    const orderData = {
      cartItems: sanitizedCartItems,
      shippingAddressId: selectedAddress._id,
      total: totalOrder,
      paymentMethod,
      note: note.trim() || null, // Thay undefined bằng null để đảm bảo gửi lên
      couponCode: voucherApplied ? voucherInput : null, // Thay undefined bằng null
      couponId: voucherApplied ? couponId : null, // Thay undefined bằng null
      shippingFee: shippingPrice || 0, // Đảm bảo shippingFee luôn được gửi
    }

    console.log('orderData trước khi gửi:', orderData)   // Debug orderData

    try {
      const result = await createOrder(orderData)
      console.log('createOrder response:', result)   // Debug server response
      setSnackbar({
        open: true,
        severity: 'success',
        message: 'Đặt hàng thành công',
      })
      dispatch(clearTempCart())
      if (typeof result === 'string' && result.startsWith('http')) {
        window.location.href = result
      } else {
        navigate('/order-success')
      }
    } catch (error) {
      console.error('Lỗi đặt hàng:', error)
      setSnackbar({
        open: true,
        severity: 'error',
        message: `Đặt hàng thất bại: ${error.message || error}`,
      })
    }
  }

  return (
    <Box>
      <Container maxWidth={false} sx={{ py: 4, px: 3, minHeight: '70vh' }}>
        {cartLoading ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container justifyContent="center" spacing={4}>
            <Grid item xs={12} md={12} lg={8}>
              {/* Địa chỉ nhận hàng */}
              <SectionTitle>Địa chỉ nhận hàng</SectionTitle>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  p: 2,
                  mb: 4,
                  width: '100%',
                  minWidth: { xs: '100%', sm: 500, md: 800 }
                }}
              >
                {selectedAddress ? (
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography fontWeight={700} sx={{ fontSize: '1.1rem' }}>
                        {selectedAddress.fullName} (+84) {selectedAddress.phone}
                      </Typography>
                      <Typography sx={{ fontSize: '1rem' }}>
                        {selectedAddress.address}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.city}
                      </Typography>
                    </Box>
                    <Typography
                      component="span"
                      sx={{ color: '#3f51b5', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '1rem' }}
                      onClick={handleOpenAddressModal}
                    >
                      Thay Đổi
                    </Typography>
                  </Box>
                ) : (
                  <Typography sx={{ fontSize: '1rem' }}>
                    Chưa có địa chỉ
                    <Typography
                      component="span"
                      sx={{ color: '#3f51b5', cursor: 'pointer', ml: 1, fontSize: '1rem' }}
                      onClick={handleOpenAddressModal}
                    >
                      Chọn Địa Chỉ
                    </Typography>
                  </Typography>
                )}
              </Box>

              {/* Ghi chú đơn hàng */}
              <SectionTitle>Ghi chú đơn hàng</SectionTitle>
              <TextField
                fullWidth
                label="Ghi chú đơn hàng (không bắt buộc)"
                value={note}
                onChange={e => setNote(e.target.value)}
                variant="outlined"
                rows={3}
                multiline
                sx={{
                  mb: 4,
                  backgroundColor: '#fff',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#1A3C7B'
                    },
                    '&:hover fieldset': {
                      borderColor: '#1A3C7B'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1A3C7B',
                      borderWidth: '2px'
                    }
                  }
                }}
              />

              {/* Phương thức vận chuyển */}
              <SectionTitle>Phương thức vận chuyển</SectionTitle>
              <Box
                sx={{
                  border: '2px solid',
                  borderColor: '#1A3C7B',
                  borderRadius: 1,
                  p: 2,
                  mb: 2
                }}
              >
                <RadioGroup defaultValue="Ship">
                  <FormControlLabel
                    value="Ship"
                    control={
                      <Radio
                        sx={{
                          color: '#ccc',
                          '&.Mui-checked': { color: '#1A3C7B' }
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          src="https://file.hstatic.net/1000360022/file/giaohangnhanh_abaa5d524e464a0c8547a91ad9b50968.png"
                          alt="Ship"
                          style={{ height: 32, marginRight: 8 }}
                        />
                        <span style={{ fontSize: '1rem' }}>Phí vận chuyển: </span>
                        <span style={{ fontSize: '1rem' }}>
                          {shippingPriceLoading ? (
                            <CircularProgress size={16} />
                          ) : shippingPrice === 0 ? (
                            'Miễn phí'
                          ) : (
                            shippingPrice.toLocaleString('vi-VN') + 'đ'
                          )}
                        </span>
                      </Box>
                    }
                  />
                </RadioGroup>

              </Box>

              {/* Hình thức thanh toán */}
              <SectionTitle>Hình thức thanh toán</SectionTitle>
              {/* COD */}
              <Box
                sx={{
                  border: '2px solid',
                  borderColor: paymentMethod === 'COD' ? '#1A3C7B' : '#ccc',
                  borderRadius: 1,
                  p: 2,
                  mb: 2
                }}
              >
                <RadioGroup value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <FormControlLabel
                    value="COD"
                    control={<Radio sx={{ color: '#ccc', '&.Mui-checked': { color: '#1A3C7B' } }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          src="https://file.hstatic.net/1000360022/file/img_payment_method_5_23d8b98ee8c7456bab146250bedbc1a4.png"
                          alt="COD"
                          style={{ height: 32, marginRight: 8 }}
                        />
                        <Typography sx={{ fontSize: '1rem' }}>
                          Thanh toán khi nhận hàng (COD)
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </Box>

              {/* VNPay */}
              <Box
                sx={{
                  border: '2px solid',
                  borderColor: paymentMethod === 'vnpay' ? '#1A3C7B' : '#ccc',
                  borderRadius: 1,
                  p: 2,
                  mb: 2
                }}
              >
                <RadioGroup value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <FormControlLabel
                    value="vnpay"
                    control={<Radio sx={{ color: '#ccc', '&.Mui-checked': { color: '#1A3C7B' } }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          src="https://file.hstatic.net/1000360022/file/img_payment_method_4_7fdbf4cdf59647e684a29799683114f7.png"
                          alt="VNPAY"
                          style={{ height: 32, marginRight: 8 }}
                        />
                        <Typography sx={{ fontSize: '1rem' }}>
                          Ví điện tử VNPAY
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </Box>
            </Grid>

            {/* Right side: Giỏ hàng, ưu đãi và tổng thanh toán */}
            <Grid item xs={12} md={12} lg={4}>
              <SectionTitle>Giỏ hàng</SectionTitle>
              <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2, mb: 2 }}>
                {/* Giỏ hàng */}
                {selectedCartItems.length === 0 ? (
                  <Typography
                    sx={{ textAlign: 'center', py: 4, color: 'text.secondary', fontSize: '1rem' }}
                  >
                    Giỏ hàng trống
                  </Typography>
                ) : (
                  <Box
                    component="table"
                    sx={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      minWidth: { xs: '100%', md: 500 }
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ccc' }}>
                        <th style={{ textAlign: 'left', padding: 8, fontSize: '1.1rem' }}>Sản phẩm</th>
                        <th style={{ textAlign: 'center', padding: 8, fontSize: '1.1rem' }}>Số lượng</th>
                        <th style={{ textAlign: 'right', padding: 8, fontSize: '1.1rem' }}>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCartItems.map((item, index) => {
                        const variant = cartItems.find(cartItem =>
                          String(cartItem.variantId?._id || cartItem.variantId) === item.variantId &&
                          cartItem.color === item.color &&
                          cartItem.size === item.size
                        )?.variantId || {}
                        return (
                          <ProductItem
                            key={index}
                            name={variant.name || 'Sản phẩm không tên'}
                            price={variant.exportPrice || 0}
                            quantity={item.quantity || 1}
                            image={variant.color?.image}
                            color={variant.color?.name}
                            size={variant.size?.name}
                          />
                        )
                      })}
                    </tbody>
                  </Box>
                )}

                {/* Ưu đãi */}
                <Divider sx={{ my: 2 }} />
                <SectionTitle>Ưu đãi dành cho bạn</SectionTitle>
                <TextField
                  fullWidth
                  label="Nhập mã giảm giá"
                  value={voucherInput}
                  onChange={e => {
                    const value = e.target.value.toUpperCase().slice(0, 10)
                    setVoucherInput(value)
                    setVoucherApplied(false)
                  }}
                  size="small"
                  sx={{ mb: 1, '& .MuiInputBase-root': { fontSize: '1rem' } }}
                  disabled={voucherLoading}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleApplyVoucherClick}
                  disabled={voucherLoading || voucherApplied}
                  sx={{
                    backgroundColor: '#1A3C7B',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#3f51b5' },
                    fontSize: '1rem'
                  }}
                >
                  {voucherLoading ? 'Đang áp dụng...' : voucherApplied ? 'Đã áp dụng' : 'Áp dụng Voucher'}
                </Button>

                {discountMessage && (
                  <Typography
                    variant="body2"
                    color={discount > 0 ? 'success.main' : 'error'}
                    mt={1}
                    sx={{ fontSize: '0.95rem' }}
                  >
                    {discountMessage}
                  </Typography>
                )}

                {/* Danh sách coupon */}
                <Box sx={{ mt: 2 }}>
                  {/* <Divider sx={{ mb: 2 }} /> */}
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '1rem', sm: '1rem' },
                      mb: 2,
                      color: 'text.secondary'
                    }}
                  >
                    Các mã giảm giá có sẵn
                  </Typography>
                  {couponLoading ? (
                    <Box display="flex" justifyContent="center" mt={2}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : couponError ? (
                    <Typography color="error" fontSize={{ xs: '0.9rem', sm: '1rem' }} textAlign="center">
                      {couponError}
                    </Typography>
                  ) : coupons.length === 0 ? (
                    <Typography
                      color="text.secondary"
                      fontSize={{ xs: '0.9rem', sm: '1rem' }}
                      textAlign="center"
                    >
                      Không có coupon nào hiện tại
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        maxWidth: 600,
                        overflowX: 'auto',
                        display: 'flex',
                        gap: 2,
                        pb: 1,
                        '&::-webkit-scrollbar': { height: 8 },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: '#ccc',
                          borderRadius: 4
                        }
                      }}
                    >
                      {coupons.map(coupon => (
                        <Box
                          key={coupon._id}
                          sx={{ flex: '0 0 auto', minWidth: { xs: '280px', sm: '300px' } }}
                        >
                          <CouponItem
                            coupon={coupon}
                            onCopy={handleCouponSelect}
                            copiedCode={copiedCode}
                            formatCurrencyShort={formatCurrencyShort}
                            disabled={!coupon.isApplicable}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Tổng thanh toán */}
                <Divider sx={{ my: 2 }} />
                <Typography sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                  <span>Tạm tính:</span>
                  <span>{subTotal.toLocaleString('vi-VN')}đ</span>
                </Typography>
                <Typography sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                  <span>Phí vận chuyển:</span>
                  {shippingPriceLoading ? (
                    <CircularProgress size={24} />
                  ) : shippingPrice === 0 ? (
                    'Miễn phí'
                  ) : (
                    shippingPrice.toLocaleString('vi-VN') + 'đ'
                  )}
                </Typography>

                <Typography sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                  <span>Voucher giảm giá:</span>
                  <span>{discount.toLocaleString('vi-VN')}đ</span>
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <span>Tổng:</span>
                  <span>{totalFeeShipping.toLocaleString('vi-VN')}đ</span>
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    fontSize: '1rem',
                    backgroundColor: '#1A3C7B',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#3f51b5' }
                  }}
                  onClick={() => setConfirmOpen(true)}
                  disabled={orderLoading || selectedCartItems.length === 0}
                >
                  {orderLoading ? 'Đang xử lý...' : 'Đặt hàng'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Modal chọn địa chỉ */}
        <ChooseAddressModal
          open={openAddressModal}
          onClose={handleCloseAddressModal}
          onConfirm={handleAddressConfirm}
          onUpdateAddresses={handleAddressListUpdated}
        />

        {/* Snackbar thông báo */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: '100%', fontSize: '1rem' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Xác nhận đặt hàng</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn đặt hàng không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={() => {
              setConfirmOpen(false)
              handlePlaceOrder()
            }}
            variant="contained"
            sx={{
              backgroundColor: '#1A3C7B',
              color: '#fff',
              '&:hover': { backgroundColor: '#3f51b5' }
            }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Payment