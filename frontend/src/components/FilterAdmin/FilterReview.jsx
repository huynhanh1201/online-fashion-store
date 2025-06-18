import React, { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime.jsx'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions.jsx'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect.jsx'
import dayjs from 'dayjs'

export default function FilterReview({
  onFilter,
  users = [],
  reviews = [],
  fetchReviews,
  loading
}) {
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [status, setStatus] = useState('')
  const [rating, setRating] = useState('')
  const [sort, setSort] = useState('')

  useEffect(() => {
    applyFilters(selectedFilter, startDate, endDate)
  }, [keyword, status, rating, sort])

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
      status: status || undefined,
      rating: rating || undefined,
      sort: sort || undefined
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
    setStatus('')
    setRating('')
    setSort('')
    onFilter({})
    fetchReviews(1, 10, {}) // Gọi lại toàn bộ
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <FilterSelect
        label='Trạng thái đánh giá'
        value={status}
        onChange={(value) => {
          setStatus(value)
          applyFilters(selectedFilter, startDate, endDate)
        }}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Hiển thị', value: 'active' },
          { label: 'Đã ẩn', value: 'hidden' },
          { label: 'Chờ duyệt', value: 'pending' }
        ]}
      />

      <FilterSelect
        label='Số sao'
        value={rating}
        onChange={(value) => {
          setRating(value)
          applyFilters(selectedFilter, startDate, endDate)
        }}
        options={[
          { label: 'Tất cả', value: '' },
          { label: '5 sao', value: 5 },
          { label: '4 sao', value: 4 },
          { label: '3 sao', value: 3 },
          { label: '2 sao', value: 2 },
          { label: '1 sao', value: 1 }
        ]}
      />

      <FilterSelect
        value={sort}
        onChange={(value) => {
          setSort(value)
          applyFilters(selectedFilter, startDate, endDate)
        }}
        options={[
          { label: 'Mặc định', value: '' },
          { label: 'Mới nhất', value: 'desc' },
          { label: 'Cũ nhất', value: 'asc' }
        ]}
        label='Sắp xếp'
      />

      <FilterByTime
        label='Thời gian đánh giá'
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
          label='Tên sản phẩm / người dùng'
          options={[
            ...new Set([
              ...reviews.map((r) => r.product?.name).filter(Boolean),
              ...users.map((u) => u.fullName).filter(Boolean)
            ])
          ]}
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
