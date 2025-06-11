import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export default function FilterCategorySelect({
  value,
  onChange,
  categories,
  label = 'Danh mục'
}) {
  return (
    <FormControl size='small' sx={{ minWidth: 160 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        <MenuItem value=''>Tất cả</MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat._id} value={cat._id}>
            {cat.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
