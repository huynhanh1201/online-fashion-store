import React, { useRef, useState, useEffect } from 'react'
import { Box, Button, Popover, Typography, useMediaQuery } from '@mui/material'
import { styled } from '@mui/system'
import { getCategories } from '~/services/categoryService'
import { useTheme } from '@mui/material/styles'

const StyledButton = styled(Button)(({ theme, active }) => ({
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
    width: active ? '100%' : 0,
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

// Tạo keyframes cho hiệu ứng slide down từ trên xuống
const slideDownKeyframes = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px) scaleY(0);
      transform-origin: top;
    }
    to {
      opacity: 1;
      transform: translateY(0) scaleY(1);
      transform-origin: top;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateY(0) scaleY(1);
      transform-origin: top;
    }
    to {
      opacity: 0;
      transform: translateY(-20px) scaleY(0);
      transform-origin: top;
    }
  }
`

const AnimatedPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    transformOrigin: 'top center',
    animation: 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&.closing': {
      animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }
  }
}))

// Thêm CSS vào head
const addGlobalStyles = () => {
  if (!document.getElementById('megamenu-styles')) {
    const style = document.createElement('style')
    style.id = 'megamenu-styles'
    style.textContent = slideDownKeyframes
    document.head.appendChild(style)
  }
}

const Menu = () => {
  const [hovered, setHovered] = useState({ open: false, anchorEl: null })
  const [categories, setCategories] = useState([])
  const hoverTimeout = useRef(null)
  const [productMenuOpen, setProductMenuOpen] = useState(false)
  const [productMenuAnchor, setProductMenuAnchor] = useState(null)
  const [isDrawerHovered, setIsDrawerHovered] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const closeTimeout = useRef(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    addGlobalStyles()
    
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

  const handleProductEnter = (e) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
    setProductMenuAnchor(e.currentTarget)
    setIsClosing(false)
    setProductMenuOpen(true)
  }

  const handleProductLeave = () => {
    if (!isDrawerHovered) {
      setIsClosing(true)
      setProductMenuOpen(false)
      setProductMenuAnchor(null)
      setIsClosing(false)
    }
  }

  const handleDrawerEnter = () => {
    setIsDrawerHovered(true)
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
    setIsClosing(false)
  }

  const handleDrawerLeave = () => {
    setIsDrawerHovered(false)
    setIsClosing(true)
    setProductMenuOpen(false)
    setProductMenuAnchor(null)
    setIsClosing(false)
    setIsDrawerHovered(false)
  }

  // Đóng menu khi scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsClosing(true)
      setProductMenuOpen(false)
      setProductMenuAnchor(null)
      setIsClosing(false)
      setIsDrawerHovered(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const columns = 4
  const categoriesPerCol = Math.ceil(categories.length / columns)
  const categoryColumns = Array.from({ length: columns }, (_, i) =>
    categories.slice(i * categoriesPerCol, (i + 1) * categoriesPerCol)
  )

  // Dữ liệu nhóm danh mục cứng theo mẫu
  const menuColumns = [
    {
      title: 'ÁO',
      items: [
        'Áo Thun', 'Áo Polo', 'Áo Sơmi', 'Áo Khoác', 'Áo Nỉ Và Len', 'Hoodie', 'Tank Top - Áo Ba Lỗ', 'Set đồ', 'BEST SELLER'
      ]
    },
    {
      title: 'QUẦN',
      items: [
        'Quần Jean', 'Quần Short', 'Quần Kaki & Chino', 'Quần Jogger - Quần Dài', 'Quần Tây', 'Quần Boxer', 'Set Đồ', 'OUTLET - ƯU ĐÃI 30% - 70%'
      ]
    },
    {
      title: 'GIÀY & PHỤ KIỆN',
      items: [
        'Giày & Dép', 'Balo, Túi & Ví', 'Nón', 'Thắt Lưng', 'Vớ', 'Mắt Kính'
      ]
    },
    {
      title: 'SMART JEANS',
      items: []
    }
  ]

  const renderPopoverContent = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {categories.map((cat) => (
          <CategoryButton
            key={cat._id}
            href={`/productbycategory/${cat._id}`}
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
      <Box
        onMouseEnter={handleProductEnter}
        onMouseLeave={handleProductLeave}
        sx={{ position: 'relative' }}
      >
        <StyledButton 
          href='/product'
          active={productMenuOpen || isDrawerHovered}
        >
          Sản phẩm
        </StyledButton>
        <Popover
          open={productMenuOpen}
          anchorEl={productMenuAnchor}
          onClose={() => {}} // Tắt auto close
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          PaperProps={{
            onMouseEnter: handleDrawerEnter,
            onMouseLeave: handleDrawerLeave,
            sx: {
              mt: 1,
              maxWidth: 1800,
              width: isMobile ? '100vw' : '1800px',
              position: 'fixed',
              left: '50%',
              top: isMobile ? 56 : 80,
              transform: (productMenuOpen && !isClosing) ? 'translate(-50%, 0)' : 'translate(-50%, 1px)',
              opacity: 1,
              borderRadius: 2,
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              p: 3,
              overflowX: 'auto',
              transformOrigin: 'top center',
              transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
              zIndex: 1400,
            }
          }}
          disableRestoreFocus
          disableAutoFocus
          disableEnforceFocus
          disableEscapeKeyDown
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : `repeat(${menuColumns.length}, 1fr)`,
              gap: 5,
              width: '100%',
              maxWidth: 1500,
            }}
          >
            {menuColumns.map((col, idx) => (
              <Box key={col.title} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ 
                  fontWeight: 'bold', 
                  borderBottom: '2px solid #000', 
                  mb: 1, 
                  textTransform: 'uppercase', 
                  fontSize: '1.08rem'
                }}>
                  {col.title}
                </Typography>
                {col.items.map((item, i) => (
                  <Button
                    key={item + i}
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      color: '#222',
                      fontWeight: item === item.toUpperCase() ? 700 : 400,
                      fontSize: '1rem',
                      px: 0,
                      minWidth: 0,
                      background: 'none',
                      boxShadow: 'none',
                      '&:hover': { 
                        color: '#1976d2', 
                        background: 'none',
                        transform: 'translateX(5px)',
                        transition: 'all 0.2s ease'
                      }
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            ))}
          </Box>
        </Popover>
      </Box>
      {categories.map((cat) => (
        <StyledButton
          key={cat._id}
          href={`/productbycategory/${cat._id}`}
        >
          {cat.name}
        </StyledButton>
      ))}
    </Box>
  )
}

export default Menu