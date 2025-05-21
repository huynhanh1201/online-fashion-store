import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  InputBase,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '~/services/productService'

// Container giữ icon và input
const SearchWrapper = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
})

// Input xổ ra ngang hàng với icon
const AnimatedInput = styled(InputBase)(({ visible }) => ({
  position: 'absolute',
  right: '40px', // nằm bên trái icon
  top: '50%',
  transform: visible
    ? 'translateY(-50%) scaleX(1)'
    : 'translateY(-50%) scaleX(0)',
  transformOrigin: 'right center', // scale từ phải sang trái
  transition: 'transform 0.3s ease, opacity 0.3s ease',
  opacity: visible ? 1 : 0,
  width: 240,
  backgroundColor: '#f1f3f5',
  padding: '6px 12px',
  borderRadius: 20,
  pointerEvents: visible ? 'auto' : 'none',
  zIndex: 10
}))

const SuggestionList = styled(List)({
  position: 'absolute',
  top: '100%',
  left: 0,
  width: 300,
  backgroundColor: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  borderRadius: 8,
  zIndex: 9,
  maxHeight: 200,
  overflowY: 'auto',
  marginTop: 4
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
        const filtered = products
          .filter((p) =>
            p.name.toLowerCase().includes(searchText.toLowerCase())
          )
          .slice(0, 5)

        if (filtered.length === 0) {
          setSuggestions([])
          setErrorMessage('Không có sản phẩm này')
        } else {
          setSuggestions(filtered)
          setErrorMessage('')
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error)
        setSuggestions([])
        setErrorMessage('Không có sản phẩm này')
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
      navigate(`/products?search=${encodeURIComponent(searchText.trim())}`)
      setShowInput(false)
      setSuggestions([])
      setErrorMessage('')
    }
  }

  const handleSuggestionClick = (productName) => {
    setSearchText(productName)
    navigate(`/products?search=${encodeURIComponent(productName)}`)
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
        <SuggestionList>
          {errorMessage ? (
            <Typography
              variant='body2'
              color='error'
              textAlign='center'
              sx={{ py: 1 }}
            >
              {errorMessage}
            </Typography>
          ) : (
            suggestions.map((product) => (
              <ListItem
                button
                key={product._id}
                onClick={() => handleSuggestionClick(product.name)}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: 'cover',
                      marginRight: 8
                    }}
                  />
                  <ListItemText primary={product.name} />
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    sx={{ marginLeft: 'auto' }}
                  >
                    {product.price} VND
                  </Typography>
                </Box>
              </ListItem>
            ))
          )}
        </SuggestionList>
      )}
    </SearchWrapper>
  )
}

export default Search
