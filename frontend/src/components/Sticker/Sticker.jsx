import React from 'react'

const Sticker = ({
  text = '',
  color = 'white',
  backgroundColor = '#e53935',
  top =11,
  right = -10 ,
  left,
  bottom,
  fontSize = '15px',
  fontWeight = 700,
  padding = '6px 10px',
  borderRadius = '10px',
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
      backgroundColor,
      color,
      fontWeight,
      fontSize,
      padding,
      borderRadius,
      letterSpacing: 1,
      boxShadow: '0 2px 8px rgba(229,57,53,0.15)',
      border: '2px dashed #fff',
      textTransform: 'uppercase',
      fontFamily: 'inherit',
      transform: 'rotate(35deg)',
      ...style,
    }}
    {...props}
  >
    {text}
  </div>
)

export default Sticker
  