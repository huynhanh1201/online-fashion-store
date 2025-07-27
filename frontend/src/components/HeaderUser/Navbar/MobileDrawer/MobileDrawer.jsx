import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Drawer,
  IconButton,
  Collapse
} from '@mui/material'
import { styled } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '~/services/productService'
import { getCategories } from '~/services/categoryService'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

// Container giữ input
const SearchWrapper = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%', // Lấp đầy chiều rộng drawer
  zIndex: 1350
})

// Input tìm kiếm
const SearchInput = styled(InputBase)({
  width: '100%', // Lấp đầy chiều rộng
  backgroundColor: '#ffffff',
  padding: '8px 16px',
  borderRadius: 24,
  border: '1px solid #e0e0e0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  zIndex: 1351,
  '&:hover': {
    borderColor: '#1976d2',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }
})

// Danh sách gợi ý
const SuggestionList = styled(List)({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: 0,
  width: '100%',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  borderRadius: 12,
  zIndex: 1350,
  maxHeight: 300,
  overflowY: 'auto',
  padding: '8px 0',
  '&::-webkit-scrollbar': {
    width: '6px'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#e0e0e0',
    borderRadius: '6px'
  }
})

// Item trong danh sách gợi ý
const StyledListItem = styled(ListItem)({
  padding: '12px 16px',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: '#f5f5f5'
  }
})

const MobileDrawer = ({ open, onClose }) => {
  const [searchText, setSearchText] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [openDropdown, setOpenDropdown] = useState(null)
  const [allCategories, setAllCategories] = useState([])
  // Logic lấy gợi ý tìm kiếm
  useEffect(() => {
    if (searchText.trim() === '') {
      setSuggestions([])
      setErrorMessage('')
      return
    }

    const fetchSuggestions = async () => {
      try {
        const { products } = await getProducts(1, 20)
        const filtered = products
          .filter((p) =>
            p.name.toLowerCase().includes(searchText.toLowerCase())
          )
          .slice(0, 5)

        if (filtered.length === 0) {
          setSuggestions([])
          setErrorMessage('Không tìm thấy sản phẩm')
        } else {
          setSuggestions(filtered)
          setErrorMessage('')
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error)
        setSuggestions([])
        setErrorMessage('Không tìm thấy sản phẩm')
      }
    }

    const debounce = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounce)
  }, [searchText])

  // Tự động focus vào input khi drawer mở
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories(1, 100)
        const allCategories = res.categories?.data || res.categories || []

        // Lọc danh mục con có parent và chưa bị xoá
        const childCategoriesWithProduct = allCategories.filter(
          (cat) => cat.parent && !cat.destroy
        )

        const parentIds = [
          ...new Set(
            childCategoriesWithProduct.map((cat) =>
              typeof cat.parent === 'object' ? cat.parent._id : cat.parent
            )
          )
        ]

        const parentCategories = allCategories.filter(
          (cat) => parentIds.includes(cat._id) && !cat.destroy
        )

        const rootCategoriesWithProducts = allCategories.filter(
          (cat) =>
            !cat.parent &&
            !cat.destroy &&
            Array.isArray(cat.products) &&
            cat.products.length > 0
        )

        setCategories([...parentCategories, ...rootCategoriesWithProducts])

        setAllCategories(allCategories) // dùng cho getChildCategories
      } catch {
        setCategories([])
      }
    }

    if (open) fetchCategories()
  }, [open])
  const getChildCategories = (parentCategory) => {
    if (!parentCategory || !parentCategory._id) return []
    return allCategories.filter(
      (cat) =>
        !cat.destroy &&
        cat.parent &&
        (typeof cat.parent === 'object' ? cat.parent._id : cat.parent) ===
          parentCategory._id
    )
  }

  const handleDropdown = (idx) => {
    setOpenDropdown(openDropdown === idx ? null : idx)
  }

  return (
    <Drawer
      variant='temporary'
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Cải thiện hiệu năng mobile
        disableEnforceFocus: true
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: '80%',
          zIndex: 1
        }
      }}
    >
      <Box
        sx={{
          width: '100%',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          mt: 12
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 900, mt: 1 }}>
          <Box>Menu</Box>
        </Typography>

        <List>
          <Divider />
          {/* Sản phẩm */}
          <ListItem
            button
            onClick={() => {
              navigate('/product')
              onClose()
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Sản phẩm
                </Box>
              }
            />
          </ListItem>
          <Divider />
          {/* Hàng mới với badge New */}
          <ListItem
            button
            onClick={() => {
              navigate('/productnews')
              onClose()
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Hàng Mới
                  <span
                    style={{
                      color: 'red',
                      fontWeight: 700,
                      marginLeft: 6,
                      fontSize: 13
                    }}
                  >
                    New
                  </span>
                </Box>
              }
            />
          </ListItem>
          <Divider />
          {/* Danh mục động từ API */}
          {categories.map((cat, idx) => {
            const children = getChildCategories(cat)
            const hasChildren = children.length > 0

            return (
              <React.Fragment key={cat._id}>
                <ListItem
                  button
                  onClick={() => {
                    if (hasChildren) {
                      handleDropdown(idx)
                    } else {
                      navigate(`/productbycategory/${cat._id}`)
                      onClose()
                    }
                  }}
                  sx={{
                    height: 48,
                    color: cat.color || 'inherit',
                    fontWeight: cat.bold ? 700 : 400,
                    ...(cat.name === 'OUTLET' && {
                      color: 'red',
                      fontWeight: 700
                    })
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {cat.name === 'OUTLET' ? (
                          <>
                            {cat.discount && (
                              <span
                                style={{
                                  color: 'red',
                                  fontWeight: 700,
                                  marginRight: 4
                                }}
                              >
                                {cat.discount}
                              </span>
                            )}
                            OUTLET
                          </>
                        ) : (
                          cat.name
                        )}
                        {hasChildren && (
                          <IconButton
                            size='small'
                            sx={{ ml: 1 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDropdown(idx)
                            }}
                          >
                            {openDropdown === idx ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        )}
                      </Box>
                    }
                  />
                </ListItem>

                {hasChildren && (
                  <Collapse
                    in={openDropdown === idx}
                    timeout='auto'
                    unmountOnExit
                  >
                    <List component='div' disablePadding>
                      {children.map((child) => (
                        <React.Fragment key={child._id}>
                          <Divider />
                          <ListItem
                            button
                            sx={{
                              pl: 4,
                              height: 48
                            }}
                            onClick={() => {
                              navigate(`/productbycategory/${child._id}`)
                              onClose()
                            }}
                          >
                            <ListItemText
                              primary={child.name}
                              primaryTypographyProps={{
                                noWrap: true,
                                sx: {
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '100%'
                                }
                              }}
                            />
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  </Collapse>
                )}

                <Divider />
              </React.Fragment>
            )
          })}
          <ListItem
            button
            onClick={() => {
              navigate('/blog')
              onClose()
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Tin tức
                </Box>
              }
            />
          </ListItem>
          <Divider />
        </List>
      </Box>
    </Drawer>
  )
}

export default MobileDrawer
