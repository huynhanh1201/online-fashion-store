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
    <Box sx={{ p: 3, justifyItems: 'center' }}>
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
                  p: 1, // Giảm padding để phù hợp với kích thước nhỏ hơn
                  backgroundColor: '#fff',
                  border: '2px dashed #a6a6a6', // Giảm độ dày viền
                  height: { xs: 100, sm: 110, md: 120 }, // Giảm chiều cao, responsive theo màn hình
                  width: { xs: '100%', sm: 300, md: 320 }, // Responsive: 100% trên mobile, cố định trên desktop
                  maxWidth: 350, // Giới hạn chiều rộng tối đa
                  minWidth: 200, // Giới hạn chiều rộng tối thiểu
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between', // Thay justifyItems thành justifyContent
                  overflow: 'hidden' // Đảm bảo nội dung không làm phình card
                }}
              >
                {/* Left section */}
                <Box
                  sx={{
                    flex: 1,
                    pr: 1, // Thêm padding bên phải để tránh sát Button
                    overflow: 'hidden' // Ngăn nội dung tràn ra
                  }}
                >
                  <Typography
                    variant='caption' // Giảm từ subtitle2 xuống caption
                    color='text.secondary'
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }} // Responsive font size
                  >
                    VOUCHER
                  </Typography>
                  <Typography
                    variant='subtitle1' // Giảm từ h6 xuống subtitle1
                    fontWeight='bold'
                    color='#1A3C7B'
                    sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                  >
                    {valueText}
                  </Typography>
                  <Tooltip title={coupon.code}>
                    <Typography
                      variant='body2' // Giảm từ body1 xuống body2
                      color='#1A3C7B'
                      mt={0.5}
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.8rem' }, // Responsive font size
                        maxWidth: '100%', // Đảm bảo không tràn
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
                <Box
                  sx={{
                    minWidth: { xs: 100, sm: 110 }, // Responsive minWidth
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    pl: 1 // Thêm padding bên trái
                  }}
                >
                  {minOrderText && (
                    <Typography
                      variant='caption' // Giảm từ caption xuống nhỏ hơn
                      color='text.secondary'
                      sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
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
                      size='small' // Giảm từ medium xuống small
                      sx={{
                        backgroundColor: '#1A3C7B',
                        color: '#fff',
                        mt: 1, // Giảm margin-top
                        fontSize: { xs: '0.7rem', sm: '0.8rem' }, // Responsive font size
                        padding: { xs: '4px 8px', sm: '6px 12px' }, // Responsive padding
                        minWidth: 80 // Đảm bảo nút không quá nhỏ
                      }}
                      onClick={() => handleCopy(coupon.code)}
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
