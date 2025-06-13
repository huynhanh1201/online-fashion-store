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
  label = 'Tìm kiếm',
  placeholder = '',
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
        '& .MuiOutlinedInput-root': {
          paddingRight: '6px !important',
          height: 40
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
          label={label}
          placeholder={placeholder}
          size='small'
          sx={{ minWidth: 220 }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position='end'>
                {loading && (
                  <CircularProgress
                    size={16}
                    sx={{ color: '#1976d2', mr: 1 }}
                  />
                )}

                {hasValue && (
                  <IconButton
                    onClick={() => {
                      setInputValue('')
                      setKeyword('')
                    }}
                    size='small'
                  >
                    <ClearIcon fontSize='small' />
                  </IconButton>
                )}

                <IconButton
                  onClick={onSearch}
                  size='small'
                  sx={{ color: '#1976d2' }}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              '& .MuiAutocomplete-inputRoot': {
                paddingRight: '6px !important'
              }
            }
          }}
        />
      )}
    />
  )
}
