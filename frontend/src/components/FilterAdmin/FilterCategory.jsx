import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  FormControlLabel,
  Checkbox,
  Button,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime.jsx'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions.jsx'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect.jsx'
import dayjs from 'dayjs'

export default function FilterCategory({
  onFilter,
  categories,
  fetchCategories,
  loading
}) {
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [status, setStatus] = useState('false') // false: Hoạt động, true: Không hoạt động
  const [sort, setSort] = useState('newest')
  const hasMounted = useRef(false)
  useEffect(() => {
    if (hasMounted.current) {
      applyFilters(selectedFilter, startDate, endDate)
    } else {
      hasMounted.current = true
    }
  }, [keyword, status, sort])

  const handleSearch = () => {
    setKeyword(inputValue)
  }
  const handleSelectFilter = (filter) => {
    if (filter === selectedFilter) {
      setSelectedFilter('')
      setStartDate(dayjs().format('YYYY-MM-DD'))
      setEndDate(dayjs().format('YYYY-MM-DD'))
      applyFilters('', '', '')
    } else {
      setSelectedFilter(filter)
      if (filter !== 'custom') {
        applyFilters(filter, startDate, endDate)
      }
    }
  }

  const handleApplyTime = (filterType) => {
    applyFilters(filterType, startDate, endDate)
  }

  const applyFilters = (selectedTime, fromDate, toDate) => {
    const filters = {
      search: keyword || undefined,
      status: status !== '' ? status : undefined,
      sort: sort || undefined
    }

    // Xử lý thời gian tùy theo selectedTime
    if (selectedTime === 'custom') {
      filters.filterTypeDate = 'custom'
      filters.startDate = fromDate
      filters.endDate = toDate
    } else if (selectedTime) {
      filters.filterTypeDate = selectedTime
    }

    // Xoá các field rỗng/null/undefined
    Object.keys(filters).forEach((key) => {
      if (
        filters[key] === undefined ||
        filters[key] === null ||
        filters[key] === ''
      ) {
        delete filters[key]
      }
    })

    onFilter(filters)
  }

  const handleReset = () => {
    setKeyword('')
    setInputValue('')
    setSelectedFilter('')
    setStartDate(dayjs().format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
    setStatus('')
    setSort('')
    onFilter({})
    // fetchCategories(1, 10, {}) // Reset lại danh sách categories
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <FilterSelect
        label='Trạng thái danh mục'
        value={status}
        onChange={(value) => {
          setStatus(value)
          applyFilters(selectedFilter, startDate, endDate)
        }}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Hoạt động', value: false },
          { label: 'Không hoạt động', value: true }
        ]}
        sx={{ width: 160 }}
      />

      <FilterSelect value={sort} onChange={setSort} />

      <FilterByTime
        label='Lọc thời gian tạo'
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        onSelectFilter={handleSelectFilter}
        onApply={handleApplyTime}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <SearchWithSuggestions
          label='Tên danh mục'
          options={categories.map((cat) => cat.name)}
          loading={loading}
          keyword={keyword}
          inputValue={inputValue}
          setKeyword={setKeyword}
          setInputValue={setInputValue}
          onSearch={handleSearch}
        />
        <Button
          variant='outlined'
          size='small'
          color='error'
          onClick={handleReset}
          sx={{ textTransform: 'none' }}
        >
          Làm mới
        </Button>
      </Box>
    </Box>
  )
}
