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
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}Tr`
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
    return `${value.toLocaleString()}đ`
  }

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(''), 1500)
  }

  // Định nghĩa màu sắc cho từng loại voucher
  const getVoucherColors = (index, coupon) => {
    const colors = [
      {
        bg: 'linear-gradient(135deg, #87CEEB 0%, #4FC3F7 100%)',
        text: '#1565C0'
      }, // Blue
      {
        bg: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
        text: '#2E7D32'
      }, // Green
      {
        bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
        text: '#F57C00'
      }, // Orange
      {
        bg: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
        text: '#7B1FA2'
      } // Purple
    ]

    // Nếu là free ship thì dùng màu xanh dương đậm
    if (coupon.type === 'freeship' || coupon.amount === 0) {
      return {
        bg: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
        text: '#FFFFFF'
      }
    }

    return colors[index % colors.length]
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
      <Grid container spacing={2} justifyContent='center'>
        {coupons.map((coupon, index) => {
          const isPercent = coupon.type === 'percent'
          const isFreeShip = coupon.type === 'freeship' || coupon.amount === 0
          const colors = getVoucherColors(index, coupon)

          let valueText = ''
          let mainText = ''

          if (isFreeShip) {
            mainText = 'FREESHIP'
            valueText = 'MỌI ĐƠN HÀNG'
          } else if (isPercent) {
            mainText = `${coupon.amount}%`
            valueText = coupon.minOrderValue
              ? `TỐI ĐA ${formatCurrencyShort(coupon.maxDiscountValue || coupon.amount * 1000)}`
              : 'KHÔNG GIỚI HạN'
          } else {
            mainText = `${formatCurrencyShort(coupon.amount)}`
            valueText = coupon.minOrderValue
              ? `ĐƠN TỪ ${formatCurrencyShort(coupon.minOrderValue)}`
              : 'MỌI ĐƠN HÀNG'
          }

          return (
            <Grid item xs={12} sm={6} md={6} lg={4} key={coupon._id}>
              <Card
                sx={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: colors.bg,
                  boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                  height: '125px',
                  width: '100%',
                  maxWidth: '380px',
                  minWidth: '320px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
                  }
                }}
                onClick={() => handleCopy(coupon.code)}
              >
                {/* Voucher Label */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '12px',
                    left: '16px',
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    transform: 'rotate(-8deg)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: colors.text,
                      letterSpacing: '0.8px'
                    }}
                  >
                    VOUCHER
                  </Typography>
                </Box>

                {/* Copy Button */}
                <Tooltip
                  title={
                    copiedCode === coupon.code
                      ? 'Đã sao chép'
                      : 'Click để sao chép'
                  }
                >
                  <Button
                    sx={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      minWidth: '32px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.95)',
                      color: colors.text,
                      fontSize: '16px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '&:hover': {
                        background: 'rgba(255,255,255,1)'
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopy(coupon.code)
                    }}
                  >
                    📋
                  </Button>
                </Tooltip>

                {/* Main Content */}
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '24px 20px',
                    color: colors.text
                  }}
                >
                  {/* Main Value */}
                  <Typography
                    sx={{
                      fontSize: isFreeShip ? '32px' : '42px',
                      fontWeight: '900',
                      lineHeight: 1,
                      marginBottom: '6px',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {mainText}
                  </Typography>

                  {/* Sub Text */}
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: '600',
                      opacity: 0.9,
                      letterSpacing: '0.5px',
                      marginBottom: '12px'
                    }}
                  >
                    {valueText}
                  </Typography>

                  {/* Code */}
                  <Box
                    sx={{
                      background: 'rgba(255,255,255,0.95)',
                      borderRadius: '16px',
                      padding: '8px 16px',
                      border: '2px dashed rgba(0,0,0,0.2)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: colors.text,
                        letterSpacing: '1px'
                      }}
                    >
                      {coupon.code}
                    </Typography>
                  </Box>
                </Box>

                {/* Decorative circles */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: '-12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.1)'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    right: '-12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.1)'
                  }}
                />
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Thông báo sao chép */}

      <style jsx>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          20% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          80% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
        }
      `}</style>
    </Box>
  )
}

export default CouponList
