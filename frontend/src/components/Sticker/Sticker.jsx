import React from 'react'

const Sticker = ({
  text = '',
  color = 'white',
  background = 'linear-gradient(135deg,rgb(74, 131, 196) 0%, #1A3C7B 100%)',
  top = 0,
  right = 0,
  left,
  bottom,
  fontSize = '14px',
  fontWeight = 600,
  padding = '5px 15px 5px 10px',
  borderRadius = 0,
  boxShadow = '4px  4px 4px 10px rgba(0, 0, 0, 0.1)',
  style = {},
  product,
  ...props
}) => {
  const getStickerInfo = (product) => {
    if (!product) return null

    const now = new Date()
    const createdAt = new Date(product.createdAt)
    const daysSinceCreation = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24))
    const soldCount = product.soldCount || 0
    const discount = product.discount || 0

    if (discount >= 20) {
      return {
        text: 'Giảm giá',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
        color: 'white'
      }
    }

    if (daysSinceCreation <= 7) {
      return {
        text: 'Mới',
        background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
        color: 'white'
      }
    }

    if (soldCount > 100) {
      return {
        text: 'Hot',
        background: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)',
        color: 'white'
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
        ...style
      }}
      {...props}
    >
      {stickerInfo.text}
    </div>
  )
}

export default Sticker
  