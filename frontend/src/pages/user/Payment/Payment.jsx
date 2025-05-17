import React, { useState, useEffect } from 'react'
import {
  Box, Container, Grid, Typography, TextField, Button,
  Radio, RadioGroup, FormControlLabel, Divider, CircularProgress,
  Snackbar, Alert
} from '@mui/material'
import { styled } from '@mui/system'
import { AddressModal } from './Modal/AddressModal'
import { useAddress } from '~/hook/useAddress'
import useCoupon from '~/hook/useCoupon'
import { useCart } from '~/hook/useCarts'
import { useOrder } from '~/hook/useOrder'

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.1rem',
  marginBottom: theme.spacing(2),
  textTransform: 'uppercase'
}))

const ProductItem = ({ name, price, quantity, image }) => {
  const isValid = name && typeof price === 'number' && typeof quantity === 'number'
  if (!isValid) {
    return (
      <tr>
        <td colSpan={4} style={{ color: 'red', padding: '8px' }}>
          Lỗi: Dữ liệu sản phẩm không hợp lệ.
        </td>
      </tr>
    )
  }

  const truncatedName = name.length > 20 ? name.slice(0, 20) + '...' : name

  return (
    <tr>
      <td style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px' }}>
        <img
          src={image || 'https://via.placeholder.com/64'}
          alt={name}
          style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }}
        />
        <span>{truncatedName}</span>
      </td>
      <td style={{ textAlign: 'center' }}>{price.toLocaleString()}đ</td>
      <td style={{ textAlign: 'center' }}>{quantity}</td>
      <td style={{ textAlign: 'right' }}>{(price * quantity).toLocaleString()}đ</td>
    </tr>
  )
}

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [openAddressModal, setOpenAddressModal] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [note, setNote] = useState('')
  const [voucherInput, setVoucherInput] = useState('')
  const [voucherApplied, setVoucherApplied] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'info', message: '' })

  const { addresses, fetchAddresses } = useAddress()
  const { cart, loading: cartLoading } = useCart()
  const { createOrder, loading: orderLoading } = useOrder()
  const {
    discount, discountMessage,
    loading: couponLoading, handleApplyVoucher, couponId
  } = useCoupon()

  const cartItems = cart?.cartItems || []
  const subTotal = cartItems.reduce((acc, item) => {
    const product = item.product || item.productId || {}
    const price = typeof product.price === 'number' ? product.price : 0
    const quantity = typeof item.quantity === 'number' ? item.quantity : 1
    return acc + price * quantity
  }, 0)

  const total = subTotal - discount

  useEffect(() => {
    if (!addresses || addresses.length === 0) {
      fetchAddresses()
    } else {
      const defaultAddr = addresses.find(addr => addr.isDefault)
      setSelectedAddress(defaultAddr || addresses[0])
    }
  }, [addresses])


  const handleOpenAddressModal = () => setOpenAddressModal(true)
  const handleCloseAddressModal = () => setOpenAddressModal(false)

  const handleAddressConfirm = (addressId) => {
    const selected = addresses.find(addr => addr._id === addressId)
    setSelectedAddress(selected)
    handleCloseAddressModal()
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
        throw new Error(response?.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn')
      }
    } catch (err) {
      setVoucherApplied(false)
      const errorMessage = err?.message || 'Có lỗi xảy ra khi áp dụng mã giảm giá'
      setSnackbar({
        open: true,
        severity: 'error',
        message: errorMessage
      })
    }
  }




  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setSnackbar({ open: true, severity: 'warning', message: 'Vui lòng chọn địa chỉ nhận hàng' })
      return
    }

    const orderData = {
      shippingAddressId: selectedAddress._id,
      total,
      paymentMethod,
    }

    if (note.trim()) orderData.note = note.trim()
    if (voucherApplied) {
      orderData.couponCode = voucherInput
      orderData.couponId = couponId
    }

    try {
      await createOrder(orderData)
      setSnackbar({ open: true, severity: 'success', message: 'Đặt hàng thành công' })
      setTimeout(() => window.location.reload(), 1500)
    } catch (error) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: `Đặt hàng thất bại: ${error.message || error}`
      })
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {cartLoading ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={4} >
            <Grid item md={12} lg={8} >
              {/* Địa chỉ */}
              <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 2 }}>
                <Typography fontWeight={600} mb={1}>Địa Chỉ Nhận Hàng</Typography>
                {selectedAddress ? (
                  <>
                    <Typography fontWeight={700}>
                      {selectedAddress.fullName} (+84) {selectedAddress.phone}
                    </Typography>
                    <Typography>
                      {selectedAddress.address}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.city}
                      <Typography
                        component="span"
                        sx={{ color: 'primary.main', cursor: 'pointer', ml: 1 }}
                        onClick={handleOpenAddressModal}
                      >
                        Thay Đổi
                      </Typography>
                    </Typography>
                  </>
                ) : (
                  <Typography>
                    Chưa có địa chỉ
                    <Typography
                      component="span"
                      sx={{ color: 'primary.main', cursor: 'pointer', ml: 1 }}
                      onClick={handleOpenAddressModal}
                    >
                      Chọn Địa Chỉ
                    </Typography>
                  </Typography>
                )}
              </Box>

              {/* Sản phẩm */}
              <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 2 }}>
                {cartItems.length === 0 ? (
                  <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                    Giỏ hàng trống
                  </Typography>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ccc' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Sản phẩm</th>
                        <th style={{ textAlign: 'center', padding: '8px' }}>Giá</th>
                        <th style={{ textAlign: 'center', padding: '8px' }}>Số lượng</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => {
                        const product = item.product || item.productId || {}
                        return (
                          <ProductItem
                            key={index}
                            name={product.name || 'Sản phẩm không tên'}
                            price={product.price || 0}
                            quantity={item.quantity || 1}
                            image={product.image}
                          />
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </Box>

              {/* Ghi chú */}
              <TextField
                fullWidth
                label="Ghi chú đơn hàng (không bắt buộc)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                variant="outlined"
                rows={3}
                multiline
                sx={{ mb: 2 }}
              />

              {/* Thanh toán */}
              <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
                <SectionTitle>Phương thức thanh toán</SectionTitle>
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <FormControlLabel value="COD" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
                  <FormControlLabel
                    value="vnpay"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          src='https://play-lh.googleusercontent.com/htxII9LeOz8fRkdW0pcvOb88aoc448v9eoxnbKEPK98NLG6iX5mSd4dbu3PX9j36dwy9=w480-h960-rw'
                          alt='VNPAY'
                          style={{ width: 24, marginRight: 8 }}
                        />
                        Thanh toán qua VNPay
                      </Box>
                    }
                  />
                </RadioGroup>
              </Box>
            </Grid>

            {/* Tổng cộng */}
            <Grid item md={12} lg={4}>
              <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
                <SectionTitle>Ưu đãi</SectionTitle>
                <TextField
                  fullWidth
                  label="Nhập mã giảm giá"
                  value={voucherInput}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().slice(0, 10)
                    setVoucherInput(value)
                    setVoucherApplied(false)
                  }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleApplyVoucherClick}
                  disabled={couponLoading}
                >
                  {couponLoading ? 'Đang áp dụng...' : 'Áp dụng Voucher'}
                </Button>
                {discountMessage && (
                  <Typography variant="body2" color={discount > 0 ? 'success.main' : 'error'} mt={1}>
                    {discountMessage}
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Phí vận chuyển</span><span>0đ</span>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Giảm giá</span><span>{discount.toLocaleString()}đ</span>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tạm tính</span><span>{subTotal.toLocaleString()}đ</span>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, mt: 1 }}>
                    <span>Tổng cộng</span><span style={{ color: '#1976d2' }}>{total.toLocaleString()}đ</span>
                  </Box>
                </Box>

                <Typography variant="body2" color="success.main" mt={2}>
                  Miễn phí vận chuyển
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                >
                  {orderLoading ? 'Đang đặt hàng...' : 'Đặt hàng'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}

        <AddressModal
          open={openAddressModal}
          onClose={handleCloseAddressModal}
          onConfirm={handleAddressConfirm}
          addresses={addresses}
          selectedAddressId={selectedAddress?._id}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Góc phải trên
        >
          <Alert
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Container>
    </Box>
  )
}

export default Payment
