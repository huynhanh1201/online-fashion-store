import React from 'react'
import {
  TextField,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import Autocomplete from '@mui/material/Autocomplete'

export default function SearchWithSuggestions({
  label = 'Tìm kiếm tên',
  options = [],
  loading = false,
  keyword,
  inputValue,
  setKeyword,
  setInputValue,
  onSearch
}) {
  const hasValue = Boolean(inputValue)

  return (
    <Autocomplete
      sx={{
        minWidth: 220,
        '& .MuiOutlinedInput-root': {
          height: 34,
          borderRadius: '4px',
          fontSize: '0.8rem',
          paddingRight: '6px !important'
        }
      }}
      freeSolo
      clearOnEscape
      options={options}
      loading={loading}
      value={keyword}
      inputValue={inputValue}
      onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
      onChange={(e, newValue) => setInputValue(newValue || '')}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={label}
          size='small'
          sx={{
            pl: 0,
            '& .MuiInputBase-input::placeholder': {
              color: '#000',
              fontWeight: 400
            }
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position='start' sx={{ mr: 0 }}>
                <IconButton
                  onClick={onSearch}
                  size='small'
                  sx={{ color: '#1976d2' }}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end' sx={{ gap: 0.5, ml: 0 }}>
                {loading && (
                  <CircularProgress size={16} sx={{ color: '#1976d2' }} />
                )}
                {hasValue && (
                  <IconButton
                    onClick={() => {
                      setInputValue('')
                      setKeyword('')
                    }}
                    size='small'
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: '#e0e0e0',
                      '&:hover': {
                        backgroundColor: '#d5d5d5'
                      },
                      padding: 0,
                      marginRight: '6px'
                    }}
                  >
                    <ClearIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </InputAdornment>
            )
          }}
        />
      )}
    />
  )
}
