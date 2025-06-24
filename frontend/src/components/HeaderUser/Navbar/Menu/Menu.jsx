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

// Tạo dữ liệu megamenu: mỗi category là một cột, item là parent (nếu có)
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
  const [hoveredCategoryIdx, setHoveredCategoryIdx] = useState(null)
  const [categoryHoverTimeout, setCategoryHoverTimeout] = useState(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const timeoutRef = useRef(null)
  const categoryTimeoutRef = useRef(null)
  const menuRef = useRef(null)
  const categoryMenuRef = useRef(null)
  const productButtonRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both categories and menu config
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
    setCategoryMenuOpen(true)
    setIsCategoryMenuHovered(false)
  }

  const handleCategoryLeave = () => {
    if (categoryHoverTimeout) {
      clearTimeout(categoryHoverTimeout);
    }
    // Thêm độ trễ trước khi ẩn submenu
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
      setParentChain([]);
    }, 200); // 200ms delay
    setCategoryHoverTimeout(timeout);
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
      if (categoryHoverTimeout) clearTimeout(categoryHoverTimeout)
    }
  }, [categoryHoverTimeout])

  // Organize categories for megamenu
  const menuColumns = categories.map((category) => ({
    title: category.name,
    items: category.parent ? [category.parent.name] : []
  }))

  const visibleCategories = categories.filter(cat => !cat.destroy)

  // Hàm truy ngược parent chain
  const getParentChain = (category, allCategories) => {
    const chain = [];
    let current = category;
    while (current && current.parent) {
      const parent = allCategories.find(cat => cat._id === (typeof current.parent === 'object' ? current.parent._id : current.parent));
      if (parent) {
        chain.unshift(parent);
        current = parent;
      } else {
        break;
      }
    }
    return chain;
  };

  // Hàm xử lý hover đơn giản
  const handleCategoryHover = (category) => {
    // Clear timeout cũ nếu có
    if (categoryHoverTimeout) {
      clearTimeout(categoryHoverTimeout);
    }
    
    // Set timeout để tránh submenu xuất hiện quá nhanh
    const timeout = setTimeout(() => {
      setHoveredCategory(category._id);
      setParentChain(getParentChain(category, categories));
    }, 150); // 150ms delay
    
    setCategoryHoverTimeout(timeout);
  };

  return (
    <>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 2
        }}
      >
        {/* Render menu items from config or fallback to categories */}
        {menuConfig?.mainMenu ? (
          // Use menu config
          <>
            {/* Sản phẩm - MegaMenu (chỉ hiển thị nếu có items với submenu) */}
            {menuConfig.mainMenu.some(item => item.visible && item.children?.length > 0) && (
              <Box
                onMouseEnter={handleProductEnter}
                onMouseLeave={handleProductLeave}
                sx={{ position: 'relative' }}
              >
                <StyledButton
                  href='/product'
                  active={productMenuOpen || isDrawerHovered}
                  ref={productButtonRef}
                >
                  Sản phẩm
                </StyledButton>
              </Box>
            )}

            {/* Hàng mới với nhãn dán news */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                position: 'relative',
                mr: 0.5
              }}
            >
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

            {/* Các menu items khác */}
            {menuConfig.mainMenu
              .filter(item => item.visible && (!item.children || item.children.length === 0))
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((item, index) => (
                <StyledButton key={index} href={item.url}>
                  {item.label}
                </StyledButton>
              ))}

            {/* Categories hiển thị trong menu */}
            {visibleCategories.map((cat) => (
              <Box
                key={cat._id}
                onMouseEnter={() => {
                  handleCategoryHover(cat);
                }}
                onMouseLeave={() => {
                  handleCategoryLeave();
                }}
                sx={{ position: 'relative', display: 'inline-block' }}
              >
                <StyledButton href={`/productbycategory/${cat._id}`}>{cat.name}</StyledButton>
                {/* Submenu hiển thị parent chain */}
                {hoveredCategory === cat._id && parentChain.length > 0 && (
                  <Box
                    onMouseEnter={() => {
                      // Giữ submenu khi hover vào nó
                      if (categoryHoverTimeout) {
                        clearTimeout(categoryHoverTimeout);
                      }
                    }}
                    onMouseLeave={() => {
                      handleCategoryLeave();
                    }}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      bgcolor: 'white',
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                      minWidth: 200,
                      zIndex: 1000,
                      borderRadius: 1,
                      pt: '4px',
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
          </>
        ) : (
          // Fallback to original categories-based menu
          <>
            {/* Sản phẩm - MegaMenu */}
            <Box
              onMouseEnter={handleProductEnter}
              onMouseLeave={handleProductLeave}
              sx={{ position: 'relative' }}
            >
              <StyledButton
                href='/product'
                active={productMenuOpen || isDrawerHovered}
                ref={productButtonRef}
              >
                Sản phẩm
              </StyledButton>
            </Box>

            {/* Hàng mới với nhãn dán news */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                position: 'relative',
                mr: 0.5
              }}
            >
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

            {/* Categories */}
            {visibleCategories.map((cat) => (
              <Box
                key={cat._id}
                onMouseEnter={() => {
                  handleCategoryHover(cat);
                }}
                onMouseLeave={() => {
                  handleCategoryLeave();
                }}
                sx={{ position: 'relative', display: 'inline-block' }}
              >
                <StyledButton href={`/productbycategory/${cat._id}`}>{cat.name}</StyledButton>
                {/* Submenu hiển thị parent chain */}
                {hoveredCategory === cat._id && parentChain.length > 0 && (
                  <Box
                    onMouseEnter={() => {
                      // Giữ submenu khi hover vào nó
                      if (categoryHoverTimeout) {
                        clearTimeout(categoryHoverTimeout);
                      }
                    }}
                    onMouseLeave={() => {
                      handleCategoryLeave();
                    }}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      bgcolor: 'white',
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                      minWidth: 200,
                      zIndex: 1000,
                      borderRadius: 1,
                      pt: '4px',
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
          </>
        )}
      </Box>

      {/* MegaMenu Block với hiệu ứng co giãn chiều cao từ 0% đến 100% */}
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
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            p: productMenuOpen ? 4 : 0,
            zIndex: 1400,
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'start',
            overflow: 'hidden',
            transition:
              'transform 0.35s ease, padding 0.2s ease, opacity 0.35s ease',
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
              transition: 'opacity 0.35s ease'
            }}
          >
            {menuConfig?.mainMenu ? (
              // Use menu config for megamenu - mỗi item có submenu tạo thành 1 cột
              menuConfig.mainMenu
                .filter(item => item.visible && item.children?.length > 0)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item, idx) => (
                  <Box
                    key={item.label + idx}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {/* Title của cột */}
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        mb: 1.2,
                        textTransform: 'uppercase',
                        fontSize: '1.08rem'
                      }}
                    >
                      {item.label}
                    </Typography>
                    
                    {/* Các items trong cột */}
                    {item.children
                      .filter(child => child.visible)
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((child, i) => (
                        <Button
                          key={child.label + i}
                          href={child.url}
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
                          {child.label}
                        </Button>
                      ))}
                    
                    {/* Thông báo nếu không có items */}
                    {item.children?.filter(child => child.visible).length === 0 && (
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
            ) : (
              // Fallback to categories-based megamenu - chỉ khi không có menu config
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
    </>
  )
}

export default Menu
