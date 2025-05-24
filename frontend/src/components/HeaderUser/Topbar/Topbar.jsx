import React, { useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { Box } from '@mui/material'
import { getDiscounts } from '~/services/discountService'

const TopBar = styled(Box)(({ theme }) => ({
  backgroundColor: '#1A3C7B',
  color: 'white',
  width: '100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  position: 'fixed',
  top: 0,
  left: 0,
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  zIndex: 1301,
  [theme.breakpoints.down('sm')]: {
    height: '40px',
    fontSize: '0.8rem'
  }
}))

const MarqueeText = styled('div')({
  display: 'inline-block',
  paddingLeft: '100%',
  animation: 'marquee 25s linear infinite',
  '@keyframes marquee': {
    '0%': { transform: 'translateX(0%)' },
    '100%': { transform: 'translateX(-100%)' }
  }
})

// Format tiền ngắn gọn: 1000000 → 1M, 100000 → 100K
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

function Topbar() {
  const [couponText, setCouponText] = useState('🎉 Đang tải ưu đãi...')

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { discounts } = await getDiscounts()
        const activeCoupons = discounts.filter((c) => c.isActive)

        const apiTexts = activeCoupons.map((coupon) => {
          const value =
            coupon.type === 'percent'
              ? `${coupon.amount}%`
              : `${formatCurrencyShort(coupon.amount)}`
          const min = coupon.minOrderValue
            ? `CHO ĐƠN HÀNG TỐI THIỂU ${formatCurrencyShort(coupon.minOrderValue)}`
            : ''
          return `🎁 VOUCHER ${value} ${min}`
        })

        const mockTexts = [
          '🚚 FREE SHIP VỚI ĐƠN HÀNG TRÊN 1 TRIỆU',
          '💸 GIẢM GIÁ LÊN ĐÊN 99%',
          '🎉 ƯU ĐÃI SIÊU HOT MỖI NGÀY TẠI FASHION STORE'
        ]

        const finalText = [...apiTexts, ...mockTexts].join('   ') // chỉ khoảng trắng, không có dấu "-"
        setCouponText(finalText || '⚡ Hiện tại không có ưu đãi nào khả dụng.')
      } catch (error) {
        setCouponText('⚠️ Lỗi khi tải ưu đãi')
      }
    }

    fetchCoupons()
  }, [])

  return (
    <TopBar>
      <MarqueeText>{couponText}</MarqueeText>
    </TopBar>
  )
}

export default Topbar
