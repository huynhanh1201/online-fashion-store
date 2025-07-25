import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  InputBase,
  IconButton,
  List,
  ListItem,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '~/services/productService'

// Hàm loại bỏ dấu tiếng Việt
const removeVietnameseAccents = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

// Container giữ icon và input
const SearchWrapper = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: 'fit-content',
  '@media (max-width: 1000px)': {
    display: 'none'
  }
})

// Input xổ ra ngang hàng với icon
const AnimatedInput = styled(InputBase)(({ visible }) => ({
  position: 'absolute',
  right: '40px',
  top: '50%',
  transform: visible
    ? 'translateY(-50%) scaleX(1)'
    : 'translateY(-50%) scaleX(0)',
  transformOrigin: 'right center',
  transition: 'transform 0.3s ease, opacity 0.3s ease',
  opacity: visible ? 1 : 0,
  width: 220,
  backgroundColor: '#ffffff',
  padding: '8px 16px',
  borderRadius: 24,
  border: '1px solid #e0e0e0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  pointerEvents: visible ? 'auto' : 'none',
  zIndex: 2000, // Tăng zIndex để input search nổi trên arrow
  '&:hover': {
    borderColor: '#1976d2',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }
}))

const SuggestionList = styled(List)({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  right: '40px',
  width: 220,
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  borderRadius: 12,
  zIndex: 9,
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

const StyledListItem = styled(ListItem)({
  padding: '12px 16px',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: '#f5f5f5'
  }
})

const Search = () => {
  const [searchText, setSearchText] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!showInput) return
    const fetchSuggestions = async () => {
      if (searchText.trim() === '') {
        setSuggestions([])
        setErrorMessage('')
        return
      }
      try {
        const { products } = await getProducts(1, 20)
        const normalizedSearchText = removeVietnameseAccents(searchText.trim())
        
        const filtered = products
          .filter((p) => {
            const normalizedProductName = removeVietnameseAccents(p.name)
            return normalizedProductName.includes(normalizedSearchText)
          })
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
  }, [searchText, showInput])

  useEffect(() => {
    if (showInput) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [showInput])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchText.trim()) {
      navigate(`/searchresult?search=${encodeURIComponent(searchText.trim())}`)
      setShowInput(false)
      setSuggestions([])
      setErrorMessage('')
    }
  }

  const handleSuggestionClick = (productId) => {
    setSearchText('')
    navigate(`/productdetail/${productId}`)
    setShowInput(false)
    setSuggestions([])
  }

  return (
    <SearchWrapper component='form' onSubmit={handleSubmit}>
      <IconButton
        onClick={() => setShowInput((prev) => !prev)}
        sx={{ color: 'black' }}
      >
        <SearchIcon />
      </IconButton>

      <AnimatedInput
        inputRef={inputRef}
        visible={showInput ? 1 : 0}
        placeholder='Tìm kiếm sản phẩm...'
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {showInput && (suggestions.length > 0 || errorMessage) && (
        <Box
          sx={{
            position: 'absolute',
            top: 'calc(100% + 16px)',
            right: 0,
            width: 320,
            background: '#fff',
            border: '1.5px solid #1976d2',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)',
            zIndex: 99,
            p: 0,
            mt: 1,
            minHeight: 60,
            maxHeight: 400,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #e3e3e3', background: '#f5faff' }}>
            <Typography variant="subtitle2" color="primary" fontWeight={700}>
              Gợi ý sản phẩm
            </Typography>
          </Box>
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
        </Box>
      )}
    </SearchWrapper>
  )
}

export default Search
