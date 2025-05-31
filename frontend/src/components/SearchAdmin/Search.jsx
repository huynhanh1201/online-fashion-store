// import { useState, useEffect } from 'react'
// import {
//   TextField,
//   Paper,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Box
// } from '@mui/material'
//
// export default function Search({
//   data = [],
//   label = 'Tìm danh mục',
//   onSelect = () => {}
// }) {
//   const [searchText, setSearchText] = useState('')
//   const [suggestions, setSuggestions] = useState([])
//
//   const normalizeVietnamese = (str = '') => {
//     return str
//       .normalize('NFD')
//       .replace(/[\u0300-\u036f]/g, '')
//       .replace(/đ/g, 'd')
//       .replace(/Đ/g, 'D')
//       .toLowerCase()
//   }
//
//   useEffect(() => {
//     if (searchText.trim() === '') {
//       setSuggestions([])
//       return
//     }
//
//     const inputNormalized = normalizeVietnamese(searchText)
//
//     const filtered = data.filter((cat) => {
//       const name = normalizeVietnamese(cat?.name || '')
//       return name.includes(inputNormalized)
//     })
//
//     setSuggestions(filtered.slice(0, 10))
//   }, [searchText])
//
//   const handleSelect = (name) => {
//     setSearchText(name)
//     setSuggestions([])
//     onSelect(name)
//   }
//
//   return (
//     <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
//       <TextField
//         fullWidth
//         label={label}
//         variant='outlined'
//         value={searchText}
//         onChange={(e) => setSearchText(e.target.value)}
//         autoComplete='off'
//       />
//
//       {suggestions.length > 0 && (
//         <Paper
//           sx={{
//             position: 'absolute',
//             width: '100%',
//             zIndex: 10,
//             mt: 1,
//             maxHeight: 250,
//             overflowY: 'auto'
//           }}
//         >
//           <List>
//             {suggestions.map((value) => (
//               <ListItem disablePadding key={value._id}>
//                 <ListItemButton onClick={() => handleSelect(value.name)}>
//                   <ListItemText primary={value.name} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//         </Paper>
//       )}
//     </Box>
//   )
// }

// import { useState, useEffect } from 'react'
// import {
//   TextField,
//   Paper,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Box
// } from '@mui/material'
//
// export default function Search({
//   data = [], // Can be an array or a function that returns an array
//   label = 'Tìm danh mục',
//   onSelect = () => {},
//   searchText: initialSearchText = '',
//   setSearchText = () => {},
//   placeholder = 'Tìm kiếm...'
// }) {
//   const [searchText, setSearchTextInternal] = useState(initialSearchText)
//   const [suggestions, setSuggestions] = useState([])
//   const [lastSelectedText, setLastSelectedText] = useState('') // Track the last selected value
//
//   const normalizeVietnamese = (str = '') => {
//     return str
//       .normalize('NFD')
//       .replace(/[\u0300-\u036f]/g, '')
//       .replace(/đ/g, 'd')
//       .replace(/Đ/g, 'D')
//       .toLowerCase()
//   }
//
//   useEffect(() => {
//     // Only generate suggestions if searchText differs from the last selected value
//     if (searchText.trim() === '' || searchText === lastSelectedText) {
//       setSuggestions([])
//       return
//     }
//
//     const inputNormalized = normalizeVietnamese(searchText)
//     let filteredData
//
//     if (typeof data === 'function') {
//       filteredData = data(inputNormalized) // Call the function with search text
//     } else {
//       filteredData = data.filter((item) => {
//         const name = normalizeVietnamese(item?.name || item || '')
//         return name.includes(inputNormalized)
//       })
//     }
//
//     setSuggestions(filteredData.slice(0, 10))
//   }, [searchText, data, lastSelectedText])
//
//   const handleSelect = (value) => {
//     // Set the input to show the SKU (for variants) or name (for lots)
//     const displayText = value.sku || value.name || value
//     setSearchTextInternal(displayText)
//     setSearchText(displayText) // Update parent state with SKU or name
//     setLastSelectedText(displayText) // Update the last selected value
//     setSuggestions([]) // Clear suggestions immediately
//     onSelect(value._id || value.name || value) // Pass _id for variantId to parent
//   }
//
//   const handleChange = (e) => {
//     setSearchTextInternal(e.target.value)
//     // Do not update lastSelectedText here to allow new suggestions
//   }
//
//   return (
//     <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
//       <TextField
//         fullWidth
//         label={label}
//         variant='outlined'
//         value={searchText}
//         onChange={handleChange}
//         autoComplete='off'
//         placeholder={placeholder}
//       />
//
//       {suggestions.length > 0 && (
//         <Paper
//           sx={{
//             position: 'fixed',
//             width: '168px',
//             zIndex: 1000, // Ensure it appears above other elements
//             mt: 1,
//             maxHeight: 250,
//             overflowY: 'auto'
//           }}
//         >
//           <List sx={{ padding: 0 }}>
//             {suggestions.map((value) => {
//               const key =
//                 value._id ||
//                 `${value.name}-${Math.random().toString(36).substr(2, 9)}`
//               return (
//                 <ListItem
//                   disablePadding
//                   key={key}
//                   sx={{ borderBottom: '1px solid #ccc' }}
//                 >
//                   <ListItemButton onClick={() => handleSelect(value)}>
//                     <ListItemText primary={value.name || value} />
//                   </ListItemButton>
//                 </ListItem>
//               )
//             })}
//           </List>
//         </Paper>
//       )}
//     </Box>
//   )
// }

// import { useState, useEffect, useRef } from 'react'
// import {
//   TextField,
//   Paper,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Box
// } from '@mui/material'
//
// export default function Search({
//   data = [],
//   label = 'Tìm danh mục',
//   onSelect = () => {},
//   searchText: initialSearchText = '',
//   setSearchText = () => {},
//   placeholder = 'Tìm kiếm...'
// }) {
//   const [searchText, setSearchTextInternal] = useState(initialSearchText)
//   const [suggestions, setSuggestions] = useState([])
//   const [lastSelectedText, setLastSelectedText] = useState('')
//   const [dropdownPosition, setDropdownPosition] = useState({
//     top: true,
//     bottom: false
//   })
//   const inputRef = useRef(null)
//
//   const normalizeVietnamese = (str = '') => {
//     return str
//       .normalize('NFD')
//       .replace(/[\u0300-\u036f]/g, '')
//       .replace(/đ/g, 'd')
//       .replace(/Đ/g, 'D')
//       .toLowerCase()
//   }
//
//   useEffect(() => {
//     if (searchText.trim() === '' || searchText === lastSelectedText) {
//       setSuggestions([])
//       return
//     }
//
//     const inputNormalized = normalizeVietnamese(searchText)
//     let filteredData
//
//     if (typeof data === 'function') {
//       filteredData = data(inputNormalized)
//     } else {
//       filteredData = data.filter((item) => {
//         const name = normalizeVietnamese(item?.name || item || '')
//         return name.includes(inputNormalized)
//       })
//     }
//
//     setSuggestions(filteredData.slice(0, 10))
//   }, [searchText, data, lastSelectedText])
//
//   useEffect(() => {
//     if (suggestions.length > 0 && inputRef.current) {
//       const rect = inputRef.current.getBoundingClientRect()
//       const windowHeight = window.innerHeight
//       const dropdownHeight = 150 // maxHeight of the dropdown
//
//       const spaceBelow = windowHeight - rect.bottom
//       const spaceAbove = rect.top
//
//       if (spaceBelow >= dropdownHeight || spaceBelow > spaceAbove) {
//         setDropdownPosition({ top: false, bottom: true })
//       } else {
//         setDropdownPosition({ top: true, bottom: false })
//       }
//     }
//   }, [suggestions])
//
//   const handleSelect = (value) => {
//     const displayText = value.sku || value.name || value
//     setSearchTextInternal(displayText)
//     setSearchText(displayText)
//     setLastSelectedText(displayText)
//     setSuggestions([])
//     onSelect(value._id || value.name || value)
//   }
//
//   const handleChange = (e) => {
//     setSearchTextInternal(e.target.value)
//   }
//
//   return (
//     <Box sx={{ position: 'relative', width: '100%' }}>
//       <TextField
//         inputRef={inputRef}
//         fullWidth
//         variant='outlined'
//         value={searchText}
//         onChange={handleChange}
//         autoComplete='off'
//         placeholder={placeholder}
//         size='small'
//       />
//
//       {suggestions.length > 0 && (
//         <Paper
//           sx={{
//             position: 'absolute',
//             width: '100%',
//             zIndex: 1000,
//             maxHeight: 150,
//             overflowY: 'auto',
//             boxShadow: 3,
//             ...(dropdownPosition.top && { bottom: '100%', mb: 1 }),
//             ...(dropdownPosition.bottom && { top: '100%', mt: 1 })
//           }}
//         >
//           <List sx={{ padding: 0 }}>
//             {suggestions.map((value) => {
//               const key =
//                 value._id ||
//                 `${value.name}-${Math.random().toString(36).substr(2, 9)}`
//               return (
//                 <ListItem
//                   disablePadding
//                   key={key}
//                   sx={{ borderBottom: '1px solid #ccc' }}
//                 >
//                   <ListItemButton onClick={() => handleSelect(value)}>
//                     <ListItemText primary={value.name || value} />
//                   </ListItemButton>
//                 </ListItem>
//               )
//             })}
//           </List>
//         </Paper>
//       )}
//     </Box>
//   )
// }

import { useState, useEffect, useRef } from 'react'
import {
  TextField,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box
} from '@mui/material'

export default function Search({
  data = [],
  label = 'Tìm danh mục',
  onSelect = () => {},
  searchText: initialSearchText = '',
  setSearchText = () => {},
  placeholder = 'Tìm kiếm...',
  index = 0 // New prop to track the row index
}) {
  const [searchText, setSearchTextInternal] = useState(initialSearchText)
  const [suggestions, setSuggestions] = useState([])
  const [lastSelectedText, setLastSelectedText] = useState('')
  const [dropdownPosition, setDropdownPosition] = useState({
    top: false,
    bottom: true
  }) // Default to below
  const inputRef = useRef(null)

  const normalizeVietnamese = (str = '') => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
  }

  useEffect(() => {
    if (searchText.trim() === '' || searchText === lastSelectedText) {
      setSuggestions([])
      return
    }

    const inputNormalized = normalizeVietnamese(searchText)
    let filteredData

    if (typeof data === 'function') {
      filteredData = data(inputNormalized)
    } else {
      filteredData = data.filter((item) => {
        const name = normalizeVietnamese(item?.name || item || '')
        return name.includes(inputNormalized)
      })
    }

    setSuggestions(filteredData.slice(0, 10))
  }, [searchText, data, lastSelectedText])

  useEffect(() => {
    if (suggestions.length > 0 && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const dropdownHeight = 150 // maxHeight of the dropdown

      const spaceBelow = windowHeight - rect.bottom
      const spaceAbove = rect.top

      // Force dropdown to appear above for rows 4 and beyond (index >= 3)
      if (index >= 3) {
        setDropdownPosition({ top: true, bottom: false })
      } else {
        // For rows 0-2, prefer below but switch to above if spaceAbove is insufficient
        if (spaceBelow >= dropdownHeight) {
          setDropdownPosition({ top: false, bottom: true })
        } else if (spaceAbove >= dropdownHeight) {
          setDropdownPosition({ top: true, bottom: false })
        } else {
          // If neither has enough space, prefer the direction with more space
          setDropdownPosition({
            top: spaceAbove > spaceBelow,
            bottom: spaceBelow >= spaceAbove
          })
        }
      }
    }
  }, [suggestions, index])

  const handleSelect = (value) => {
    console.log('value selected:', value)
    const displayText = value.sku || value.name || value
    setSearchTextInternal(displayText)
    setSearchText(displayText)
    setLastSelectedText(displayText)
    setSuggestions([])
    onSelect(value._id || value.name || value)
  }

  const handleChange = (e) => {
    setSearchTextInternal(e.target.value)
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        inputRef={inputRef}
        fullWidth
        variant='outlined'
        value={searchText}
        onChange={handleChange}
        autoComplete='off'
        placeholder={placeholder}
        size='small'
        sx={{
          '& .MuiInputBase-root': {
            padding: 0,
            border: 'none',
            backgroundColor: 'transparent'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '& .MuiInputLabel-root': {
            display: 'none' // Hide the label
          },
          '& .MuiInputBase-input': {
            padding: '4px 8px', // Minimal padding for input area
            border: '1px solid #ccc', // Optional: Add a subtle border if needed
            borderRadius: '4px'
          }
        }}
      />

      {suggestions.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            width: '100%',
            zIndex: 1000,
            maxHeight: 150,
            overflowY: 'auto',
            boxShadow: 3,
            ...(dropdownPosition.top && { bottom: '100%', mb: 1 }),
            ...(dropdownPosition.bottom && { top: '100%', mt: 1 })
          }}
        >
          <List sx={{ padding: 0 }}>
            {suggestions.map((value) => {
              const key =
                value._id ||
                `${value.name}-${Math.random().toString(36).substr(2, 9)}`
              return (
                <ListItem
                  disablePadding
                  key={key}
                  sx={{ borderBottom: '1px solid #ccc' }}
                >
                  <ListItemButton onClick={() => handleSelect(value)}>
                    <ListItemText primary={value.name || value} />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </Paper>
      )}
    </Box>
  )
}
