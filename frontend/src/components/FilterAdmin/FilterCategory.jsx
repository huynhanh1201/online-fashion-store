import React, { useState, useEffect } from 'react'
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
import FilterStatusSelect from '~/components/FilterAdmin/common/FilterStatusSelect'
import SortSelect from '~/components/FilterAdmin/common/SortSelect.jsx'
import dayjs from 'dayjs'

const sortOptions = [
  { label: 'Tên A-Z', value: 'name_asc' },
  { label: 'Tên Z-A', value: 'name_desc' },
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Cũ nhất', value: 'oldest' }
]

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
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('')
  useEffect(() => {
    applyFilters(selectedFilter, startDate, endDate)
  }, [keyword, status, sort])

  const handleApplyTimeFilter = (selected) => {
    setSelectedFilter(selected)
    applyFilters(selected, startDate, endDate)
  }
  const handleSearch = () => {
    setKeyword(inputValue)
    fetchCategories(1, 10, { keyword: inputValue }) // nếu bạn cần gọi API theo từ khoá tìm
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
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2}>
      <FilterStatusSelect
        value={status}
        onChange={(value) => {
          setStatus(value)
          applyFilters(selectedFilter, startDate, endDate)
        }}
      />

      <SortSelect value={sort} onChange={setSort} />

      <FilterByTime
        label='Lọc thời gian tạo'
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onApply={handleApplyTimeFilter}
      />
      <SearchWithSuggestions
        label='Tìm kiếm tên'
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
      >
        Làm mới
      </Button>
    </Box>
  )
}
