// import React, { useState, useRef, useEffect } from 'react'
// import {
//   Box,
//   InputBase,
//   IconButton,
//   List,
//   ListItem,
//   Typography
// } from '@mui/material'
// import SearchIcon from '@mui/icons-material/Search'
// import { styled } from '@mui/system'
// import { useNavigate } from 'react-router-dom'
// import { getProducts } from '~/services/productService'
//
// // Hàm loại bỏ dấu tiếng Việt
// const removeVietnameseAccents = (str) => {
//   return str
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '')
//     .toLowerCase()
// }
//
// // Container giữ icon và input
// const SearchWrapper = styled(Box)({
//   position: 'relative',
//   display: 'flex',
//   alignItems: 'center',
//   width: 'fit-content',
//   '@media (max-width: 1000px)': {
//     display: 'none'
//   }
// })
//
// // Input xổ ra ngang hàng với icon
// const AnimatedInput = styled(InputBase)(({ visible }) => ({
//   position: 'absolute',
//   right: '40px',
//   top: '50%',
//   transform: visible
//     ? 'translateY(-50%) scaleX(1)'
//     : 'translateY(-50%) scaleX(0)',
//   transformOrigin: 'right center',
//   transition: 'transform 0.3s ease, opacity 0.3s ease',
//   opacity: visible ? 1 : 0,
//   width: 220,
//   backgroundColor: '#ffffff',
//   padding: '8px 16px',
//   borderRadius: 24,
//   border: '1px solid #e0e0e0',
//   boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
//   pointerEvents: visible ? 'auto' : 'none',
//   zIndex: 2000, // Tăng zIndex để input search nổi trên arrow
//   '&:hover': {
//     borderColor: '#1976d2',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//   }
// }))
//
// const SuggestionList = styled(List)({
//   position: 'absolute',
//   top: 'calc(100% + 8px)',
//   right: '40px',
//   width: 220,
//   backgroundColor: '#ffffff',
//   boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//   borderRadius: 12,
//   zIndex: 9,
//   maxHeight: 300,
//   overflowY: 'auto',
//   padding: '8px 0',
//   '&::-webkit-scrollbar': {
//     width: '6px'
//   },
//   '&::-webkit-scrollbar-thumb': {
//     backgroundColor: '#e0e0e0',
//     borderRadius: '6px'
//   }
// })
//
// const StyledListItem = styled(ListItem)({
//   padding: '12px 16px',
//   transition: 'background-color 0.2s ease',
//   '&:hover': {
//     backgroundColor: '#f5f5f5'
//   }
// })
//
// const Search = () => {
//   const [searchText, setSearchText] = useState('')
//   const [showInput, setShowInput] = useState(false)
//   const [suggestions, setSuggestions] = useState([])
//   const [errorMessage, setErrorMessage] = useState('')
//   const inputRef = useRef(null)
//   const navigate = useNavigate()
//
//   useEffect(() => {
//     if (!showInput) return
//     const fetchSuggestions = async () => {
//       if (searchText.trim() === '') {
//         setSuggestions([])
//         setErrorMessage('')
//         return
//       }
//       try {
//         const { products } = await getProducts(1, 20)
//         const normalizedSearchText = removeVietnameseAccents(searchText.trim())
//
//         const filtered = products
//           .filter((p) => {
//             const normalizedProductName = removeVietnameseAccents(p.name)
//             return normalizedProductName.includes(normalizedSearchText)
//           })
//           .slice(0, 5)
//
//         if (filtered.length === 0) {
//           setSuggestions([])
//           setErrorMessage('Không tìm thấy sản phẩm')
//         } else {
//           setSuggestions(filtered)
//           setErrorMessage('')
//         }
//       } catch (error) {
//         console.error('Lỗi khi tìm kiếm sản phẩm:', error)
//         setSuggestions([])
//         setErrorMessage('Không tìm thấy sản phẩm')
//       }
//     }
//
//     const debounce = setTimeout(fetchSuggestions, 300)
//     return () => clearTimeout(debounce)
//   }, [searchText, showInput])
//
//   useEffect(() => {
//     if (showInput) {
//       setTimeout(() => {
//         inputRef.current?.focus()
//       }, 100)
//     }
//   }, [showInput])
//
//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (searchText.trim()) {
//       navigate(`/searchresult?search=${encodeURIComponent(searchText.trim())}`)
//       setShowInput(false)
//       setSuggestions([])
//       setErrorMessage('')
//     }
//   }
//
//   const handleSuggestionClick = (productId) => {
//     setSearchText('')
//     navigate(`/productdetail/${productId}`)
//     setShowInput(false)
//     setSuggestions([])
//   }
//
//   return (
//     <SearchWrapper component='form' onSubmit={handleSubmit}>
//       <IconButton
//         onClick={() => setShowInput((prev) => !prev)}
//         sx={{ color: 'black' }}
//       >
//         <SearchIcon />
//       </IconButton>
//
//       <AnimatedInput
//         inputRef={inputRef}
//         visible={showInput ? 1 : 0}
//         placeholder='Tìm kiếm sản phẩm...'
//         value={searchText}
//         onChange={(e) => setSearchText(e.target.value)}
//       />
//
//       {showInput && (suggestions.length > 0 || errorMessage) && (
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 'calc(100% + 16px)',
//             right: 0,
//             width: 320,
//             background: '#fff',
//             border: '1.5px solid #1976d2',
//             borderRadius: 3,
//             boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)',
//             zIndex: 99,
//             p: 0,
//             mt: 1,
//             minHeight: 60,
//             maxHeight: 400,
//             overflowY: 'auto',
//             display: 'flex',
//             flexDirection: 'column'
//           }}
//         >
//           <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #e3e3e3', background: '#f5faff' }}>
//             <Typography variant="subtitle2" color="primary" fontWeight={700}>
//               Gợi ý sản phẩm
//             </Typography>
//           </Box>
//           {errorMessage ? (
//             <Typography
//               variant='body2'
//               color='error'
//               textAlign='center'
//               sx={{ py: 2, px: 2 }}
//             >
//               {errorMessage}
//             </Typography>
//           ) : (
//             suggestions.map((product, index) => (
//               <StyledListItem
//                 key={product._id}
//                 onClick={() => handleSuggestionClick(product._id)}
//                 sx={{
//                   animation: `fadeIn 0.3s ease ${index * 0.05}s`,
//                   '@keyframes fadeIn': {
//                     from: { opacity: 0, transform: 'translateY(5px)' },
//                     to: { opacity: 1, transform: 'translateY(0)' }
//                   }
//                 }}
//               >
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                   <img
//                     src={product.image?.[0] || '/fallback.jpg'}
//                     alt={product.name}
//                     onError={(e) => {
//                       e.target.onerror = null
//                       e.target.src = '/fallback.jpg'
//                     }}
//                     style={{
//                       width: 48,
//                       height: 48,
//                       objectFit: 'cover',
//                       borderRadius: 8,
//                       flexShrink: 0
//                     }}
//                   />
//                   <Box sx={{ flex: 1, overflow: 'hidden' }}>
//                     <Typography
//                       variant='subtitle2'
//                       fontWeight={600}
//                       noWrap
//                       sx={{ maxWidth: '200px' }}
//                     >
//                       {product.name}
//                     </Typography>
//                     <Typography
//                       variant='body2'
//                       color='primary'
//                       fontWeight={500}
//                     >
//                       {(product.exportPrice ?? 0).toLocaleString()} VND
//                     </Typography>
//                   </Box>
//                 </Box>
//               </StyledListItem>
//             ))
//           )}
//         </Box>
//       )}
//     </SearchWrapper>
//   )
// }
//
// export default Search

import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  InputBase,
  IconButton,
  Typography,
  InputAdornment,
  ListItem
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/system'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProducts } from '~/services/productService'

const removeVietnameseAccents = (str) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const SearchWrapper = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  minWidth: 0
})

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: '100%',
  backgroundColor: '#ffffff',
  padding: '8px 16px',
  borderRadius: 24,
  border: '1px solid #e0e0e0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  fontSize: '0.9rem',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }
}))

const StyledListItem = styled(ListItem)({
  padding: '12px 16px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: '#f5f5f5'
  }
})

const Search = ({ onclose, mobileOpen }) => {
  const wrapperRef = useRef(null)
  const location = useLocation()
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [placeholder, setPlaceholder] = useState('Sản phẩm')
  const [searchText, setSearchText] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname !== '/searchresult') {
      setSearchText('')
      setSuggestions([])
      setShowSuggestions(false)
      setErrorMessage('')
      document.body.style.overflow = ''
    }
  }, [location.pathname])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 800) {
        setPlaceholder('Tìm kiếm...')
      } else {
        setPlaceholder('Tìm kiếm sản phẩm...')
      }
    }

    // chạy lần đầu
    handleResize()

    // lắng nghe thay đổi kích thước
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  useEffect(() => {
    if (!searchText.trim()) {
      setSuggestions([])
      setErrorMessage('')
      return
    }

    const fetchSuggestions = async () => {
      try {
        const { products } = await getProducts(1, 20)
        const normalized = removeVietnameseAccents(searchText.trim())
        const filtered = products.filter((p) =>
          removeVietnameseAccents(p.name).includes(normalized)
        )
        setSuggestions(filtered)
        setErrorMessage(filtered.length ? '' : 'Không tìm thấy sản phẩm')
      } catch {
        setErrorMessage('Không tìm thấy sản phẩm')
        setSuggestions([])
      }
    }

    const debounce = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounce)
  }, [searchText])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showSuggestions && // Chỉ xử lý khi đang mở
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setShowSuggestions(false)
      }
    }

    const handleScroll = (e) => {
      // Nếu phần cuộn không nằm trong wrapper (tức là cuộn bên ngoài)
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = searchText.trim()
    if (trimmed) {
      const nextUrl = `/searchresult?search=${encodeURIComponent(trimmed)}`
      const currentUrl = location.pathname + location.search
      if (nextUrl !== currentUrl) {
        navigate(nextUrl)
        setSuggestions([])
        setErrorMessage('')
        if (mobileOpen) onclose?.()
      }
    }
    document.body.style.overflow = 'auto'
  }

  const handleSuggestionClick = (id) => {
    const nextUrl = `/productdetail/${id}`
    const currentUrl = location.pathname + location.search

    if (nextUrl !== currentUrl) {
      setSearchText('')
      navigate(nextUrl)
      setSuggestions([])
      setShowSuggestions(false)
      if (mobileOpen) onclose?.()
    }
  }

  return (
    <SearchWrapper ref={wrapperRef} component='form' onSubmit={handleSubmit}>
      <StyledInputBase
        sx={{
          width: '320px',
          maxWidth: '100%',
          '@media (max-width:1222px)': {
            width: '220px',
            minWidth: '220px'
          },
          '@media (max-width:600px)': {
            width: '320px',
            minWidth: '320px'
          },
          '@media (max-width:500px)': {
            width: '220px',
            minWidth: '220px'
          },
          '@media (max-width:400px)': {
            width: '100%',
            minWidth: 0
          }
        }}
        placeholder={placeholder}
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value)
          setShowSuggestions(e.target.value.trim() !== '')
          if (e.target.value.trim()) {
            setShowSuggestions(true)
          } else {
            setShowSuggestions(false)
          }
        }}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton type='submit' sx={{ p: 0.5 }}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />

      {showSuggestions && (suggestions.length > 0 || errorMessage) && (
        <Box
          sx={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '100%',
            '@media (max-width:1222px)': {
              width: '400px'
            },
            '@media (max-width:600px)': {
              position: 'fixed',
              top: '100px', // cách top tuỳ theo vị trí bạn muốn
              width: 'calc(100vw - 32px)',
              left: '50%',
              transform: 'translateX(-50%)',
              right: 'auto',
              zIndex: 1300, // cao hơn các header nếu cần
              maxHeight: 520
            },
            background: '#fff',
            border: '1.5px solid #1976d2',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)',
            zIndex: 99,
            p: 0,
            minHeight: 60,
            maxHeight: 420,
            overflowY: 'auto',
            display: 'block',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1,
              borderBottom: '1px solid #e3e3e3',
              background: '#f5faff',
              flex: 1,
              width: '100%'
            }}
          >
            <Typography variant='subtitle2' color='primary' fontWeight={700}>
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
            suggestions.map((p, i) => (
              <StyledListItem
                key={p._id}
                onClick={() => handleSuggestionClick(p._id)}
                sx={{
                  borderTop: '1px solid #ccc',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                  display: 'block',
                  animation: `fadeIn 0.3s ease ${i * 0.05}s`,
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(5px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
                title={p.name}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <img
                    src={p.image?.[0] || '/fallback.jpg'}
                    alt={p.name}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/fallback.jpg'
                    }}
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                  />
                  <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <Typography variant='subtitle2' fontWeight={600} noWrap>
                      {p.name}
                    </Typography>
                    <Box display='flex' alignItems='center' gap={1}>
                      {/* Giá đã giảm */}
                      <Typography
                        variant='body2'
                        color='error'
                        fontWeight={600}
                      >
                        {(
                          p.exportPrice - (p.firstVariantDiscountPrice ?? 0)
                        ).toLocaleString()}
                        ₫
                      </Typography>

                      {/* Giá gốc (gạch nếu có giảm) */}
                      {p.firstVariantDiscountPrice > 0 && (
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ textDecoration: 'line-through' }}
                        >
                          {p.exportPrice.toLocaleString()}₫
                        </Typography>
                      )}
                    </Box>
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
