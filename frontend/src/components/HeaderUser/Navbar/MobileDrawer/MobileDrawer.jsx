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

  // Xử lý gửi tìm kiếm
  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchText.trim()) {
      navigate(`/searchresult?search=${encodeURIComponent(searchText.trim())}`)
      setSearchText('')
      setSuggestions([])
      setErrorMessage('')
      onClose() // Đóng drawer
    }
  }

  // Xử lý chọn gợi ý
  const handleSuggestionClick = (productId) => {
    setSearchText('')
    navigate(`/productdetail/${productId}`)
    setSuggestions([])
    setErrorMessage('')
    onClose() // Đóng drawer
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories(1, 100)
        setCategories(res.categories?.data || res.categories || [])
      } catch (e) {
        setCategories([])
      }
    }
    if (open) fetchCategories()
  }, [open])

  const handleDropdown = (idx) => {
    setOpenDropdown(openDropdown === idx ? null : idx)
  }

  return (
    <Drawer
      variant='temporary'
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true // Cải thiện hiệu năng mobile
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 280,
          zIndex: 1300
        }
      }}
    >
      <Box
        sx={{
          width: 280,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 10
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 900 }}>
          <Box>Menu</Box>
        </Typography>

        <SearchWrapper component='form' onSubmit={handleSubmit}>
          <SearchInput
            inputRef={inputRef}
            placeholder='Tìm kiếm sản phẩm...'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {(suggestions.length > 0 || errorMessage) && (
            <SuggestionList>
              {errorMessage ? (
                <Typography
                  variant='body2'
                  color='error'
                  textAlign='center'
                  sx={{ py: 2, px: 2 }}
                >
                  {errorMessage}
                </Typography>
              ) : (
                suggestions.map((product, index) => (
                  <StyledListItem
                    key={product._id}
                    onClick={() => handleSuggestionClick(product._id)}
                    sx={{
                      animation: `fadeIn 0.3s ease ${index * 0.05}s`,
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(5px)' },
                        to: { opacity: 1, transform: 'translateY(0)' }
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <img
                        src={product.image?.[0] || '/fallback.jpg'}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/fallback.jpg'
                        }}
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: 'cover',
                          borderRadius: 8,
                          flexShrink: 0
                        }}
                      />
                      <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        <Typography
                          variant='subtitle2'
                          fontWeight={600}
                          noWrap
                          sx={{ maxWidth: '200px' }}
                        >
                          {product.name}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='primary'
                          fontWeight={500}
                        >
                          {(product.exportPrice ?? 0).toLocaleString()} VND
                        </Typography>
                      </Box>
                    </Box>
                  </StyledListItem>
                ))
              )}
            </SuggestionList>
          )}
        </SearchWrapper>

        <Divider />

        <List>
          {/* Sản phẩm */}
          <ListItem button onClick={() => { navigate('/product'); onClose() }}>
            <ListItemText primary="Sản phẩm" />
          </ListItem>
          {/* Hàng mới với badge New */}
          <ListItem button onClick={() => { navigate('/productnews'); onClose() }}>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Hàng Mới
                  <span style={{ color: 'red', fontWeight: 700, marginLeft: 6, fontSize: 13 }}>New</span>
                </Box>
              }
            />
          </ListItem>
          {/* Danh mục động từ API */}
          {categories.map((cat, idx) => (
            <React.Fragment key={cat._id}>
              <ListItem
                button
                onClick={() => {
                  if (cat.children && cat.children.length > 0) {
                    handleDropdown(idx)
                  } else {
                    navigate(`/productbycategory/${cat._id}`)
                    onClose()
                  }
                }}
                sx={{
                  color: cat.color || 'inherit',
                  fontWeight: cat.bold ? 700 : 400,
                  ...(cat.name === 'OUTLET' && { color: 'red', fontWeight: 700 }),
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {/* Nếu là OUTLET, in đậm đỏ và có giảm giá nếu có */}
                      {cat.name === 'OUTLET' ? (
                        <>
                          {cat.discount && (
                            <span style={{ color: 'red', fontWeight: 700, marginRight: 4 }}>{cat.discount}</span>
                          )}
                          OUTLET
                        </>
                      ) : (
                        cat.name
                      )}
                      {/* Nếu có children, hiển thị dấu > */}
                      {cat.children && cat.children.length > 0 && (
                        <IconButton size="small" sx={{ ml: 1 }} onClick={e => { e.stopPropagation(); handleDropdown(idx) }}>
                          {openDropdown === idx ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {/* Submenu nếu có */}
              {cat.children && cat.children.length > 0 && (
                <Collapse in={openDropdown === idx} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {cat.children.map((child) => (
                      <ListItem
                        button
                        key={child._id}
                        sx={{ pl: 4 }}
                        onClick={() => {
                          navigate(`/productbycategory/${child._id}`)
                          onClose()
                        }}
                      >
                        <ListItemText primary={child.name} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default MobileDrawer
