import { useState, useEffect } from 'react'
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
  onSelect = () => {}
}) {
  const [searchText, setSearchText] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const normalizeVietnamese = (str = '') => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
  }

  useEffect(() => {
    if (searchText.trim() === '') {
      setSuggestions([])
      return
    }

    const inputNormalized = normalizeVietnamese(searchText)

    const filtered = data.filter((cat) => {
      const name = normalizeVietnamese(cat?.name || '')
      return name.includes(inputNormalized)
    })

    setSuggestions(filtered.slice(0, 10))
  }, [searchText])

  const handleSelect = (name) => {
    setSearchText(name)
    setSuggestions([])
    onSelect(name)
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
      <TextField
        fullWidth
        label={label}
        variant='outlined'
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        autoComplete='off'
      />

      {suggestions.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            width: '100%',
            zIndex: 10,
            mt: 1,
            maxHeight: 250,
            overflowY: 'auto'
          }}
        >
          <List>
            {suggestions.map((value) => (
              <ListItem disablePadding key={value._id}>
                <ListItemButton onClick={() => handleSelect(value.name)}>
                  <ListItemText primary={value.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  )
}
