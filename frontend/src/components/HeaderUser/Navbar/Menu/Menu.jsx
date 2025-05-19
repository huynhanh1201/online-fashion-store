import React, { useRef, useState, useEffect } from 'react'
import { Box, Button, Popover, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { getCategories } from '~/services/categoryService'

const StyledButton = styled(Button)(({ theme }) => ({
  color: '#000',
  fontWeight: 500,
  padding: '8px 16px',
  borderRadius: '20px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: '2px',
    backgroundColor: theme.palette.primary.main,
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
  justifyContent: 'flex-start',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid #e0e0e0',
  color: theme.palette.text.primary,
  fontWeight: 400,
  textTransform: 'none',
  fontSize: '15px',
  transition: 'all 0.25s ease',
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    borderColor: theme.palette.primary.main,
    transform: 'translateX(4px)',
    color: theme.palette.primary.main
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

  const renderPopoverContent = (menu) => {
    const renderRow = (title, items) => (
      <Box sx={{ p: 2, minWidth: 200, maxWidth: 250 }}>
        <Typography
          variant='subtitle1'
          fontWeight={600}
          align='center'
          sx={{ mb: 2 }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          {items.map((item, index) => (
            <CategoryButton key={index} size='small' href={item.href || '#'}>
              {item.name}
            </CategoryButton>
          ))}
        </Box>
      </Box>
    )

    if (menu === 'Sản phẩm') {
      const categoryItems = categories.map((cat) => ({
        name: cat.name,
        href: `/product?category=${cat._id}`
      }))
      return renderRow('DANH MỤC SẢN PHẨM', categoryItems)
    }

    if (menu === 'Áo Nam') {
      const items = [
        { name: 'Áo Thun' },
        { name: 'Áo Polo' },
        { name: 'Áo Sơmi' }
      ]
      return renderRow('ÁO NAM', items)
    }

    if (menu === 'Quần Nam') {
      const items = [
        { name: 'Quần Jean' },
        { name: 'Quần Kaki' },
        { name: 'Quần Short' },
        { name: 'Quần Què' }
      ]
      return renderRow('QUẦN NAM', items)
    }

    return null
  }

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        gap: 2
      }}
    >
      {['Sản phẩm', 'Áo Nam', 'Quần Nam'].map((menu) => (
        <Box
          key={menu}
          onMouseEnter={(e) => handleHover(menu, e.currentTarget)}
          onMouseLeave={handleLeave}
        >
          <StyledButton
            href={`/${menu === 'Sản phẩm' ? 'product' : menu.toLowerCase().replace(' ', '-')}`}
          >
            {menu}
          </StyledButton>
          <AnimatedPopover
            open={hoveredMenu.name === menu}
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
            {renderPopoverContent(menu)}
          </AnimatedPopover>
        </Box>
      ))}
    </Box>
  )
}

export default Menu
