import React, { useState, useEffect } from 'react'
import {
  InputBase,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Drawer,
  Grid
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '~/services/productService'

// Styled components
const StyledInput = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
  fontSize: '15px'
}))

const SuggestionList = styled(List)(({ theme }) => ({
  backgroundColor: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  borderRadius: 8,
  maxHeight: 200,
  overflowY: 'auto',
  marginTop: theme.spacing(1),
  pr: 1
}))

const Search = () => {
  const [searchText, setSearchText] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [openDrawer, setOpenDrawer] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
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
  }, [searchText])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchText.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchText.trim())}`)
      setOpenDrawer(false)
    }
  }

  const handleSuggestionClick = (productName) => {
    setSearchText(productName)
    navigate(`/products?search=${encodeURIComponent(productName)}`)
    setOpenDrawer(false)
  }

  return (
    <>
      <IconButton onClick={() => setOpenDrawer(true)} sx={{ color: 'black' }}>
        <SearchIcon />
      </IconButton>

      <Drawer
        anchor='top'
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        transitionDuration={{ enter: 450, exit: 400 }} // Match ProductDetail's timing
        PaperProps={{
          sx: {
            width: '100%', // Full width
            height: '300px', // Fixed height
            pt: 2,
            px: 2,
            pb: 4,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // Match ProductDetail's shadow
            zIndex: 1400 // Ensure above header/topbar
          }
        }}
        sx={{
          zIndex: 1400 // Apply to Drawer root to ensure overlay and content are above header/topbar
        }}
      >
        <Grid>
          <Typography variant='h6' gutterBottom>
            Tìm kiếm sản phẩm
          </Typography>

          <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#f1f3f5',
              borderRadius: 2,
              p: '0 8px',
              height: 40
            }}
          >
            <StyledInput
              placeholder='Tìm kiếm sản phẩm...'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              autoFocus
            />
            <IconButton type='submit' size='small'>
              <SearchIcon />
            </IconButton>
            <IconButton onClick={() => setOpenDrawer(false)} size='small'>
              <CloseIcon />
            </IconButton>
          </Box>

          {errorMessage && (
            <Typography
              variant='body2'
              color='error'
              sx={{ textAlign: 'center', mt: 1 }}
            >
              {errorMessage}
            </Typography>
          )}

          <Box
            sx={{
              flexGrow: 1, // Match ProductDetail's scrollable content
              overflowY: 'auto',
              mt: 1
            }}
          >
            {suggestions.length > 0 && (
              <SuggestionList>
                {suggestions.map((product) => (
                  <ListItem
                    button
                    key={product._id}
                    onClick={() => handleSuggestionClick(product.name)}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%'
                      }}
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
                ))}
              </SuggestionList>
            )}
          </Box>
        </Grid>
      </Drawer>
    </>
  )
}

export default Search
