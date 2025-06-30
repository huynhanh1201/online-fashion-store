import React from 'react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'

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
    <FormControl
      size='small'
      sx={{
        minWidth: 150,
        maxWidth: 500, // Giới hạn chiều rộng tối đa
        position: 'relative', // Đặt position để có thể canh chỉnh nếu cần
        fontSize: '0.75rem !important',
        '& .MuiOutlinedInput-root': {
          borderRadius: '4px',
          height: 34,
          fontSize: '0.8rem',
          paddingX: 1
        },
        '& .MuiInputLabel-root': {
          fontSize: '0.75rem'
        },
        ...sx
      }}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
        renderValue={(selected) => (
          <Typography
            sx={{
              fontSize: '0.75rem', // ✅ Nhỏ như label
              color: 'rgba(0, 0, 0, 0.6)', // ✅ Nhẹ màu giống label
              fontWeight: 400,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {options.find((opt) => opt.value === selected)?.label || ''}
          </Typography>
        )}
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center'
          }
        }}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left'
          },
          PaperProps: {
            sx: {
              maxWidth: 500,
              minWidth: '100px',
              maxHeight: 500
            }
          }
        }}
      >
        {options.map((item) => (
          <MenuItem key={item.value} value={item.value} title={item.label}>
            <Typography
              noWrap
              sx={{
                maxWidth: 500, // Giới hạn chiều rộng từng dòng
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {item.label}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
