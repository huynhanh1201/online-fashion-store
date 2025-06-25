// import React, { useState, useEffect, useRef } from 'react'
// import { Box, Button } from '@mui/material'
// import dayjs from 'dayjs'
//
// import FilterByTime from '~/components/FilterAdmin/common/FilterByTime.jsx'
// import FilterSelect from '~/components/FilterAdmin/common/FilterSelect.jsx'
// import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions.jsx'
//
// export default function FilterUser({ onFilter, users, loading }) {
//   const [keyword, setKeyword] = useState('')
//   const [inputValue, setInputValue] = useState('')
//   const [selectedFilter, setSelectedFilter] = useState('')
//   const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
//   const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
//   const [role, setRole] = useState('')
//   const [sort, setSort] = useState('newest')
//   const hasMounted = useRef(false)
//
//   useEffect(() => {
//     applyFilters(selectedFilter, startDate, endDate)
//     hasMounted.current = true
//   }, [])
//
//   useEffect(() => {
//     if (hasMounted.current) {
//       applyFilters(selectedFilter, startDate, endDate)
//     }
//   }, [keyword, sort, role])
//
//   const handleSearch = () => {
//     setKeyword(inputValue)
//   }
//
//   const handleSelectFilter = (filter) => {
//     if (filter === selectedFilter) {
//       setSelectedFilter('')
//       setStartDate(dayjs().format('YYYY-MM-DD'))
//       setEndDate(dayjs().format('YYYY-MM-DD'))
//       applyFilters('', '', '')
//     } else {
//       setSelectedFilter(filter)
//       if (filter !== 'custom') {
//         applyFilters(filter, startDate, endDate)
//       }
//     }
//   }
//
//   const handleApplyTime = (filterType) => {
//     applyFilters(filterType, startDate, endDate)
//   }
//
//   const applyFilters = (selectedTime, fromDate, toDate) => {
//     const filters = {
//       search: keyword || undefined,
//       sort: sort || undefined,
//       role: role || undefined
//     }
//
//     if (selectedTime === 'custom') {
//       filters.filterTypeDate = 'custom'
//       filters.startDate = fromDate
//       filters.endDate = toDate
//     } else if (selectedTime) {
//       filters.filterTypeDate = selectedTime
//     }
//
//     Object.keys(filters).forEach((key) => {
//       if (!filters[key] && filters[key] !== false) {
//         delete filters[key]
//       }
//     })
//
//     onFilter(filters)
//   }
//
//   const handleReset = () => {
//     setKeyword('')
//     setInputValue('')
//     setSelectedFilter('')
//     setStartDate(dayjs().format('YYYY-MM-DD'))
//     setEndDate(dayjs().format('YYYY-MM-DD'))
//     setRole('')
//     setSort('')
//     onFilter({})
//   }
//
//   return (
//     <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
//       <FilterSelect value={sort} onChange={setSort} />
//
//       <FilterSelect
//         label='Vai trò'
//         value={role}
//         onChange={(value) => {
//           setRole(value)
//           applyFilters(selectedFilter, startDate, endDate)
//         }}
//         options={[
//           { label: 'Tất cả', value: '' },
//           { label: 'Chủ sở hữu', value: 'owner' },
//           { label: 'Quản trị viên', value: 'admin' },
//           { label: 'Nhân viên', value: 'staff' },
//           { label: 'Khách hàng', value: 'customer' }
//         ]}
//         sx={{ width: 160 }}
//       />
//
//       <FilterByTime
//         label='Lọc theo ngày tạo'
//         selectedFilter={selectedFilter}
//         setSelectedFilter={setSelectedFilter}
//         onSelectFilter={handleSelectFilter}
//         onApply={handleApplyTime}
//         startDate={startDate}
//         setStartDate={setStartDate}
//         endDate={endDate}
//         setEndDate={setEndDate}
//       />
//
//       <Box sx={{ display: 'flex', gap: 2 }}>
//         <SearchWithSuggestions
//           label='Tên hoặc email'
//           options={users.map((u) => u.name || u.email)}
//           loading={loading}
//           keyword={keyword}
//           inputValue={inputValue}
//           setKeyword={setKeyword}
//           setInputValue={setInputValue}
//           onSearch={handleSearch}
//         />
//         <Button
//           variant='outlined'
//           size='small'
//           color='error'
//           onClick={handleReset}
//           sx={{ textTransform: 'none' }}
//         >
//           Làm mới
//         </Button>
//       </Box>
//     </Box>
//   )
// }

import React, { useState } from 'react'
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button
} from '@mui/material'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime.jsx'
import dayjs from 'dayjs'
const roleOptions = [
  { label: 'Tất cả', value: '' },
  { label: 'Chủ shop', value: 'owner' },
  { label: 'Nhân viên', value: 'staff' },
  { label: 'Kỹ thuật viên', value: 'technical_admin' }
]

const statusOptions = [
  { label: 'Tất cả', value: '' },
  { label: 'Đang hoạt động', value: 'active' },
  { label: 'Bị khóa', value: 'inactive' }
]

export default function FilterUser({ onFilter }) {
  const [keyword, setKeyword] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))

  const handleApplyTimeFilter = (selected) => {
    setSelectedFilter(selected)
    applyFilters(selected, startDate, endDate)
  }

  const applyFilters = (selectedTime, fromDate, toDate) => {
    const filters = {
      keyword,
      role,
      status,
      timeFilter: selectedTime,
      startDate: selectedTime === 'custom' ? fromDate : null,
      endDate: selectedTime === 'custom' ? toDate : null
    }
    onFilter(filters)
  }

  const handleReset = () => {
    setKeyword('')
    setRole('')
    setStatus('')
    setSelectedFilter('')
    setStartDate('')
    setEndDate('')
    onFilter({
      keyword: '',
      role: '',
      status: '',
      timeFilter: '',
      startDate: dayjs().format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD')
    })
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2}>
      <TextField
        label='Tìm kiếm tên/email'
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        size='small'
        sx={{ minWidth: 220 }}
      />

      <FormControl size='small' sx={{ minWidth: 160 }}>
        <InputLabel>Vai trò</InputLabel>
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          label='Vai trò'
        >
          {roleOptions.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size='small' sx={{ minWidth: 160 }}>
        <InputLabel>Trạng thái</InputLabel>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          label='Trạng thái'
        >
          {statusOptions.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FilterByTime
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onApply={handleApplyTimeFilter}
      />

      <Button
        variant='contained'
        color='primary'
        size='small'
        onClick={() => applyFilters(selectedFilter, startDate, endDate)}
      >
        Lọc
      </Button>
      <Button
        variant='outlined'
        color='secondary'
        size='small'
        onClick={handleReset}
      >
        Đặt lại
      </Button>
    </Box>
  )
}
