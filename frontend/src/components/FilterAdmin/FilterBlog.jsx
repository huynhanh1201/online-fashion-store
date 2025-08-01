import React, { useState, useEffect, useRef } from 'react'
import { Box, Button } from '@mui/material'
import dayjs from 'dayjs'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime.jsx'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions.jsx'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect.jsx'

export default function FilterBlog({
  onFilter,
  blogs,
  loading,
  initialSearch
}) {
  const [keyword, setKeyword] = useState(initialSearch || '')
  const [inputValue, setInputValue] = useState(initialSearch || '')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('newest')
  const [destroy, setDestroy] = useState('false')
  const hasMounted = useRef(false)

  useEffect(() => {
    applyFilters(selectedFilter, startDate, endDate)
    hasMounted.current = true
  }, [])

  useEffect(() => {
    if (hasMounted.current) {
      applyFilters(selectedFilter, startDate, endDate)
    }
  }, [keyword, sort, status, destroy])

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
      status: status || undefined,
      destroy: destroy || undefined
    }

    if (selectedTime === 'custom') {
      filters.filterTypeDate = 'custom'
      filters.startDate = fromDate
      filters.endDate = toDate
    } else if (selectedTime) {
      filters.filterTypeDate = selectedTime
    }

    Object.keys(filters).forEach((key) => {
      if (!filters[key] && filters[key] !== false) {
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
    setSort('newest')
    setDestroy('false')
    onFilter({ sort: 'newest', destroy: 'false' })
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <FilterSelect
        value={destroy}
        onChange={setDestroy}
        label='Xoá'
        options={[
          { label: 'Chưa xoá', value: 'false' },
          { label: 'Đã xóa', value: 'true' }
        ]}
      />
      <FilterSelect value={sort} onChange={setSort} />

      <FilterSelect
        label='Trạng thái bài viết'
        value={status}
        onChange={(value) => {
          setStatus(value)
          applyFilters(selectedFilter, startDate, endDate)
        }}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Nháp', value: 'draft' },
          { label: 'Đã xuất bản', value: 'published' },
          { label: 'Lưu trữ', value: 'archived' }
        ]}
        sx={{ width: 160 }}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        {/*<SearchWithSuggestions*/}
        {/*  label='Tiêu đề bài viết'*/}
        {/*  options={blogs.map((b) => b.title)}*/}
        {/*  loading={loading}*/}
        {/*  keyword={keyword}*/}
        {/*  inputValue={inputValue}*/}
        {/*  setKeyword={setKeyword}*/}
        {/*  setInputValue={setInputValue}*/}
        {/*  onSearch={handleSearch}*/}
        {/*/>*/}
        <FilterByTime
          label='Lọc thời gian đăng'
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          onSelectFilter={handleSelectFilter}
          onApply={handleApplyTime}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
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
