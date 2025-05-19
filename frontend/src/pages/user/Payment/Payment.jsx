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
} from '@mui/material'
import { styled } from '@mui/system'
import { ChooseAddressModal } from './Modal/ChooseAddressModal'

import { useAddress } from '~/hook/useAddress'
import useCoupon from '~/hook/useCoupon'
import { useCart } from '~/hook/useCarts'
import { useOrder } from '~/hook/useOrder'
import { useSelector } from 'react-redux'

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.1rem',
  marginBottom: theme.spacing(2),
  textTransform: 'uppercase',
}))
const ProductItem = ({ name, price, quantity, image }) => {
  // Validate product data
  if (!name || typeof price !== 'number' || typeof quantity !== 'number') {
    return (
      <tr>
        <td colSpan={4} style={{ color: 'red', padding: 8 }}>
          Lỗi: Dữ liệu sản phẩm không hợp lệ.
        </td>
      </tr>
    )
  }

  const truncatedName = name.length > 20 ? name.slice(0, 20) + '...' : name

  return (
    <tr>
      <td style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8 }}>
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
  const { loading: cartLoading } = useCart()
  const { createOrder, loading: orderLoading } = useOrder()
  const { discount, discountMessage, loading: couponLoading, handleApplyVoucher, couponId } = useCoupon()

  const cartItems = useSelector(state => state.cart.cartItems)
  const selectedItems = useSelector(state => state.cart.selectedItems)
  const selectedIds = useSelector(state => state.cart.selectedItems || [])
  // Tính tổng tiền tạm tính (subtotal)

  const selectedCartItems = []
  let subTotal = 0

  cartItems?.forEach(item => {
    const rawId =
      item.product?._id ||
      (typeof item.productId === 'string' ? item.productId : item.productId?._id)

    if (!rawId || !selectedIds.includes(rawId)) return

    const product = item.product || item.productId || {}
    const price = typeof product.price === 'number' ? product.price : 0
    const quantity = typeof item.quantity === 'number' ? item.quantity : 1

    subTotal += price * quantity

    selectedCartItems.push({
      productId: String(rawId),
      quantity
    })
  })
  const total = Math.max(subTotal - discount, 0)
  // Tránh âm
  // const { addresses, fetchAddresses } = useAddress()
  // const [selectedAddress, setSelectedAddress] = useState(null)
  // Lấy địa chỉ mặc định khi có danh sách địa chỉ
  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  useEffect(() => {
  }, [fetchAddresses])

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
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
  const handleAddressListUpdated = async () => {
    await fetchAddresses(true)
  }

  // Áp dụng voucher
  const handleApplyVoucherClick = async () => {
    if (!voucherInput.trim()) {
      setSnackbar({ open: true, severity: 'warning', message: 'Vui lòng nhập mã giảm giá' })
      return
    }

    try {
      const response = await handleApplyVoucher(voucherInput.trim(), subTotal)

      if (response?.valid) {
        setVoucherApplied(true)
        setSnackbar({ open: true, severity: 'success', message: response.message || 'Áp dụng mã giảm giá thành công' })
      } else {
        setVoucherApplied(false)
        setSnackbar({ open: true, severity: 'error', message: response?.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn' })
      }
    } catch (err) {
      setVoucherApplied(false)
      setSnackbar({ open: true, severity: 'error', message: err.message || 'Có lỗi xảy ra khi áp dụng mã giảm giá' })
    }
  }

  // Kiểm tra productId hợp lệ (24 ký tự hex)

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setSnackbar({ open: true, severity: 'warning', message: 'Vui lòng chọn địa chỉ nhận hàng' })
      return
    }

    if (cartItems.length === 0) {
      setSnackbar({ open: true, severity: 'error', message: 'Giỏ hàng trống' })
      return
    }

    // Chuẩn hóa cartItems
    const orderData = {
      cartItems: selectedCartItems,
      shippingAddressId: selectedAddress._id,
      total,
      paymentMethod,
      note: note.trim() || undefined,
      couponCode: voucherApplied ? voucherInput : undefined,
      couponId: voucherApplied ? couponId : undefined,
    }

    try {
      const result = await createOrder(orderData)
      setSnackbar({ open: true, severity: 'success', message: 'Đặt hàng thành công' })

      if (typeof result === 'string' && result.startsWith('http')) {
        window.location.href = result
      } else {
        setTimeout(() => window.location.reload(), 1500)
      }
    } catch (error) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: `Đặt hàng thất bại: ${error.message || error}`,
      })
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container maxWidth="lg" sx={{ py: 4 } }>
        {cartLoading ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* Left side: Địa chỉ, danh sách sản phẩm, ghi chú, phương thức thanh toán */}
            <Grid item md={12} lg={8}>
              {/* Địa chỉ nhận hàng */}
              <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 2 }}>
                <Typography fontWeight={600} mb={1}>
                  Địa Chỉ Nhận Hàng
                </Typography>
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

              {/* Danh sách sản phẩm */}
              <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 2 }}>
                {cartItems.length === 0 ? (
                  <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>Giỏ hàng trống</Typography>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ccc' }}>
                        <th style={{ textAlign: 'left', padding: 8 }}>Sản phẩm</th>
                        <th style={{ textAlign: 'center', padding: 8 }}>Giá</th>
                        <th style={{ textAlign: 'center', padding: 8 }}>Số lượng</th>
                        <th style={{ textAlign: 'right', padding: 8 }}>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems
                        .filter(item => selectedItems.includes(item.productId._id || item.productId)) // lọc đúng item đã chọn
                        .map((item, index) => {
                          const product = item.product || item.productId || {};
                          return (
                            <ProductItem
                              key={index}
                              name={product.name || 'Sản phẩm không tên'}
                              price={product.price || 0}
                              quantity={item.quantity || 1}
                              image={product.image}
                            />
                          );
                        })}

                    </tbody>
                  </table>
                )}
              </Box>

              {/* Ghi chú đơn hàng */}
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

              {/* Phương thức thanh toán */}
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
                          src="https://play-lh.googleusercontent.com/htxII9LeOz8fRkdW0pcvOb88aoc448v9eoxnbKEPK98NLG6iX5mSd4dbu3PX9j36dwy9=w480-h960-rw"
                          alt="VNPAY"
                          style={{ width: 24, marginRight: 8 }}
                        />
                        Thanh toán qua VNPay
                      </Box>
                    }
                  />
                </RadioGroup>
              </Box>
            </Grid>

            {/* Right side: Ưu đãi và tổng thanh toán */}
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
                  disabled={couponLoading}
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

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tạm tính</span>
                    <span>{subTotal.toLocaleString()}đ</span>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Giảm giá</span>
                    <span>{discount.toLocaleString()}đ</span>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>Tổng cộng</span>
                    <span>{total.toLocaleString()}đ</span>
                  </Box>
                </Box>

                <Typography mt={2} variant="body2" color="text.secondary">
                  Phí vận chuyển: miễn phí
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 3 }}
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
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
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Góc phải trên
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  )
}

export default Payment
