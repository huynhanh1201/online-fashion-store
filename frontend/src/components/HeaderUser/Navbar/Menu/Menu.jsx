import React, { useRef, useState, useEffect } from 'react'
import { Box, Button, Popover, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { getCategories } from '~/services/categoryService'

const StyledButton = styled(Button)(({ theme }) => ({
  color: '#000',
  fontWeight: 500,
  padding: '8px 16px',
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
  width: '200px',
  justifyContent: 'center',
  padding: '10px 14px',
  color: theme.palette.text.primary,
  fontWeight: 450,
  textTransform: 'none',
  fontSize: '15px',
  transition: 'all 0.25s ease',
  '&:hover': {
    transform: 'translateX(4px)',
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
  const [hoveredMenu, setHoveredMenu] = useState({ name: null, el: null })
  const [categories, setCategories] = useState([])
  const hoverTimeout = useRef(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(1, 100)
        const categories = response.categories || response || []
        setCategories(categories)
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleHover = (menu, el) => {
    clearTimeout(hoverTimeout.current)
    setHoveredMenu({ name: menu, el })
  }

  const handleLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredMenu({ name: null, el: null })
    }, 200)
  }

  const renderPopoverContent = (categoryName) => {
    // Tạm thời gán cứng loại sản phẩm cho mọi danh mục
    const types = [{ name: 'Loại 1' }, { name: 'Loại 2' }, { name: 'Loại 3' }]

    return (
      <Box
        sx={{
          p: 2,
          minWidth: 400
        }}
      >
        <Typography
          variant='subtitle1'
          fontWeight={700}
          align='center'
          sx={{ mb: 2 }}
        >
          {categoryName.toUpperCase()}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {types.map((type, index) => (
            <CategoryButton key={index} size='small' href='#'>
              {type.name}
            </CategoryButton>
          ))}
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        gap: 2
      }}
    >
      {/* Menu cố định "Sản phẩm" */}
      <StyledButton href='/'>Trang chủ</StyledButton>

      <StyledButton href='/product'>Sản phẩm</StyledButton>

      {/* Các danh mục sản phẩm từ API */}
      {categories.map((cat) => (
        <Box
          key={cat._id}
          onMouseEnter={(e) => handleHover(cat.name, e.currentTarget)}
          onMouseLeave={handleLeave}
        >
          <StyledButton href={`/product?category=${cat._id}`}>
            {cat.name}
          </StyledButton>

          <AnimatedPopover
            open={hoveredMenu.name === cat.name}
            anchorEl={hoveredMenu.el}
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
            {renderPopoverContent(cat.name)}
          </AnimatedPopover>
        </Box>
      ))}
    </Box>
  )
}

export default Menu
