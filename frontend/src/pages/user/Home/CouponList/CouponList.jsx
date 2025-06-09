import React, { useEffect, useState } from 'react'
import { Box, Grid, CircularProgress, Typography } from '@mui/material'
import { getDiscounts } from '~/services/discountService'
import CouponItem from '~/components/Coupon/CouponItem'

const CouponList = ({ onCouponSelect }) => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copiedCode, setCopiedCode] = useState('')

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getDiscounts()
        const { discounts } = response
        if (!Array.isArray(discounts)) {
          throw new Error('Dữ liệu coupon không hợp lệ')
        }
        // Lọc coupon tối thiểu
        const validCoupons = discounts
          .filter(coupon => coupon && coupon._id)
          .sort((a, b) => new Date(b.createdAt || new Date()) - new Date(a.createdAt || new Date()))
          .slice(0, 4)
        setCoupons(validCoupons)
        setLoading(false)
      } catch (error) {
        // console.error('Lỗi lấy coupon:', error)
        setError(error.message || 'Không thể tải coupon')
        setLoading(false)
      }
    }
    fetchCoupons()
  }, [])

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

  const handleCopy = (code) => {
    if (!code || code === 'N/A') return
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    if (onCouponSelect) {
      onCouponSelect(code)
    }
    setTimeout(() => setCopiedCode(''), 1500)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error" fontSize={{ xs: '0.9rem', sm: '1rem' }}>
          {error}
        </Typography>
      </Box>
    )
  }

  if (coupons.length === 0) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="text.secondary" fontSize={{ xs: '0.9rem', sm: '1rem' }}>
          Không có coupon nào hiện tại
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Grid container spacing={2} justifyContent="center">
        {coupons.map((coupon) => (
          <Grid item xs={12} sm={6} md={3} key={coupon._id}>
            <CouponItem
              coupon={coupon}
              onCopy={handleCopy}
              copiedCode={copiedCode}
              formatCurrencyShort={formatCurrencyShort}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default CouponList