// import React from 'react'
// import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
//
// const defaultOptions = [
//   { label: 'Tên A-Z', value: 'name_asc' },
//   { label: 'Tên Z-A', value: 'name_desc' },
//   { label: 'Mới nhất', value: 'newest' },
//   { label: 'Cũ nhất', value: 'oldest' }
// ]
//
// export default function FilterSelect({
//   label = 'Sắp xếp',
//   value,
//   onChange,
//   options = defaultOptions,
//   sx
// }) {
//   return (
//     <FormControl
//       size='small'
//       sx={{
//         minWidth: 150,
//         '& .MuiOutlinedInput-root': {
//           borderRadius: '4px', // Bo tròn
//           height: 34, // Chiều cao cố định
//           fontSize: '0.8rem', // Cỡ chữ nhỏ lại
//           paddingX: 1 // Padding ngang nhẹ
//         },
//         '& .MuiInputLabel-root': {
//           fontSize: '0.75rem' // Nhỏ label luôn
//         },
//         ...sx
//       }}
//     >
//       <InputLabel>{label}</InputLabel>
//       <Select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         label={label}
//       >
//         {options.map((item) => (
//           <MenuItem key={item.value} value={item.value}>
//             {item.label}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   )
// }

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
              maxWidth: 500, // Giới hạn chiều rộng dropdown
              minWidth: '100px', // Bằng với FormControl
              maxHeight: 500 // Giới hạn chiều cao dropdown
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
