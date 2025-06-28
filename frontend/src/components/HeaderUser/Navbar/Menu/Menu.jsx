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
    // Lọc ra các danh mục parent (không có parent hoặc parent = null)
    const parentCategories = categories.filter(cat => !cat.destroy && !cat.parent)
    
    const allItems = menuConfig?.mainMenu
      ? [
          ...(menuConfig.mainMenu.some(item => item.visible && item.children?.length > 0) ? [{ label: 'Sản phẩm', url: '/product', hasMegaMenu: true }] : []),
          { label: 'Hàng mới', url: '/productnews', isNew: true },
          ...menuConfig.mainMenu
            .filter(item => item.visible && (!item.children || item.children.length === 0))
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(item => ({ label: item.label, url: item.url })),
          ...parentCategories.map(cat => ({ label: cat.name, url: `/productbycategory/${cat._id}`, category: cat }))
        ]
      : [
          { label: 'Sản phẩm', url: '/product', hasMegaMenu: true },
          { label: 'Hàng mới', url: '/productnews', isNew: true },
          ...parentCategories.map(cat => ({ label: cat.name, url: `/productbycategory/${cat._id}`, category: cat }))
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
  // Chỉ hiển thị arrow khi có nhiều hơn 1 row
  const shouldShowArrows = menuRows.length > 1

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

  // Helper function để lấy danh mục con của một danh mục parent
  const getChildCategories = (parentCategory) => {
    if (!parentCategory || !parentCategory._id) {
      return []
    }
    return categories.filter(cat => 
      !cat.destroy && 
      cat.parent && 
      (typeof cat.parent === 'object' ? cat.parent._id : cat.parent) === parentCategory._id
    )
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
        zIndex: 1400, // Thêm z-index cho container chính
      }}
    >
      {/* Menu container với arrow ngoài cùng bên phải, menu item luôn căn giữa và rộng rãi */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, justifyContent: 'center', position: 'relative', width: '100%', maxWidth: '1400px', mx: 'auto', height: 56, overflow: 'visible' }}>
        {/* Menu item */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, overflow: 'visible', width: '100%', maxWidth: '1400px' }}>
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
                  sx={{ display: 'inline-flex', position: 'relative', zIndex: 1410 }}
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
                  {item.category && hoveredCategory?._id === item.category._id && (
                    <Box
                      onMouseEnter={handleCategoryMenuEnter}
                      onMouseLeave={handleCategoryMenuLeave}
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'white',
                        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
                        minWidth: 200,
                        maxWidth: '95vw',
                        zIndex: 1500, // Z-index cao hơn AppBar và Topbar
                        borderRadius: '0 0 8px 8px',
                        border: '1px solid #e2e8f0',
                        animation: 'slideDown 0.2s ease-out',
                        '@keyframes slideDown': {
                          '0%': { opacity: 0, transform: 'translateX(-50%) translateY(-10px) scaleY(0.95)' },
                          '100%': { opacity: 1, transform: 'translateX(-50%) translateY(0) scaleY(1)' }
                        },
                        // Đảm bảo submenu không bị overflow của parent
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '-5px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '20px',
                          height: '5px',
                          background: 'transparent'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          p: 2
                        }}
                      >
                        {(() => {
                          if (!item.category) return null
                          const childCategories = getChildCategories(item.category)
                          return childCategories.length > 0 ? (
                            childCategories.map((child) => (
                              <Button
                                key={child._id}
                                href={`/productbycategory/${child._id}`}
                                sx={{
                                  justifyContent: 'flex-start',
                                  textAlign: 'left',
                                  color: '#222',
                                  fontWeight: 400,
                                  fontSize: '1rem',
                                  px: 2,
                                  py: 1,
                                  minWidth: 0,
                                  background: 'none',
                                  boxShadow: 'none',
                                  textTransform: 'none',
                                  borderRadius: 1,
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    color: '#1976d2',
                                    background: '#f8fafc',
                                    transform: 'translateX(5px)'
                                  }
                                }}
                              >
                                {child.name}
                              </Button>
                            ))
                          ) : (
                            <Typography
                              sx={{
                                color: 'text.secondary',
                                fontSize: '0.95rem',
                                fontStyle: 'italic',
                                px: 2,
                                py: 1
                              }}
                            >
                              Chưa có danh mục con
                            </Typography>
                          )
                        })()}
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Slide>
        </Box>
        {/* 2 arrow ngoài cùng bên phải, nhỏ lại */}
        {shouldShowArrows && (
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
        )}
      </Box>

      {/* MegaMenu Block */}
      {((menuConfig?.mainMenu && menuConfig.mainMenu.some(item => item.visible && item.children?.length > 0)) || 
        (!menuConfig?.mainMenu && categories.length > 0)) && (
        <Box
          ref={menuRef}
          sx={{
            position: 'absolute',
            top: '100%',
            left: '55%',
            transform: productMenuOpen
              ? 'translateX(-50%) scaleY(1)'
              : 'translateX(-50%) scaleY(0)',
            transformOrigin: 'top',
            width: '90vw',
            maxWidth: '90vw',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            p: productMenuOpen ? 4 : 0,
            zIndex: 1450, // Thấp hơn submenu một chút để không che phủ
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden',
            transition: 'transform 0.35s ease, padding 0.2s ease, opacity 0.35s ease',
            opacity: productMenuOpen ? 1 : 0,
            pointerEvents: productMenuOpen ? 'auto' : 'none',
            mx: 'auto',
            mt:1
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
              maxWidth: '95vw',
              opacity: productMenuOpen ? 1 : 0,
              transition: 'opacity 0.35s ease',

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

    </Box>
  )
}

export default Menu