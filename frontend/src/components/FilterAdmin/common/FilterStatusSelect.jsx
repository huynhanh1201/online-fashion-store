import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const defaultOptions = [
  { label: 'Tất cả', value: '' },
  { label: 'Đang hoạt động', value: false },
  { label: 'Đã xoá', value: true }
]

export default function FilterStatusSelect({
  value,
  onChange,
  options = defaultOptions,
  label = 'Trạng thái'
}) {
  return (
    <FormControl size='small' sx={{ minWidth: 160 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        {options.map((opt) => (
          <MenuItem key={opt.label} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
