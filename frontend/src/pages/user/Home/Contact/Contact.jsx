import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  IconButton,
  Fade
} from '@mui/material'
import { 
  Email, 
  Phone, 
  WhatsApp,
  Help,
  Chat
} from '@mui/icons-material'

const Contact = () => {
  const [showIcon, setShowIcon] = useState(true)
  const [showSubIcons, setShowSubIcons] = useState(false)
  const [bounce, setBounce] = useState(false)

  // Hiệu ứng bounce cho icon contact
  useEffect(() => {
    const bounceInterval = setInterval(() => {
      if (showIcon && !showSubIcons) {
        setBounce(true)
        setTimeout(() => setBounce(false), 600)
      }
    }, 5000) // Bounce mỗi 5 giây

    return () => clearInterval(bounceInterval)
  }, [showIcon, showSubIcons])

  // Đóng sub icons khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSubIcons) {
        const contactArea = document.querySelector('.contact-area')
        if (contactArea && !contactArea.contains(event.target)) {
          setShowSubIcons(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSubIcons])

  const toggleContact = () => {
    // Không cần function này nữa vì đã bỏ form
  }

  const toggleSubIcons = () => {
    setShowSubIcons(!showSubIcons)
  }

  const handleSubIconClick = (action) => {
    if (action) {
      window.open(action, '_blank')
    }
    setShowSubIcons(false)
  }





  const subIcons = [
    {
      icon: <Phone />,
      title: 'Liên hệ : 0346896599',
      color: '#4CAF50',
      action: 'tel:0346896599',
      delay: 0
    },
    {
      icon: <WhatsApp />,
      title: 'Zalo',
      color: '#25D366',
      action: 'https://zalo.me/0346896599',
      delay: 200
    },
    {
      icon: <Chat />,
      title: 'Messenger',
      color: '#1877F2',
      action: 'https://m.me/onl.fashion.store',
      delay: 300
    }
  ]

  return (
    <Box sx={{ position: 'fixed', bottom: 100, right: 20, zIndex: 1000 }} className="contact-area">
      {/* Sub Icons - Hiển thị khi click vào icon chính */}
      {showSubIcons && (
        <Box sx={{ mb: 2 }}>
          {subIcons.map((item, index) => (
            <Fade in={true} timeout={300 + item.delay} key={index}>
              <Box
                sx={{
                  position: 'relative',
                  mb: 1,
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <IconButton
                  onClick={() => handleSubIconClick(item.action)}
                  sx={{
                    background: item.color,
                    color: 'white',
                    width: 50,
                    height: 50,
                    boxShadow: `0 4px 15px ${item.color}40`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: `0 6px 20px ${item.color}60`
                    }
                  }}
                >
                  {item.icon}
                </IconButton>
                {/* Tooltip */}
                <Box
                  sx={{
                    position: 'absolute',
                    right: 60,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    opacity: 0,
                    animation: 'slideIn 0.3s ease forwards',
                    animationDelay: `${item.delay}ms`,
                    '@keyframes slideIn': {
                      '0%': { opacity: 0, transform: 'translateY(-50%) translateX(10px)' },
                      '100%': { opacity: 1, transform: 'translateY(-50%) translateX(0)' }
                    }
                  }}
                >
                  {item.title}
                </Box>
              </Box>
            </Fade>
          ))}
        </Box>
      )}

      {/* Main Contact Icon */}
      {showIcon && (
        <IconButton
          color='primary'
          onClick={toggleSubIcons}
          sx={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            width: 60,
            height: 60,
            boxShadow: '0 4px 20px rgba(255, 107, 107, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: bounce ? 'scale(1.1)' : 'scale(1)',
            animation: bounce ? 'bounce 0.6s ease' : 'none',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0 6px 25px rgba(255, 107, 107, 0.6)'
            },
            '@keyframes bounce': {
              '0%, 20%, 60%, 100%': { transform: 'translateY(0) scale(1)' },
              '40%': { transform: 'translateY(-10px) scale(1.05)' },
              '80%': { transform: 'translateY(-5px) scale(1.02)' }
            }
          }}
        >
          <Phone sx={{ color: 'white', fontSize: 28 }} />
        </IconButton>
      )}


    </Box>
  )
}

export default Contact
