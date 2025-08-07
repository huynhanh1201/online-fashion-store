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
  DialogActions,
  Card,
  CardContent,
  Paper,
  Chip,
  Breadcrumbs,
  Link
} from '@mui/material'
import { NavigateNext } from '@mui/icons-material'
import { styled } from '@mui/system'
import { ChooseAddressModal } from './Modal/ChooseAddressModal'
import { useAddress } from '~/hooks/useAddress'
import useCoupon from '~/hooks/useCoupon'
import { useCart } from '~/hooks/useCarts'
import { useOrder } from '~/hooks/useOrder'
import { useSelector, useDispatch } from 'react-redux'
import { clearTempCart, clearAppliedCoupon } from '~/redux/cart/cartSlice'
import { useLocation, useNavigate } from 'react-router-dom'
import CouponItem from '~/components/Coupon/CouponItem'
import { getDiscounts } from '~/services/discountService'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'
import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  width: '96vw',
  maxWidth: '1800px',
  margin: '0 auto',
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.4rem',
  marginBottom: theme.spacing(3),
  color: 'var(--primary-color)',
  position: 'relative',
  paddingLeft: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    fontSize: '1.2rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.1rem',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '4px',
    height: '24px',
    backgroundColor: 'var(--primary-color)',
    borderRadius: '2px',
    [theme.breakpoints.down('sm')]: {
      height: '20px',
    }
  }
}))

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(26, 60, 123, 0.1)',
  border: '1px solid rgba(26, 60, 123, 0.1)',
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
    borderRadius: '12px',
  },
  '&:hover': {
    boxShadow: '0 12px 40px rgba(26, 60, 123, 0.15)',
    transform: 'translateY(-2px)',
  }
}))

const AddressCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  border: '2px solid #e3f2fd',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
  '&:hover': {
    borderColor: 'var(--primary-color)',
    boxShadow: '0 4px 20px rgba(26, 60, 123, 0.1)',
  }
}))

const PaymentMethodCard = styled(Paper)(({ selected, theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: '12px',
  border: `2px solid ${selected ? 'var(--primary-color)' : '#e0e0e0'}`,
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  background: selected
    ? 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'
    : '#ffffff',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  '&:hover': {
    borderColor: 'var(--primary-color)',
    boxShadow: '0 4px 16px rgba(26, 60, 123, 0.1)',
    transform: 'translateY(-1px)',
  }
}))

const ShippingCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: '12px',
  border: '2px solid var(--primary-color)',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%)',
  boxShadow: '0 4px 16px rgba(26, 60, 123, 0.1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'var(--surface-color)',
    transition: 'all 0.3s ease',
    // '& fieldset': {
    //   // borderColor: '#e0e0e0',
    //   borderWidth: '2px',
    // },
    // '&:hover fieldset': {
    //   borderColor: 'var(--primary-color)',
    // },
    // '&.Mui-focused fieldset': {
    //   borderColor: 'var(--primary-color)',
    //   borderWidth: '2px',
    //   boxShadow: '0 0 0 4px rgba(26, 60, 123, 0.1)',
    // }
  },
  '& .MuiInputLabel-root': {
    color: '#666',
    '&.Mui-focused': {
      color: 'var(--primary-color)',
    }
  }
}))

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 16px rgba(26, 60, 123, 0.2)',
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
    padding: theme.spacing(1.2, 2.5),
  },
  '&:hover': {
    boxShadow: '0 6px 24px rgba(26, 60, 123, 0.3)',
    transform: 'translateY(-2px)',
  }
}))

const PrimaryButton = styled(StyledButton)(() => ({
  backgroundColor: 'var(--primary-color)',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: 'var(--accent-color)',
  },
  '&:disabled': {
    backgroundColor: '#cccccc',
    color: '#666666',
  }
}))

const ChangeAddressButton = styled(Typography)(({ theme }) => ({
  color: 'var(--primary-color)',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '0.95rem',
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  border: '1px solid var(--primary-color)',
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.85rem',
    padding: theme.spacing(0.8, 1.5),
  },
  '&:hover': {
    backgroundColor: 'var(--primary-color)',
    color: '#ffffff',
    transform: 'scale(1.05)',
  }
}))

const ProductTable = styled('table')(({ theme }) => ({
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0 8px',
  '& thead tr': {
    '& th': {
      backgroundColor: '#f8f9fa',
      padding: theme.spacing(2),
      fontSize: '1rem',
      fontWeight: 600,
      color: 'var(--primary-color)',
      border: 'none',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.5),
        fontSize: '0.9rem',
      },
      '&:first-of-type': {
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
      },
      '&:last-of-type': {
        borderTopRightRadius: '8px',
        borderBottomRightRadius: '8px',
      }
    }
  },
  '& tbody tr': {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      transform: 'translateY(-1px)',
    },
    '& td': {
      padding: theme.spacing(2),
      border: 'none',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.5),
      },
      '&:first-of-type': {
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
      },
      '&:last-of-type': {
        borderTopRightRadius: '8px',
        borderBottomRightRadius: '8px',
      }
    }
  }
}))

const SummaryCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
  boxShadow: '0 8px 32px rgba(26, 60, 123, 0.15)',
  border: '1px solid rgba(26, 60, 123, 0.1)',
  position: 'sticky',
  top: theme.spacing(2),
}))

const PriceRow = styled(Box)(({ theme, isTotal }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 0),
  fontSize: isTotal ? '1.2rem' : '1rem',
  fontWeight: isTotal ? 700 : 400,
  color: isTotal ? 'var(--primary-color)' : '#333',
  borderBottom: isTotal ? 'none' : '1px solid #f0f0f0',
  [theme.breakpoints.down('sm')]: {
    fontSize: isTotal ? '1.1rem' : '0.9rem',
    padding: theme.spacing(1.2, 0),
  },
}))

// Helper functions for formatting color and size
const capitalizeFirstLetter = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const formatSize = (str) => {
  if (!str) return ''
  return str.toUpperCase()
}

const ProductItem = ({ name, variant, quantity, image, color, size, getFinalPrice, productId, navigate }) => {
  if (!name || typeof quantity !== 'number') {
    return (
      <tr>
        <td colSpan={3} style={{ color: 'red', padding: 8, textAlign: 'center' }}>
          <Typography color="error" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
            Lỗi: Dữ liệu sản phẩm không hợp lệ.
          </Typography>
        </td>
      </tr>
    )
  }

  const capitalizedName = capitalizeFirstLetter(name)
  const truncatedName = capitalizedName.length > 20 ? capitalizedName.slice(0, 20) + '...' : capitalizedName
  const finalPrice = getFinalPrice(variant)
  const exportPrice = variant.exportPrice || 0
  const discountPrice = variant.discountPrice || 0
  const hasDiscount = discountPrice > 0 && exportPrice > finalPrice

  const handleProductClick = () => {
    if (productId && navigate) {
      navigate(`/productdetail/${productId}`)
    }
  }

  return (
    <tr>
      <td>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1.5,
            cursor: 'pointer',
          }}
          onClick={handleProductClick}
        >
          <Box
            component="img"
            src={optimizeCloudinaryUrl(image) || 'https://via.placeholder.com/64'}
            alt={name}
            sx={{
              width: { xs: 48, sm: 64 },
              height: { xs: 48, sm: 64 },
              borderRadius: 2,
              objectFit: 'cover',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
          <Box>
            <Typography
              fontWeight={600}
              sx={{
                mb: 0.5,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                '&:hover': { color: 'var(--primary-color)' },
              }}
            >
              {truncatedName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip
                label={capitalizeFirstLetter(color) || 'Chưa chọn màu'}
                size="small"
                variant="outlined"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              />
              <Chip
                label={formatSize(size) || 'Chưa chọn kích cỡ'}
                size="small"
                variant="outlined"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              />
            </Box>
          </Box>
        </Box>
      </td>
      <td style={{ textAlign: 'center' }}>
        <Typography fontWeight={600} sx={{ mb: 0.5, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          {quantity}
        </Typography>
      </td>
      <td style={{ textAlign: 'right' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
          <Typography
            fontWeight={600}
            color="var(--primary-color)"
            sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
          >
            {(finalPrice * quantity).toLocaleString('vi-VN')}₫
          </Typography>
          {hasDiscount && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Typography
                sx={{
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  color: 'text.secondary',
                  textDecoration: 'line-through',
                }}
              >
                {(exportPrice * quantity).toLocaleString('vi-VN')}₫
              </Typography>
            </Box>
          )}
        </Box>
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
  const [hasTriedAutoApply, setHasTriedAutoApply] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'info',
    message: ''
  })
  const [coupons, setCoupons] = useState([])
  const [couponLoading, setCouponLoading] = useState(true)
  const [couponError, setCouponError] = useState(null)

  const { addresses, fetchAddresses } = useAddress()
  const { loading: cartLoading } = useCart()
  const { createOrder, loading: orderLoading } = useOrder()
  const { discount, discountMessage, loading: voucherLoading, handleApplyVoucher, couponId } = useCoupon()
  const selectedItems = useSelector(state => state.cart.selectedItems || [])
  const cartCartItems = useSelector(state => state.cart.cartItems)
  const tempCart = useSelector(state => state.cart.tempCart)
  const isBuyNow = useSelector(state => state.cart.isBuyNow)
  const appliedCoupon = useSelector(state => state.cart.appliedCoupon)
  const appliedDiscount = useSelector(state => state.cart.appliedDiscount)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // Xác định cartItems
  const cartItems = isBuyNow && tempCart?.cartItems?.length > 0 ? tempCart.cartItems : cartCartItems

  const [shippingPrice, setShippingPrice] = useState(0)
  const [shippingPriceLoading, setShippingPriceLoading] = useState(false)

  // Hàm helper để hiển thị snackbar
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      severity: severity,
      message: message
    })
  }

  // Helper function to get final price (exportPrice minus discountPrice)
  const getFinalPrice = (variant) => {
    const basePrice = variant.exportPrice || 0
    const discount = variant.discountPrice || 0
    return Math.max(basePrice - discount, 0) // Đảm bảo giá không âm
  }

  // Tính selectedCartItems + subTotal
  let subTotal = 0
  let totalSavings = 0
  const selectedCartItems = cartItems
    .filter(item => {
      if (isBuyNow) return true
      return selectedItems.some(selected => {
        // Kiểm tra null/undefined trước khi xử lý
        if (!item?.variantId || !selected?.variantId) return false

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
      const finalPrice = getFinalPrice(variant)
      const quantity = typeof item.quantity === 'number' ? item.quantity : 1

      subTotal += finalPrice * quantity

      // Tính tiết kiệm được
      if (variant.discountPrice && variant.discountPrice > 0) {
        totalSavings += variant.discountPrice * quantity
      }

      return { variantId, color: item.color, size: item.size, quantity }
    })

  useEffect(() => {
    if (selectedAddress && selectedCartItems.length > 0) {
      fetchShippingPrice(selectedAddress, selectedCartItems)
    } else {
      setShippingPrice(0)
    }
  }, [selectedAddress])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])
  const fetchShippingPrice = async (address, items) => {
    if (!address || !items?.length) {
      console.warn('fetchShippingPrice: Thiếu address hoặc items', { address, items })
      setShippingPrice(0)
      return
    }

    try {
      setShippingPriceLoading(true)

      // Kiểm tra và xử lý districtId
      let districtId = address.districtId

      // Nếu districtId là string và không thể parse thành số, có thể là tên district
      if (typeof districtId === 'string' && isNaN(parseInt(districtId, 10))) {
        console.error('districtId không phải là số:', districtId)
        console.error('Địa chỉ đầy đủ:', address)
        throw new Error('Thông tin địa chỉ không hợp lệ. Vui lòng chỉnh sửa lại địa chỉ để cập nhật thông tin mới nhất.')
      }

      // Đảm bảo districtId là số
      const numericDistrictId = parseInt(districtId, 10)
      if (isNaN(numericDistrictId)) {
        throw new Error('Mã quận/huyện không hợp lệ. Vui lòng chỉnh sửa lại địa chỉ.')
      }

      const payload = {
        cartItems: items.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        to_district_id: numericDistrictId,
        to_ward_code: address.wardId,
      }

      const response = await AuthorizedAxiosInstance.post(`${API_ROOT}/v1/deliveries/calculate-fee`, payload)

      const data = response?.data  // Axios tự parse JSON

      // Kiểm tra response structure an toàn hơn
      if (!data || typeof data !== 'object') {
        throw new Error('Dữ liệu phí vận chuyển không hợp lệ')
      }

      const fee = data.totalFeeShipping
      if (typeof fee !== 'number' || fee < 0) {
        throw new Error('Phí vận chuyển không hợp lệ')
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

  // Tự động áp dụng mã giảm giá từ Cart
  useEffect(() => {
    if (appliedCoupon &&
      appliedDiscount > 0 &&
      !voucherApplied &&
      !discount &&
      !hasTriedAutoApply &&
      subTotal > 0) {

      const autoApplyCoupon = async () => {
        try {
          setHasTriedAutoApply(true) // Prevent retry
          setVoucherInput(appliedCoupon.code)
          const response = await handleApplyVoucher(appliedCoupon.code, subTotal)
          if (response?.valid) {
            setVoucherApplied(true)
            setSnackbar({
              open: true,
              severity: 'success',
              message: `Đã tự động áp dụng mã giảm giá: ${appliedCoupon.code}`
            })
          }
        } catch (error) {
          console.error('Lỗi khi tự động áp dụng mã giảm giá:', error)
          setSnackbar({
            open: true,
            severity: 'error',
            message: 'Không thể áp dụng mã giảm giá tự động'
          })
        }
      }

      // Delay để đảm bảo component đã render hoàn toàn
      const timer = setTimeout(autoApplyCoupon, 500)
      return () => clearTimeout(timer)
    }
  }, [appliedCoupon, appliedDiscount, voucherApplied, discount, subTotal, hasTriedAutoApply, handleApplyVoucher])

  // Reset auto-apply flag khi coupon thay đổi
  useEffect(() => {
    setHasTriedAutoApply(false)
  }, [appliedCoupon?.code])

  // Cleanup applied coupon khi rời khỏi trang
  useEffect(() => {
    return () => {
      if (appliedCoupon) {
        dispatch(clearAppliedCoupon())
      }
    }
  }, [appliedCoupon, dispatch])

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

  const handleCouponSelect = async (code) => {
    if (!code || code === 'N/A') return
    setVoucherInput(code)
    setVoucherApplied(false)
    try {
      const response = await handleApplyVoucher(code.trim(), subTotal)
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

  const totalOrder = Math.max(subTotal - discount, 0)
  const totalFeeShipping = totalOrder + shippingPrice
  const totalCart = subTotal

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
        message: 'Vui lòng chọn phương thức thanh toán',
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

    let sanitizedCartItems
    try {
      sanitizedCartItems = selectedCartItems.map(item => {
        // Ensure variantId is properly extracted with safety checks
        let variantId = item.variantId
        if (typeof variantId === 'object') {
          variantId = variantId?._id || variantId?.toString?.() || ''
        }

        // Kiểm tra variantId hợp lệ
        if (!variantId || variantId === '') {
          throw new Error(`Variant ID không hợp lệ cho sản phẩm: ${item.name || 'Không tên'}`)
        }

        return {
          variantId: String(variantId),
          quantity: Math.max(1, parseInt(item.quantity) || 1), // Đảm bảo quantity >= 1
        }
      })
    } catch (error) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: `Lỗi xử lý dữ liệu: ${error.message}`,
      })
      return
    }

    const orderData = {
      cartItems: sanitizedCartItems,
      shippingAddressId: selectedAddress._id || selectedAddress.id,
      total: totalCart,
      paymentMethod,
      note: note.trim() || null,
      shippingFee: shippingPrice || 0,
    }

    // Only add coupon fields if voucher is applied and has valid values
    if (voucherApplied && voucherInput && voucherInput.trim() !== '' && couponId) {
      orderData.couponCode = voucherInput.trim().toUpperCase()
      orderData.couponId = couponId
    }

    try {
      const result = await createOrder(orderData)
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
    <StyledContainer maxWidth={false}>
      <Breadcrumbs
        separator={<NavigateNext fontSize='small' />}
        sx={{ mb: 2 }}
        aria-label='breadcrumb'
      >
        <Link
          component={Link}
          to='/'
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#007bff',
            textDecoration: 'none',
            '&:hover': {
              color: 'primary.main'
            },
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        // component={Link}
        // to='/product'
        >
          Trang chủ
        </Link>
        <Link
          component={Link}
          to={`/cart`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#007bff',
            textDecoration: 'none',
            '&:hover': {
              color: 'primary.main'
            },
            cursor: 'pointer'
          }}
          onClick={() => navigate('/cart')}
        // component={Link}
        // to='/product'
        >
          Giỏ hàng
        </Link>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.primary',
            fontWeight: 500
          }}
        >
          Thanh toán
        </Typography>
      </Breadcrumbs>
      {cartLoading ? (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <CircularProgress size={60} sx={{ color: 'var(--primary-color)' }} />
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems="flex-start"
          gap={{ xs: 2, md: 3 }}
        >
          <Box
            flex={{ xs: '1 1 100%', md: 2 }}
            width={{ xs: '100%', md: 'auto' }}
          >
            {/* Địa chỉ nhận hàng */}
            <StyledCard>
              <CardContent>
                <SectionTitle>Địa chỉ nhận hàng</SectionTitle>
                <AddressCard elevation={0}>
                  {selectedAddress ? (
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexDirection={{ xs: 'column', sm: 'row' }}>
                      <Box sx={{ flex: 1, textAlign: 'left' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: 'var(--primary-color)',
                            mb: 1,
                            fontSize: { xs: '1rem', sm: '1.2rem' },
                          }}
                        >
                          {selectedAddress.fullName} • (+84) {selectedAddress.phone}
                        </Typography>
                        <Typography sx={{ color: '#666', lineHeight: 1.6, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                          {selectedAddress.address}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.city}
                        </Typography>
                      </Box>
                      <Box sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 2, sm: 0 }, alignSelf: { xs: 'flex-start', sm: 'center' } }}>
                        <ChangeAddressButton onClick={handleOpenAddressModal}>
                          Thay Đổi
                        </ChangeAddressButton>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography sx={{ mb: 2, color: '#666', fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                        Chưa có địa chỉ giao hàng
                      </Typography>
                      <PrimaryButton onClick={handleOpenAddressModal}>
                        Chọn Địa Chỉ
                      </PrimaryButton>
                    </Box>
                  )}
                </AddressCard>
              </CardContent>
            </StyledCard>
            {/* Ghi chú đơn hàng */}
            <StyledCard>
              <CardContent>
                <SectionTitle>Ghi chú đơn hàng</SectionTitle>
                <StyledTextField
                  fullWidth
                  label="Ghi chú đơn hàng (không bắt buộc)"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  variant="outlined"
                  rows={3}
                  multiline
                  placeholder="Nhập ghi chú cho đơn hàng của bạn..."
                  helperText={`${note.length}/500 ký tự`}
                  inputProps={{ maxLength: 500 }}
                />
              </CardContent>
            </StyledCard>

            {/* Phương thức vận chuyển */}
            <StyledCard>
              <CardContent>
                <SectionTitle>Phương thức vận chuyển</SectionTitle>
                <ShippingCard elevation={0}>
                  <RadioGroup defaultValue="Ship">
                    <FormControlLabel
                      value="Ship"
                      control={
                        <Radio
                          sx={{
                            color: 'var(--primary-color)',
                            '&.Mui-checked': { color: 'var(--primary-color)' }
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                          <Box
                            component="img"
                            src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Slogan-VN.png"
                            alt="GHN"
                            sx={{ height: { xs: 32, sm: 40 }, borderRadius: 1 }}
                          />
                          <Box>
                            <Typography fontWeight={600} sx={{ mb: 0.5, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                              Giao hàng nhanh (GHN)
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              component="span"
                              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                            >
                              Phí vận chuyển:{' '}
                              {shippingPriceLoading ? (
                                <CircularProgress size={16} />
                              ) : shippingPrice === 0 ? (
                                <Typography
                                  component="span"
                                  sx={{
                                    color: 'green',
                                    fontWeight: 600
                                  }}
                                >
                                  Miễn phí
                                </Typography>
                              ) : (
                                <Typography
                                  component="span"
                                  sx={{
                                    color: 'var(--primary-color)',
                                    fontWeight: 600
                                  }}
                                >
                                  {`${shippingPrice.toLocaleString('vi-VN')}₫`}
                                </Typography>
                              )}
                            </Typography>

                          </Box>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </ShippingCard>
              </CardContent>
            </StyledCard>

            {/* Hình thức thanh toán */}
            <StyledCard>
              <CardContent>
                <SectionTitle>Hình thức thanh toán</SectionTitle>

                {/* COD */}
                <PaymentMethodCard
                  selected={paymentMethod === 'COD'}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <RadioGroup value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                    <FormControlLabel
                      value="COD"
                      control={
                        <Radio sx={{
                          color: 'var(--primary-color)',
                          '&.Mui-checked': { color: 'var(--primary-color)' }
                        }} />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                          <Box
                            component="img"
                            src="https://file.hstatic.net/1000360022/file/img_payment_method_5_23d8b98ee8c7456bab146250bedbc1a4.png"
                            alt="COD"
                            sx={{ height: { xs: 32, sm: 40 }, borderRadius: 1 }}
                          />
                          <Box>
                            <Typography fontWeight={600} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                              Thanh toán khi nhận hàng (COD)
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                              Thanh toán bằng tiền mặt khi nhận hàng
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </PaymentMethodCard>

                {/* VNPay */}
                <PaymentMethodCard
                  selected={paymentMethod === 'vnpay'}
                  onClick={() => setPaymentMethod('vnpay')}
                >
                  <RadioGroup value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                    <FormControlLabel
                      value="vnpay"
                      control={
                        <Radio sx={{
                          color: 'var(--primary-color)',
                          '&.Mui-checked': { color: 'var(--primary-color)' }
                        }} />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                          <Box
                            component="img"
                            src="https://file.hstatic.net/1000360022/file/img_payment_method_4_7fdbf4cdf59647e684a29799683114f7.png"
                            alt="VNPAY"
                            sx={{ height: { xs: 32, sm: 40 }, borderRadius: 1 }}
                          />
                          <Box>
                            <Typography fontWeight={600} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                              Ví điện tử VNPAY
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                              Thanh toán trực tuyến qua VNPAY
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </PaymentMethodCard>
              </CardContent>
            </StyledCard>
          </Box>

          {/* Right side: Giỏ hàng, ưu đãi và tổng thanh toán */}
          <Box
            flex={{ xs: '1 1 100%', md: 1 }}
            width={{ xs: '100%', md: 'auto' }}
          >
            <SummaryCard>
              <CardContent>
                <SectionTitle>Đơn hàng của bạn</SectionTitle>

                {/* Giỏ hàng */}
                {selectedCartItems.length === 0 ? (
                  <Box sx={{
                    textAlign: 'center',
                    py: 6,
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                    borderRadius: 2,
                    mb: 3
                  }}>
                    <Typography color="var(--primary-color)" sx={{ fontSize: '1.1rem' }}>
                      Giỏ hàng trống
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        maxHeight: '400px',
                        overflowY: 'auto',
                        border: '1px solid #f0f0f0',
                        borderRadius: '12px',
                        paddingRight: '12px',
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: '#f1f1f1',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: 'var(--primary-color) !important',
                          borderRadius: '4px',
                          '&:hover': {
                            background: 'var(--accent-color)',
                          },
                        },
                      }}
                    >
                      <ProductTable>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left' }}>Sản phẩm</th>
                            <th style={{ textAlign: 'center' }}>SL</th>
                            <th style={{ textAlign: 'right' }}>Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCartItems.map((item, index) => {
                            const cartItem = cartItems.find(cartItem =>
                              String(cartItem.variantId?._id || cartItem.variantId) === item.variantId &&
                              cartItem.color === item.color &&
                              cartItem.size === item.size
                            )
                            const variant = cartItem?.variantId || {}

                            // Kiểm tra dữ liệu hợp lệ trước khi render
                            if (!variant || !item) {
                              return (
                                <tr key={index}>
                                  <td colSpan={3} style={{ color: 'red', padding: 16, textAlign: 'center' }}>
                                    <Typography color="error">Dữ liệu sản phẩm không hợp lệ</Typography>
                                  </td>
                                </tr>
                              )
                            }

                            return (
                              <ProductItem
                                key={index}
                                name={variant.name || 'Sản phẩm không tên'}
                                variant={variant}
                                quantity={item.quantity || 1}
                                image={variant.color?.image}
                                color={variant.color?.name || item.color}
                                size={variant.size?.name || item.size}
                                getFinalPrice={getFinalPrice}
                                productId={variant.product || variant.productId}
                                navigate={navigate}
                              />
                            )
                          })}
                        </tbody>
                      </ProductTable>
                    </Box>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Ưu đãi */}
                <SectionTitle>Mã giảm giá</SectionTitle>

                <Box sx={{ mb: 3 }}>
                  <StyledTextField
                    fullWidth
                    label="Nhập mã giảm giá"
                    value={voucherInput}
                    onChange={e => {
                      let value = e.target.value.toUpperCase().slice(0, 20)
                      value = value.replace(/[^A-Z0-9]/g, '')
                      setVoucherInput(value)
                      setVoucherApplied(false)
                    }}
                    size="small"
                    disabled={voucherLoading}
                    sx={{ mb: 2 }}
                  />

                  <PrimaryButton
                    fullWidth
                    onClick={handleApplyVoucherClick}
                    disabled={voucherLoading || voucherApplied}
                  >
                    {voucherLoading ? 'Đang áp dụng...' : voucherApplied ? 'Đã áp dụng' : 'Áp dụng mã'}
                  </PrimaryButton>
                </Box>

                {/* Danh sách coupon */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: '#666'
                    }}
                  >
                    Mã giảm giá có sẵn
                  </Typography>

                  {couponLoading ? (
                    <Box display="flex" justifyContent="center" py={2}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : couponError ? (
                    <Typography color="error" textAlign="center">
                      {couponError}
                    </Typography>
                  ) : coupons.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center">
                      Không có mã giảm giá nào
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: 1,
                        maxWidth: '500px',
                        mx: 'auto',
                        pb: 2,
                        // Tối đa hiển thị 3 thẻ: mỗi cái ~320px + gap
                        width: {
                          xs: '100%',
                          sm: 'calc(320px * 3 + 32px)', // 3 item + 2 gaps (2*16px)
                        },
                        '&::-webkit-scrollbar': {
                          height: 8,
                        },
                        '&::-webkit-scrollbar-track': {
                          background: '#f1f1f1',
                          borderRadius: 4,
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: 'var(--primary-color)',
                          borderRadius: 4,
                          '&:hover': {
                            background: 'var(--accent-color)',
                          },
                        },
                      }}
                    >
                      {coupons.map(coupon => (
                        <Box
                          key={coupon._id}
                          sx={{
                            flexShrink: 0,
                            width: { xs: 300, sm: 300, md: 320 },
                          }}
                        >
                          <CouponItem
                            coupon={coupon}
                            onCopy={handleCouponSelect}
                            copiedCode={voucherInput}
                            formatCurrencyShort={formatCurrencyShort}
                            disabled={!coupon.isApplicable}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>



                <Divider sx={{ my: 3 }} />

                {/* Tổng thanh toán */}
                <Box>
                  <PriceRow>
                    <Typography>Tạm tính:</Typography>
                    <Typography color='var(--primary-color)' fontWeight={600}>
                      {subTotal.toLocaleString('vi-VN')}₫
                    </Typography>
                  </PriceRow>

                  {totalSavings > 0 && (
                    <PriceRow>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#4caf50',
                          fontSize: '0.9rem',
                          fontStyle: 'italic'
                        }}
                      >
                        Tiết kiệm được:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#4caf50',
                          fontSize: '0.9rem'
                        }}
                      >
                        {totalSavings.toLocaleString('vi-VN')}₫
                      </Typography>
                    </PriceRow>
                  )}

                  <PriceRow>
                    <Typography>Phí vận chuyển:</Typography>
                    <Typography fontWeight={600}>
                      {shippingPriceLoading ? (
                        <CircularProgress size={16} />
                      ) : shippingPrice === 0 ? (
                        <Typography
                          component="span"
                          sx={{
                            color: 'green',
                            fontWeight: 600
                          }}
                        >
                          Miễn phí
                        </Typography>
                      ) : (
                        <Typography
                          component="span"
                          sx={{
                            color: 'var(--primary-color)',
                            fontWeight: 600
                          }}
                        >
                          {`${shippingPrice.toLocaleString('vi-VN')}₫`}
                        </Typography>
                      )}
                    </Typography>
                  </PriceRow>

                  <PriceRow>
                    <Typography>Giảm giá:</Typography>
                    <Typography fontWeight={600} color="red">
                      -{discount.toLocaleString('vi-VN')}₫
                    </Typography>
                  </PriceRow>

                  <PriceRow isTotal>
                    <Typography fontWeight={700}>Tổng cộng:</Typography>
                    <Typography fontSize={'1.2rem'} fontWeight={700}>
                      {totalFeeShipping.toLocaleString('vi-VN')}₫
                    </Typography>
                  </PriceRow>
                </Box>

                <PrimaryButton
                  fullWidth
                  size="large"
                  onClick={() => setConfirmOpen(true)}
                  disabled={orderLoading || selectedCartItems.length === 0}
                  sx={{
                    mt: 3,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700
                  }}
                >
                  {orderLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Đang xử lý...
                    </>
                  ) : (
                    'Đặt hàng ngay'
                  )}
                </PrimaryButton>
              </CardContent>
            </SummaryCard>
          </Box>
        </Box>
      )}

      {/* Modal chọn địa chỉ */}
      <ChooseAddressModal
        open={openAddressModal}
        onClose={handleCloseAddressModal}
        onConfirm={handleAddressConfirm}
        onUpdateAddresses={handleAddressListUpdated}
        showSnackbar={showSnackbar}
      />

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 12 }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Dialog xác nhận */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{
          textAlign: 'center',
          color: 'var(--primary-color)',
          fontWeight: 700,
          fontSize: '1.3rem',
        }}>
          Xác nhận đặt hàng
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'flex-start', py: 3 }}>
          <Typography sx={{ fontSize: '1.1rem', mb: 2 }}>
            Bạn có chắc chắn muốn đặt hàng không?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tổng thanh toán:{' '}
            <strong style={{ fontSize: '1.2rem' }}>
              {totalFeeShipping.toLocaleString('vi-VN')}₫
            </strong>
          </Typography>

        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', pb: 2, px: 3 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              borderColor: 'var(--primary-color)',
              color: '#666'
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              setConfirmOpen(false)
              handlePlaceOrder()
            }}
            sx={{
              borderRadius: 2,
              px: 3,
              backgroundColor: 'var(--primary-color)',
              color: 'white',
            }}
          >
            Xác nhận đặt hàng
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  )
}

export default Payment