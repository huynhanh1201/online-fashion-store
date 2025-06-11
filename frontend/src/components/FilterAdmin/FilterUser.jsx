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
