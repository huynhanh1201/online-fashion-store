import React, { useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { Box } from '@mui/material'
import { getHeaderConfig } from '~/services/admin/webConfig/headerService'

const TopBar = styled(Box)(({ theme }) => ({
  backgroundColor: 'var(--primary-color)',
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
  const [topBannerText, setTopBannerText] = useState('🎉 Đang tải thông báo...')

  useEffect(() => {
    const fetchTopBanners = async () => {
      try {
        console.log('Fetching header config...')
        const headerConfig = await getHeaderConfig()
        console.log('Header config received:', headerConfig)
        
        if (headerConfig && headerConfig.content && headerConfig.content.topBanner) {
          console.log('Top banner content:', headerConfig.content.topBanner)
          
          // Filter visible top banners
          const visibleTopBanners = headerConfig.content.topBanner.filter(banner => 
            banner.visible === true && banner.text && banner.text.trim()
          )
          
          console.log('Visible top banners:', visibleTopBanners)

          if (visibleTopBanners.length > 0) {
            // Combine all visible top banner texts
            const bannerTexts = visibleTopBanners.map(banner => banner.text.trim())
            const finalText = bannerTexts.join('   ') // chỉ khoảng trắng, không có dấu "-"
            console.log('Final banner text:', finalText)
            setTopBannerText(finalText)
          } else {
            console.log('No visible top banners found')
            setTopBannerText('⚡ Chào mừng bạn đến với Cửa Hàng!')
          }
        } else {
          console.log('No header config or topBanner found')
          // Fallback text when no top banners
          setTopBannerText('⚡ Chào mừng bạn đến với Cửa Hàng!')
        }
      } catch (error) {
        console.error('Error fetching top banners:', error)
        setTopBannerText('⚡ Chào mừng bạn đến với Cửa Hàng!')
      }
    }

    fetchTopBanners()
  }, [])

  return (
    <TopBar>
      <MarqueeText>{topBannerText}</MarqueeText>
    </TopBar>
  )
}

export default Topbar
