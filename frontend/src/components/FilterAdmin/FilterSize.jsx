import React, { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import dayjs from 'dayjs'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime.jsx'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions.jsx'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect.jsx'

export default function FilterSize({
  onFilter,
  sizes = [],
  fetchSizes,
  loading
}) {
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [status, setStatus] = useState('')

  useEffect(() => {
    applyFilters(selectedFilter, startDate, endDate)
  }, [keyword, status])

  const handleApplyTimeFilter = (selected) => {
    setSelectedFilter(selected)
    applyFilters(selected, startDate, endDate)
  }

  const handleSearch = () => {
    setKeyword(inputValue)
    fetchSizes(1, 10, { keyword: inputValue }) // Fetch lại nếu cần
    applyFilters(selectedFilter, startDate, endDate)
  }

  const applyFilters = (selectedTime, fromDate, toDate) => {
    const filters = {
      search: keyword || undefined,
      destroy: status !== '' ? status : undefined
    }

    if (selectedTime === 'custom') {
      filters.createdAt = {
        from: fromDate,
        to: toDate
      }
    } else if (selectedTime) {
      filters.filterTypeDate = selectedTime
    }

    // Xoá các key không có giá trị
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
    onFilter({})
    fetchSizes(1, 10, {}) // Reset lại dữ liệu
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <FilterSelect
        label='Trạng thái'
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
      />

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

      <Box sx={{ display: 'flex', gap: 2 }}>
        <SearchWithSuggestions
          label='Tìm kích cỡ'
          options={sizes.map((size) => size.name)}
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
    </Box>
  )
}
