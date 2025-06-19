import React, { useRef, useState, useEffect } from 'react'
import {
  Box,
  Button,
  Popover,
  Typography,
  useMediaQuery,
  Badge
} from '@mui/material'
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

const Menu = ({ headerRef }) => {
  const [productMenuOpen, setProductMenuOpen] = useState(false)
  const [isDrawerHovered, setIsDrawerHovered] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [categories, setCategories] = useState([])
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(1, 100)
        const categories = response.categories.data || response || []
        setCategories(categories)
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error)
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  const handleProductEnter = () => {
    setIsClosing(false)
    setProductMenuOpen(true)
  }

  const handleProductLeave = () => {
    if (!isDrawerHovered) {
      setIsClosing(true)
      setProductMenuOpen(false)
    }
  }

  const handleDrawerEnter = () => {
    setIsDrawerHovered(true)
    setIsClosing(false)
  }

  const handleDrawerLeave = () => {
    setIsDrawerHovered(false)
    setIsClosing(true)
    setProductMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsClosing(true)
      setProductMenuOpen(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Organize categories for megamenu
  const menuColumns = categories.map(category => ({
    title: category.name,
    items: category.parent ? [category.parent.name] : []
  }))

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        gap: 2
      }}
    >
      {/* Sản phẩm - MegaMenu */}
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
          anchorEl={headerRef?.current || null}
          onClose={() => {}}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          PaperProps={{
            onMouseEnter: handleDrawerEnter,
            onMouseLeave: handleDrawerLeave,
            sx: {
              mt: 1,
              width: isMobile ? '100vw' : '1500px',
              maxWidth: '95vw',
              borderRadius: 2,
              boxShadow: 3,
              p: 3,
              zIndex: 1400
            }
          }}
          disableRestoreFocus
          disableAutoFocus
          disableEnforceFocus
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(menuColumns.length, 4)}, 1fr)`,
              gap: 5
            }}
          >
            {menuColumns.map((col, index) => (
              <Box key={col.title + index} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    borderBottom: '2px solid #000',
                    mb: 1,
                    textTransform: 'uppercase',
                    fontSize: '1.08rem'
                  }}
                >
                  {col.title}
                </Typography>
                {col.items.map((item, i) => (
                  <Button
                    key={item + i}
                    href={`/productbycategory/${categories[index]._id}`}
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      color: '#222',
                      fontWeight: 400,
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
      {/* Hàng mới với nhãn dán news */}
      <Box sx={{ display: 'inline-flex', alignItems: 'center', position: 'relative', mr: 0.5 }}>
        <Badge
          badgeContent={<span style={{ fontSize: '12px', fontWeight: 700, color: 'red' }}>new</span>}
          color="default"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            '& .MuiBadge-badge': {
              top: 2,
              right: 2,
              padding: 0,
              minWidth: 0,
              height: 'auto',
              background: 'none',
              borderRadius: 0,
              zIndex: 1
            }
          }}
        >
          <StyledButton href='/productnews' sx={{ pr: 2 }}>
            Hàng mới
          </StyledButton>
        </Badge>
      </Box>

      {/* Các danh mục khác */}
      {categories.map((cat) => (
        <StyledButton key={cat._id} href={`/productbycategory/${cat._id}`}>
          {cat.name}
        </StyledButton>
      ))}
    </Box>
  )
}

export default Menu