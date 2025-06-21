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
  ...props
}) => (
  <div
    style={{
      position: 'absolute',
      top,
      right,
      left,
      bottom,
      zIndex: 6,
      background,
      color,
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
    {text}
  </div>
)

export default Sticker
  