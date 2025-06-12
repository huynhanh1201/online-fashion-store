import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const defaultOptions = [
  { label: 'Tên A-Z', value: 'name_asc' },
  { label: 'Tên Z-A', value: 'name_desc' },
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Cũ nhất', value: 'oldest' }
]

export default function FilterSelect({
  label = 'Sắp xếp',
  value,
  onChange,
  options = defaultOptions,
  sx
}) {
  return (
    <FormControl size='small' sx={{ minWidth: 160, ...sx }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        {options.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
