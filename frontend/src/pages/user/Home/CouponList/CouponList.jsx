import React, { useEffect, useState } from 'react'
import {
  Box,
  Card,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Tooltip
} from '@mui/material'
import { getDiscounts } from '~/services/discountService'

const CouponList = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState('')

  useEffect(() => {
    const fetchCoupons = async () => {
      const { discounts } = await getDiscounts()
      const latestCoupons = discounts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4)
      setCoupons(latestCoupons)
      setLoading(false)
    }
    fetchCoupons()
  }, [])

  const formatCurrencyShort = (value) => {
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
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(''), 1500)
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' mt={5}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} justifyContent='start'>
        {coupons.map((coupon) => {
          const isPercent = coupon.type === 'percent'
          const valueText = isPercent
            ? `${coupon.amount}%`
            : `${coupon.amount.toLocaleString()} VND`

          const minOrderText = coupon.minOrderValue
            ? `Đơn tối thiểu ${formatCurrencyShort(coupon.minOrderValue)}`
            : ''

          return (
            <Grid item xs={12} sm={10} md={6} key={coupon._id}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 6,
                  p: 2,
                  backgroundColor: '#fff',
                  border: '3px dashed #a6a6a6',
                  height: 130,
                  display: 'flex',
                  alignItems: 'center',
                  width: '350px',
                  justifyItems: 'start'
                }}
              >
                {/* Left section */}
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
                        maxWidth: '150px', // tùy chỉnh theo chiều rộng bạn mong muốn
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      Mã: <strong>{coupon.code}</strong>
                    </Typography>
                  </Tooltip>
                </Box>

                {/* Right section */}
                <Box sx={{ ml: 3, minWidth: 130, justifyItems: 'end' }}>
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
                      copiedCode === coupon.code ? 'Đã sao chép' : 'Sao chép mã'
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
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default CouponList
