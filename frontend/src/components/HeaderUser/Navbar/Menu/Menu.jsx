import React, { useRef, useState, useEffect } from 'react'
import { Box, Button, Popover, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { getCategories } from '~/services/categoryService'

const StyledButton = styled(Button)(({ theme }) => ({
  color: '#000',
  fontWeight: 450,
  padding: '8px',
  borderRadius: '10px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: '2px',
    backgroundColor: '#1A3C7B',
    transition: 'width 0.3s ease'
  },
  '&:hover::after': {
    width: '100%'
  },
  [theme.breakpoints.down('md')]: {
    padding: '6px 12px',
    fontSize: '0.9rem'
  }
}))

const CategoryButton = styled(Button)(({ theme }) => ({
  width: '100%',
  justifyContent: 'start',
  color: theme.palette.text.primary,
  fontWeight: 350,
  textTransform: 'none',
  fontSize: '18px',
  transition: 'all 0.25s ease',
  '&:hover': {
    color: 'red'
  }
}))

const AnimatedPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    animation: 'slideDown 0.3s ease-out',
    '@keyframes slideDown': {
      from: {
        opacity: 0,
        transform: 'translateY(-10px)'
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)'
      }
    },
    '&.MuiPopover-paper-exit': {
      animation: 'slideUp 0.3s ease-in',
      '@keyframes slideUp': {
        from: {
          opacity: 1,
          transform: 'translateY(0)'
        },
        to: {
          opacity: 0,
          transform: 'translateY(-10px)'
        }
      }
    }
  }
}))

const Menu = () => {
  const [hovered, setHovered] = useState({ open: false, anchorEl: null })
  const [categories, setCategories] = useState([])
  const hoverTimeout = useRef(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(1, 100)
        const categories = response.categories.data || response || []
        setCategories(categories)
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error)
        setCategories([]) // fallback an toàn
      }
    }
    fetchCategories()
  }, [])


  const handleEnter = (el) => {
    clearTimeout(hoverTimeout.current)
    setHovered({ open: true, anchorEl: el })
  }

  const handleLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHovered({ open: false, anchorEl: null })
    }, 200)
  }

  const renderPopoverContent = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {categories.map((cat) => (
          <CategoryButton
            key={cat._id}
            href={`/product?category=${cat._id}`}
            size='small'
          >
            {cat.name}
          </CategoryButton>
        ))}
      </Box>
    </Box>
  )

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        gap: 2
      }}
    >
      <StyledButton href='/'>Trang chủ</StyledButton>

      <StyledButton href='/product'>Sản phẩm</StyledButton>

      <Box
        onMouseEnter={(e) => handleEnter(e.currentTarget)}
        onMouseLeave={handleLeave}
      >
        <StyledButton>Danh mục</StyledButton>

        <AnimatedPopover
          open={hovered.open}
          anchorEl={hovered.anchorEl}
          onClose={handleLeave}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          PaperProps={{
            onMouseEnter: () => clearTimeout(hoverTimeout.current),
            onMouseLeave: handleLeave,
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
          }}
          disableRestoreFocus
        >
          {renderPopoverContent()}
        </AnimatedPopover>
      </Box>
      <StyledButton href='/blog'>Blog</StyledButton>
    </Box>
  )
}

export default Menu
