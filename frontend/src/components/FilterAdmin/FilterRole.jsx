import React, { useState, useEffect, useRef } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime.jsx'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions.jsx'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect.jsx'
import dayjs from 'dayjs'

export default function FilterRole({
  onFilter,
  roles,
  loading,
  initialSearch
}) {
  const [keyword, setKeyword] = useState(initialSearch || '')
  const [inputValue, setInputValue] = useState(initialSearch || '')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [status, setStatus] = useState('false')
  const [sort, setSort] = useState('newest')
  const hasMounted = useRef(false)

  useEffect(() => {
    applyFilters(selectedFilter, startDate, endDate)
    hasMounted.current = true
  }, [])

  useEffect(() => {
    if (hasMounted.current) {
      applyFilters(selectedFilter, startDate, endDate)
    }
  }, [keyword, sort, status])

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
      sort: sort || undefined,
      destroy: status || undefined
    }

    if (selectedTime === 'custom') {
      filters.filterTypeDate = 'custom'
      filters.startDate = fromDate
      filters.endDate = toDate
    } else if (selectedTime) {
      filters.filterTypeDate = selectedTime
    }

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
    onFilter({ sort: 'newest', destroy: 'false' })
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <FilterSelect
        label='Xoá'
        value={status}
        onChange={(value) => {
          setStatus(value)
          applyFilters(selectedFilter, startDate, endDate)
        }}
        options={[
          { label: 'Chưa xoá', value: 'false' },
          { label: 'Đã xóa', value: 'true' }
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
          label='Tên vai trò'
          options={roles.map((role) => role.name)}
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
