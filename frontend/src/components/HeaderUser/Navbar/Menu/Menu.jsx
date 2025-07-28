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

import { Link } from 'react-router-dom'

const StyledButton = styled(Button)(({ theme, active }) => ({
  color: 'var(--text-color)',
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
    backgroundColor: 'var(--primary-color)',
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

const Menu = ({ headerRef, currentUser }) => {
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
  const [slideDirection, setSlideDirection] = useState('left')
  const [isInitialized, setIsInitialized] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
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
        const categories =
          categoriesResponse.categories?.data || categoriesResponse || []
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

  // Set initialized after component mounts to prevent initial animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    function updateItemsPerRow() {
      const width = menuContainerRef.current?.offsetWidth || window.innerWidth
      if (currentUser) {
        if (width >= 1600) setItemsPerRow(8)
        else if (width >= 1500) setItemsPerRow(7)
        else if (width >= 1400) setItemsPerRow(6)
        else if (width >= 1190) setItemsPerRow(4)
        else if (width >= 1020) setItemsPerRow(3)
        else if (width >= 920) setItemsPerRow(2)
        else setItemsPerRow(2)
      } else {
        if (width >= 1600) setItemsPerRow(7)
        else if (width >= 1500) setItemsPerRow(6)
        else if (width >= 1400) setItemsPerRow(5)
        else if (width >= 1300) setItemsPerRow(4)
        else if (width >= 1100) setItemsPerRow(3)
        else if (width >= 990) setItemsPerRow(3)
        else setItemsPerRow(2)
      }
    }
    updateItemsPerRow()
    window.addEventListener('resize', updateItemsPerRow)
    return () => window.removeEventListener('resize', updateItemsPerRow)
  }, [])

  const getMenuRows = () => {
    // Lấy tất cả danh mục con có sản phẩm
    const childCategoriesWithProduct = categories.filter(
      (cat) => cat.parent && !cat.destroy
    )
    // Lấy danh sách parentId từ các danh mục con có sản phẩm
    const parentIds = [
      ...new Set(
        childCategoriesWithProduct.map((cat) =>
          typeof cat.parent === 'object' ? cat.parent._id : cat.parent
        )
      )
    ]
    // Lấy các danh mục parent thực sự có children có sản phẩm
    const parentCategories = categories.filter(
      (cat) => parentIds.includes(cat._id) && !cat.destroy
    )
    // Lấy các danh mục gốc (không có parent) nhưng có sản phẩm
    const rootCategoriesWithProducts = categories.filter(
      (cat) =>
        !cat.parent &&
        !cat.destroy &&
        Array.isArray(cat.products) &&
        cat.products.length > 0
    )

    const allItems = [
      // Luôn hiển thị "Sản phẩm" và "Hàng mới"
      { label: 'Sản phẩm', url: '/product', hasMegaMenu: true },
      { label: 'Hàng mới', url: '/productnews', isNew: true },
      // Thêm các menu từ config nếu có
      ...(menuConfig?.mainMenu
        ? menuConfig.mainMenu
            .filter(
              (item) =>
                item.visible && (!item.children || item.children.length === 0)
            )
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((item) => ({ label: item.label, url: item.url }))
        : []),
      // Thêm các danh mục parent thực sự có children có sản phẩm
      ...parentCategories.map((cat) => ({
        label: cat.name,
        url: `/productbycategory/${cat._id}`,
        category: cat
      })),
      // Thêm các danh mục gốc có sản phẩm
      ...rootCategoriesWithProducts.map((cat) => ({
        label: cat.name,
        url: `/productbycategory/${cat._id}`,
        category: cat
      })),
      { label: 'Tin thời trang', url: '/blog' }
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
      setSlideDirection('right')
      setPrevRow(currentRow)
      setCurrentRow((prev) => prev - 1)
    } else if (direction === 'right' && canNavigateRight) {
      setSlideDirection('left')
      setPrevRow(currentRow)
      setCurrentRow((prev) => prev + 1)
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
      }, megamenuSettings.animationDuration / 2)
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
    }, megamenuSettings.animationDuration)
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
      const parent = allCategories.find(
        (cat) =>
          cat._id ===
          (typeof current.parent === 'object'
            ? current.parent._id
            : current.parent)
      )
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
    return categories.filter(
      (cat) =>
        !cat.destroy &&
        cat.parent &&
        (typeof cat.parent === 'object' ? cat.parent._id : cat.parent) ===
          parentCategory._id
    )
  }

  // Get megamenu settings from config
  const getMegamenuSettings = () => {
    return (
      menuConfig?.settings?.megamenuSettings || {
        maxColumns: 4,
        columnWidth: 'auto',
        showIcons: false,
        animationDuration: 350,
        showCategoryImages: false,
        enableHoverEffects: true
      }
    )
  }

  const megamenuSettings = getMegamenuSettings()

  // Get number of columns for megamenu based on settings
  const getMegamenuColumns = () => {
    if (menuConfig?.mainMenu && menuConfig.mainMenu.length > 0) {
      return Math.min(
        menuConfig.mainMenu.filter((item) => item.visible).length,
        megamenuSettings.maxColumns
      )
    }
    // Khi không có menu config, hiển thị 1 cột cho menu "Sản phẩm" mặc định
    return 1
  }

  const megamenuColumns = getMegamenuColumns()

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
        zIndex: 1400 // Thêm z-index cho container chính
      }}
    >
      {/* Menu container với arrow ngoài cùng bên phải, menu item luôn căn giữa và rộng rãi */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          minWidth: 0,
          justifyContent: 'center',
          position: 'relative',
          width: '100%',
          maxWidth: '1400px',
          mx: 'auto',
          height: 56,
          overflow: 'visible'
        }}
      >
        {/* Menu item */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 0,
            overflow: 'visible',
            width: '100%',
            maxWidth: '1400px'
          }}
        >
          <Slide
            direction={slideDirection}
            in={isInitialized}
            key={currentRow}
            mountOnEnter
            unmountOnExit
            timeout={isInitialized ? 350 : 0}
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
                maxWidth: '1400px'
              }}
            >
              {menuRows[currentRow]?.map((item, index) => (
                <Box
                  key={item.label + index}
                  sx={{
                    display: 'inline-flex',
                    position: 'relative',
                    zIndex: 1410
                  }}
                  onMouseEnter={() =>
                    item.category && handleCategoryEnter(item.category)
                  }
                  onMouseLeave={() => item.category && handleCategoryLeave()}
                >
                  {item.isNew ? (
                    <Badge
                      badgeContent={
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: 'red'
                          }}
                        >
                          MỚI
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
                          borderRadius: 0
                        }
                      }}
                    >
                      <StyledButton href={item.url}>{item.label}</StyledButton>
                    </Badge>
                  ) : (
                    <StyledButton
                      href={item.url}
                      active={
                        (item.hasMegaMenu &&
                          (productMenuOpen || isDrawerHovered)) ||
                        (item.category &&
                          hoveredCategory?._id === item.category._id)
                          ? true
                          : undefined
                      }
                      ref={item.hasMegaMenu ? productButtonRef : null}
                      onMouseEnter={
                        item.hasMegaMenu ? handleProductEnter : undefined
                      }
                      onMouseLeave={
                        item.hasMegaMenu ? handleProductLeave : undefined
                      }
                    >
                      {item.label}
                    </StyledButton>
                  )}
                  {/* Submenu cho category */}
                  {item.category && (
                    <Box
                      onMouseEnter={handleCategoryMenuEnter}
                      onMouseLeave={handleCategoryMenuLeave}
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '15px',
                        transform:
                          hoveredCategory?._id === item.category._id
                            ? 'translateY(0) scaleY(1)'
                            : 'translateY(-10px) scaleY(0.95)',
                        opacity:
                          hoveredCategory?._id === item.category._id ? 1 : 0,
                        pointerEvents:
                          hoveredCategory?._id === item.category._id
                            ? 'auto'
                            : 'none',
                        bgcolor: 'white',
                        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
                        minWidth: 200,
                        maxWidth: '95vw',
                        zIndex: 1500,
                        border: '1px solid #e2e8f0',
                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                        transformOrigin: 'top left',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '-5px',
                          left: '20px',
                          transform: 'none',
                          width: '20px',
                          height: '5px',
                          background: 'transparent'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        {(() => {
                          if (!item.category) return null
                          const childCategories = getChildCategories(
                            item.category
                          )
                          return childCategories.length > 0 ? (
                            childCategories.map((child) => (
                              <Button
                                key={child._id}
                                href={`/category/${child.slug}`}
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
                                    background: '#f8fafc'
                                  }
                                }}
                              >
                                {child.name}
                              </Button>
                            ))
                          ) : (
                            <Typography
                              component='div'
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
          <Box sx={{ display: 'flex', flexDirection: 'row', ml: 0.5, mr: 2 }}>
            <Button
              onClick={() => navigateRow('left')}
              disabled={!canNavigateLeft}
              sx={{
                minWidth: 8,
                width: 20,
                height: 20,
                zIndex: 900, // Giảm zIndex để search input đè lên arrow
                borderRadius: '6px 0 0 6px',
                background: 'transparent',
                boxShadow: 'none',
                minHeight: 0,
                '&:hover': {
                  background: 'transparent'
                }
              }}
            >
              <ChevronLeft
                sx={{
                  fontSize: 20,
                  color: canNavigateLeft ? '#1A3C7B' : '#ccc',
                  fontWeight: canNavigateLeft ? 700 : 400
                }}
              />
            </Button>
            <Button
              onClick={() => navigateRow('right')}
              disabled={!canNavigateRight}
              sx={{
                minWidth: 8,
                width: 20,
                height: 20,
                zIndex: 900, // Giảm zIndex để search input đè lên arrow
                borderRadius: '0 6px 6px 0',
                background: 'transparent',
                boxShadow: 'none',
                minHeight: 0,
                '&:hover': {
                  background: 'transparent'
                }
              }}
            >
              <ChevronRight
                sx={{
                  fontSize: 20,
                  color: canNavigateRight ? '#1A3C7B' : '#ccc',
                  fontWeight: canNavigateRight ? 700 : 400
                }}
              />
            </Button>
          </Box>
        )}
      </Box>

      {/* MegaMenu Block */}
      {(menuConfig?.mainMenu?.length > 0 || categories.length > 0) && (
        <Box
          ref={menuRef}
          sx={{
            position: 'fixed',
            top: '105px',
            left: '50%',
            transform: productMenuOpen
              ? 'translateX(-50%) scaleY(1)'
              : 'translateX(-50%) scaleY(0)',
            transformOrigin: 'top',
            width: '100%',
            maxWidth: '1700px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            p: productMenuOpen ? 4 : 0,
            zIndex: 1450,
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden',
            transition: `transform ${megamenuSettings.animationDuration}ms ease, padding 0.2s ease, opacity ${megamenuSettings.animationDuration}ms ease`,
            opacity: productMenuOpen ? 1 : 0,
            pointerEvents: productMenuOpen ? 'auto' : 'none',
            mx: 'auto',
            mt: 1
          }}
          onMouseEnter={handleDrawerEnter}
          onMouseLeave={handleDrawerLeave}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: `repeat(${Math.min(megamenuColumns, 2)}, 1fr)`,
                md: `repeat(${Math.min(megamenuColumns, 3)}, 1fr)`,
                lg: `repeat(${Math.min(megamenuColumns, 4)}, 1fr)`,
                xl: `repeat(${megamenuColumns}, 1fr)`
              },
              gap: { xs: 2, md: 4, lg: 6 },
              width: '100%',
              maxWidth: '100%',
              opacity: productMenuOpen ? 1 : 0,
              transition: `opacity ${megamenuSettings.animationDuration}ms ease`,
              justifyItems: 'start',
              px: { xs: 2, sm: 4 } // padding responsive trái/phải
            }}
          >
            {(menuConfig?.mainMenu?.length > 0
              ? menuConfig.mainMenu
                  .filter((item) => item.visible)
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
              : [
                  {
                    label: 'Sản phẩm',
                    children: [
                      { label: 'Tất cả sản phẩm', url: '/product' },
                      { label: 'Sản phẩm mới', url: '/productnews' }
                    ]
                  }
                ]
            ).map((item, idx) => (
              <Box
                key={item.label + idx}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  alignItems: 'start',
                  width:
                    megamenuSettings.columnWidth === 'auto'
                      ? 'auto'
                      : megamenuSettings.columnWidth
                }}
              >
                <Typography
                  component='div'
                  sx={{
                    fontWeight: 'bold',
                    mb: 1.2,
                    textTransform: 'uppercase',
                    fontSize: '1.08rem',
                    textAlign: 'left'
                  }}
                >
                  {megamenuSettings.showIcons && item.icon && (
                    <span style={{ marginRight: '8px' }}>{item.icon}</span>
                  )}
                  {item.label}
                  <Box
                    sx={{
                      height: '4px',
                      bgcolor: 'var(--primary-color)',
                      width: '40px',
                      mt: 1,
                      mb: 1
                    }}
                  />
                </Typography>

                {item.children?.length > 0 ? (
                  item.children
                    .filter((child) => child.visible)
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((child, i) => (
                      <Button
                        key={child.label + i}
                        href={child.url}
                        sx={{
                          justifyContent: 'start',
                          textAlign: 'left',
                          color: '#222',
                          fontWeight: 400,
                          fontSize: '1.05rem',
                          px: 0,
                          minWidth: 0,
                          background: 'none',
                          textTransform: 'none !important',
                          boxShadow: 'none',
                          '&:hover': {
                            color: '#1976d2',
                            background: megamenuSettings.enableHoverEffects
                              ? 'rgba(25, 118, 210, 0.04)'
                              : 'none',
                            transform: megamenuSettings.enableHoverEffects
                              ? 'translateY(-2px)'
                              : 'none',
                            transition: megamenuSettings.enableHoverEffects
                              ? 'all 0.2s ease'
                              : 'none'
                          }
                        }}
                      >
                        {megamenuSettings.showIcons && child.icon && (
                          <span style={{ marginRight: '8px' }}>
                            {child.icon}
                          </span>
                        )}
                        {child.label}
                      </Button>
                    ))
                ) : (
                  <Typography
                    component='div'
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
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Menu
