import React from 'react'

const Sticker = ({
  text = '',
  color = 'white',
  background = 'linear-gradient(135deg,rgb(74, 131, 196) 0%, #1A3C7B 100%)',
  top = 5,
  right = 0,
  left,
  bottom,
  fontSize = '17px',
  fontWeight = 700,
  padding = '8px 25px 8px 15px',
  borderRadius = 0,
  boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)',
  style = {},
  product,
  ...props
}) => {
  const getStickerInfo = (product) => {
    if (!product) return null

    const originalPrice = product?.exportPrice || 0
    const discountPrice = product?.firstVariantDiscountPrice

    if (
      discountPrice != null &&
      discountPrice > 0 &&
      discountPrice < originalPrice
    ) {
      return {
        text: 'Giảm giá',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
        color: 'white'
      }
    }

    if (product.createdAt) {
      const createdAtTime = new Date(product.createdAt).getTime()

      const now = new Date()
      const endOfToday = new Date(now.setHours(23, 59, 59, 999)).getTime()
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7))
      sevenDaysAgo.setHours(0, 0, 0, 0)
      const sevenDaysAgoTime = sevenDaysAgo.getTime()

      if (createdAtTime >= sevenDaysAgoTime && createdAtTime <= endOfToday) {
        return {
          text: 'Mới',
          background: 'linear-gradient(135deg,rgb(45, 78, 128) 0%,rgb(44, 94, 187) 100%)',
          color: 'white'
        }
      }
    }

    return null
  }

  const stickerInfo = getStickerInfo(product)

  if (!stickerInfo) {
    return null
  }

  return (
    <div
      style={{
        position: 'absolute',
        top,
        right,
        left,
        bottom,
        zIndex: 6,
        background: stickerInfo.background,
        color: stickerInfo.color,
        fontWeight,
        fontSize,
        padding,
        boxShadow,
        borderRadius,
        textTransform: 'uppercase',
        fontFamily: 'inherit',
        clipPath: 'polygon(0 0, 100% 0, calc(100% - 10px) 50%, 100% 100%, 0 100%)',
        letterSpacing: '0.5px',
        minWidth: '80px',
        textAlign: 'center',
        ...style
      }}
      {...props}
    >
      {stickerInfo.text}
    </div>
  )
}

export default Sticker
