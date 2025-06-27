import React, { useRef, useState, useEffect } from 'react'
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  Badge,
  Slide,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material'
import { styled } from '@mui/system'
import { getCategories } from '~/services/categoryService'
import { getMenuConfig } from '~/services/admin/webConfig/headerService.js'
import { useTheme } from '@mui/material/styles'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'

const StyledButton = styled(Button)(({ theme, active }) => ({
  color: '#000',
  fontWeight: 450,
  padding: '8px 16px',
  borderRadius: '10px',
  position: 'relative',
  textTransform: 'none',
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

const getMegaMenuColumns = (categories) => {
  if (!categories || categories.length === 0) return []
  return categories.map((cat) => ({
    title: cat.name,
    items: cat.parent ? [cat.parent.name] : [],
    parentId: cat.parent ? cat.parent._id : null,
    id: cat._id
  }))
}

const Menu = ({ headerRef }) => {
  const [productMenuOpen, setProductMenuOpen] = useState(false)
  const [isDrawerHovered, setIsDrawerHovered] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [categories, setCategories] = useState([])
  const [menuConfig, setMenuConfig] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [parentChain, setParentChain] = useState([])
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
  const [isCategoryMenuHovered, setIsCategoryMenuHovered] = useState(false)
  const [currentRow, setCurrentRow] = useState(0)
  const [prevRow, setPrevRow] = useState(0)
  const [slideDirection, setSlideDirection] = useState('up')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const timeoutRef = useRef(null)
  const categoryTimeoutRef = useRef(null)
  const menuRef = useRef(null)
  const categoryMenuRef = useRef(null)
  const productButtonRef = useRef(null)
  const [itemsPerRow, setItemsPerRow] = useState(6)
  const menuContainerRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, menuResponse] = await Promise.all([
          getCategories(1, 100),
          getMenuConfig()
        ])
        const categories = categoriesResponse.categories?.data || categoriesResponse || []
        setCategories(categories)
        setMenuConfig(menuResponse?.content || null)
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu menu:', error)
        setCategories([])
        setMenuConfig(null)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    function updateItemsPerRow() {
      const width = menuContainerRef.current?.offsetWidth || window.innerWidth
      if (width > 1200) setItemsPerRow(6)
      else if (width > 900) setItemsPerRow(5)
      else if (width > 700) setItemsPerRow(3)
      else if (width > 500) setItemsPerRow(3)
      else setItemsPerRow(3)
    }
    updateItemsPerRow()
    window.addEventListener('resize', updateItemsPerRow)
    return () => window.removeEventListener('resize', updateItemsPerRow)
  }, [])

  const getMenuRows = () => {
    const allItems = menuConfig?.mainMenu
      ? [
          ...(menuConfig.mainMenu.some(item => item.visible && item.children?.length > 0) ? [{ label: 'Sản phẩm', url: '/product', hasMegaMenu: true }] : []),
          { label: 'Hàng mới', url: '/productnews', isNew: true },
          ...menuConfig.mainMenu
            .filter(item => item.visible && (!item.children || item.children.length === 0))
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(item => ({ label: item.label, url: item.url })),
          ...categories.filter(cat => !cat.destroy).map(cat => ({ label: cat.name, url: `/productbycategory/${cat._id}`, category: cat }))
        ]
      : [
          { label: 'Sản phẩm', url: '/product', hasMegaMenu: true },
          { label: 'Hàng mới', url: '/productnews', isNew: true },
          ...categories.filter(cat => !cat.destroy).map(cat => ({ label: cat.name, url: `/productbycategory/${cat._id}`, category: cat }))
        ]
    const rows = []
    for (let i = 0; i < allItems.length; i += itemsPerRow) {
      rows.push(allItems.slice(i, i + itemsPerRow))
    }
    return rows
  }

  const menuRows = getMenuRows()
  const canNavigateLeft = currentRow > 0
  const canNavigateRight = currentRow < menuRows.length - 1

  const navigateRow = (direction) => {
    if (direction === 'left' && canNavigateLeft) {
      setSlideDirection('down')
      setPrevRow(currentRow)
      setCurrentRow(prev => prev - 1)
    } else if (direction === 'right' && canNavigateRight) {
      setSlideDirection('down')
      setPrevRow(currentRow)
      setCurrentRow(prev => prev + 1)
    }
  }

  // Megamenu handlers
  const handleProductEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsClosing(false)
    setProductMenuOpen(true)
  }

  const handleProductLeave = () => {
    if (!isDrawerHovered) {
      setIsClosing(true)
      timeoutRef.current = setTimeout(() => {
        setProductMenuOpen(false)
      }, 50)
    }
  }

  const handleDrawerEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsDrawerHovered(true)
    setIsClosing(false)
  }

  const handleDrawerLeave = () => {
    setIsDrawerHovered(false)
    setIsClosing(true)
    timeoutRef.current = setTimeout(() => {
      setProductMenuOpen(false)
    }, 200)
  }

  // Category submenu handlers
  const handleCategoryEnter = (category) => {
    if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current)
    setHoveredCategory(category)
    setParentChain(getParentChain(category, categories))
    setCategoryMenuOpen(true)
    setIsCategoryMenuHovered(false)
  }

  const handleCategoryLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null)
      setParentChain([])
      setCategoryMenuOpen(false)
    }, 200)
  }

  const handleCategoryMenuEnter = () => {
    if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current)
    setIsCategoryMenuHovered(true)
  }

  const handleCategoryMenuLeave = () => {
    setIsCategoryMenuHovered(false)
    categoryTimeoutRef.current = setTimeout(() => {
      setCategoryMenuOpen(false)
      setHoveredCategory(null)
    }, 200)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsClosing(true)
      setProductMenuOpen(false)
      setCategoryMenuOpen(false)
      setHoveredCategory(null)
    }

    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target) &&
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        setIsClosing(true)
        setProductMenuOpen(false)
        setCategoryMenuOpen(false)
        setHoveredCategory(null)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleOutsideClick)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current)
    }
  }, [])

  const getParentChain = (category, allCategories) => {
    const chain = []
    let current = category
    while (current && current.parent) {
      const parent = allCategories.find(cat => cat._id === (typeof current.parent === 'object' ? current.parent._id : current.parent))
      if (parent) {
        chain.unshift(parent)
        current = parent
      } else {
        break
      }
    }
    return chain
  }

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        position: 'relative',
        flex: 1,
        gap: 2,
        width: '100%',
        maxWidth: '1400px',
      }}
    >
      {/* Menu container với arrow ngoài cùng bên phải, menu item luôn căn giữa và rộng rãi */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, justifyContent: 'center', position: 'relative', width: '100%', maxWidth: '1400px', mx: 'auto', height: 56 }}>
        {/* Menu item */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, overflow: 'hidden', width: '100%', maxWidth: '1400px' }}>
          <Slide
            direction={slideDirection}
            in={true}
            key={currentRow}
            mountOnEnter
            unmountOnExit
            timeout={350}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                minHeight: 48,
                justifyContent: 'center',
                position: 'relative',
                left: 0,
                right: 0,
                top: 0,
                maxWidth: '1400px',
              }}
            >
              {menuRows[currentRow]?.map((item, index) => (
                <Box
                  key={item.label + index}
                  sx={{ display: 'inline-flex', position: 'relative' }}
                  onMouseEnter={() => item.category && handleCategoryEnter(item.category)}
                  onMouseLeave={() => item.category && handleCategoryLeave()}
                >
                  {item.isNew ? (
                    <Badge
                      badgeContent={
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'red' }}>
                          mới
                        </span>
                      }
                      color='default'
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                      sx={{
                        '& .MuiBadge-badge': {
                          top: 2,
                          padding: 0,
                          minWidth: 0,
                          height: 'auto',
                          background: 'none',
                          borderRadius: 0,
                        }
                      }}
                    >
                      <StyledButton href={item.url}>
                        {item.label}
                      </StyledButton>
                    </Badge>
                  ) : (
                    <StyledButton
                      href={item.url}
                      active={item.hasMegaMenu && (productMenuOpen || isDrawerHovered)}
                      ref={item.hasMegaMenu ? productButtonRef : null}
                      onMouseEnter={item.hasMegaMenu ? handleProductEnter : undefined}
                      onMouseLeave={item.hasMegaMenu ? handleProductLeave : undefined}
                    >
                      {item.label}
                    </StyledButton>
                  )}
                  {/* Submenu cho category */}
                  {item.category && hoveredCategory?._id === item.category._id && parentChain.length > 0 && (
                    <Box
                      onMouseEnter={handleCategoryMenuEnter}
                      onMouseLeave={handleCategoryMenuLeave}
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'white',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        minWidth: 200,
                        maxWidth: '95vw',
                        zIndex: 1000,
                        borderRadius: 1,
                        border: '1px solid #e2e8f0',
                        animation: 'slideDown 0.2s ease-out',
                        '@keyframes slideDown': {
                          '0%': { opacity: 0, transform: 'scaleY(0.95)' },
                          '100%': { opacity: 1, transform: 'scaleY(1)' }
                        }
                      }}
                    >
                      <List sx={{ p: 0, m: 0 }}>
                        {parentChain.map((parent) => (
                          <ListItem key={parent._id} sx={{ p: 0, m: 0 }}>
                            <ListItemButton
                              href={`/productbycategory/${parent._id}`}
                              sx={{
                                color: '#333',
                                fontWeight: 400,
                                fontSize: '0.9rem',
                                py: 1,
                                px: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  color: '#1976d2',
                                  background: '#f8fafc'
                                }
                              }}
                            >
                              <ListItemText primary={parent.name} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Slide>
        </Box>
        {/* 2 arrow ngoài cùng bên phải, nhỏ lại */}
        <Box sx={{ display: 'flex', flexDirection: 'row', ml: 0.5 }}>
          <Button
            onClick={() => navigateRow('left')}
            disabled={!canNavigateLeft}
            sx={{
              minWidth: 8,
              width: 20,
              height: 20,
              borderRadius: '6px 0 0 6px',
              background: 'transparent',
              boxShadow: 'none',
              minHeight: 0,
              '&:hover': {
                background: 'transparent'
              }
            }}
          >
            <ChevronLeft sx={{ fontSize: 20, color: canNavigateLeft ? '#1A3C7B' : '#ccc', fontWeight: canNavigateLeft ? 700 : 400 }} />
          </Button>
          <Button
            onClick={() => navigateRow('right')}
            disabled={!canNavigateRight}
            sx={{
              minWidth: 8,
              width: 20,
              height: 20,
              borderRadius: '0 6px 6px 0',
              background: 'transparent',
              boxShadow: 'none',
              minHeight: 0,
              '&:hover': {
                background: 'transparent'
              }
            }}
          >
            <ChevronRight sx={{ fontSize: 20, color: canNavigateRight ? '#1A3C7B' : '#ccc', fontWeight: canNavigateRight ? 700 : 400 }} />
          </Button>
        </Box>
      </Box>

      {/* MegaMenu Block */}
      {((menuConfig?.mainMenu && menuConfig.mainMenu.some(item => item.visible && item.children?.length > 0)) || 
        (!menuConfig?.mainMenu && categories.length > 0)) && (
        <Box
          ref={menuRef}
          sx={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: productMenuOpen
              ? 'translateX(-50%) scaleY(1)'
              : 'translateX(-50%) scaleY(0)',
            transformOrigin: 'top',
            width: '95vw',
            maxWidth: '2000px',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            p: productMenuOpen ? 4 : 0,
            zIndex: 1400,
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden',
            transition: 'transform 0.35s ease, padding 0.2s ease, opacity 0.35s ease',
            opacity: productMenuOpen ? 1 : 0,
            pointerEvents: productMenuOpen ? 'auto' : 'none'
          }}
          onMouseEnter={handleDrawerEnter}
          onMouseLeave={handleDrawerLeave}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${menuConfig?.mainMenu ? 
                menuConfig.mainMenu.filter(item => item.visible && item.children?.length > 0).length : 
                getMegaMenuColumns(categories).length}, 1fr)`,
              gap: 6,
              width: '100%',
              maxWidth: 2000,
              opacity: productMenuOpen ? 1 : 0,
              transition: 'opacity 0.35s ease',
              alignItems: 'center',
              justifyItems: 'center',
            }}
          >
            {menuConfig?.mainMenu ? (
              menuConfig.mainMenu
                .filter(item => item.visible && item.children?.length > 0)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item, idx) => (
                  <Box
                    key={item.label + idx}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', textAlign: 'center' }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        mb: 1.2,
                        textTransform: 'uppercase',
                        fontSize: '1.08rem',
                        textAlign: 'center'
                      }}
                    >
                      {item.label}
                    </Typography>
                    {item.children
                      .filter(child => child.visible)
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((child, i) => (
                        <Button
                          key={child.label + i}
                          href={child.url}
                          sx={{
                            justifyContent: 'center',
                            textAlign: 'center',
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
                              transform: 'translateY(-2px)',
                              transition: 'all 0.2s ease'
                            }
                          }}
                        >
                          {child.label}
                        </Button>
                      ))}
                    {item.children?.filter(child => child.visible).length === 0 && (
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.95rem',
                          fontStyle: 'italic',
                          textAlign: 'center'
                        }}
                      >
                        Chưa có danh mục
                      </Typography>
                    )}
                  </Box>
                ))
            ) : (
              getMegaMenuColumns(categories).map((col, idx) => (
                <Box
                  key={col.title + idx}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      mb: 1.2,
                      textTransform: 'uppercase',
                      fontSize: '1.08rem'
                    }}
                  >
                    {col.title}
                  </Typography>
                  {col.items.length > 0 ? (
                    col.items.map((item, i) => (
                      <Button
                        key={item + i}
                        href={
                          col.parentId ? `/productbycategory/${col.parentId}` : '#'
                        }
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
                    ))
                  ) : (
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.95rem',
                        fontStyle: 'italic'
                      }}
                    >
                      Chưa có danh mục
                    </Typography>
                  )}
                </Box>
              ))
            )}
          </Box>
        </Box>
      )}

      {/* Category Submenu Slide */}
      <Slide
        direction='up'
        in={categoryMenuOpen && hoveredCategory}
        timeout={200}
        container={headerRef.current}
      >
        <Box
          ref={categoryMenuRef}
          sx={{
            position: 'absolute',
            bottom: headerRef.current
              ? `-${headerRef.current.offsetHeight}px`
              : '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: isMobile ? '100vw' : '400px',
            maxWidth: '95vw',
            borderRadius: 2,
            boxShadow: 3,
            p: 3,
            zIndex: 1400,
            backgroundColor: 'white'
          }}
          onMouseEnter={handleCategoryMenuEnter}
          onMouseLeave={handleCategoryMenuLeave}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography
              sx={{
                fontWeight: 'bold',
                mb: 1,
                textTransform: 'uppercase',
                fontSize: '1.1rem',
                color: '#1A3C7B'
              }}
            >
              {hoveredCategory?.name}
            </Typography>
            {hoveredCategory?.parent ? (
              <Button
                href={`/productbycategory/${hoveredCategory.parent._id}`}
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
                  textTransform: 'none',
                  '&:hover': {
                    color: '#1976d2',
                    background: 'none',
                    transform: 'translateX(5px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                {hoveredCategory.parent.name}
              </Button>
            ) : (
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.95rem',
                  fontStyle: 'italic'
                }}
              >
                Chưa có sản phẩm
              </Typography>
            )}
          </Box>
        </Box>
      </Slide>
    </Box>
  )
}

export default Menu