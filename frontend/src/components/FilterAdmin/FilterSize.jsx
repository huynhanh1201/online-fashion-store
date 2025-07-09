import React, { useState, useEffect, useRef } from 'react'
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
  const [status, setStatus] = useState('false')
  const [sort, setSort] = useState('newest')
  const hasMounted = useRef(false)
  useEffect(() => {
    if (hasMounted.current) {
      applyFilters(selectedFilter, startDate, endDate)
    } else {
      hasMounted.current = true
    }
  }, [keyword, status, sort])

  const handleApplyTimeFilter = (selected) => {
    setSelectedFilter(selected)
    applyFilters(selected, startDate, endDate)
  }

  const handleSearch = () => {
    setKeyword(inputValue)
    applyFilters(selectedFilter, startDate, endDate)
  }

  const applyFilters = (selectedTime, fromDate, toDate) => {
    const filters = {
      search: keyword || undefined,
      destroy: status !== '' ? status : undefined,
      sort: sort || undefined
    }

    if (selectedTime === 'custom') {
      filters.filterTypeDate = 'custom'
      filters.startDate = fromDate
      filters.endDate = toDate
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
    setStatus('false')
    setSort('newest')
    onFilter({ destroy: 'false', sort: 'newest' })
    // fetchSizes(1, 10) // Reset lại dữ liệu
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <FilterSelect
        label='Xoá'
        value={status}
        onChange={(value) => {
          setStatus(value)
        }}
        options={[
          { label: 'Chưa xoá', value: 'false' },
          { label: 'Đã xoá', value: 'true' }
        ]}
      />
      <FilterSelect value={sort} onChange={setSort} />

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
          label='Tên kích cỡ'
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
          sx={{ textTransform: 'none' }}
        >
          Làm mới
        </Button>
      </Box>
    </Box>
  )
}
