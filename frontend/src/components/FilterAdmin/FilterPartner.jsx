import React, { useState, useEffect, useRef } from 'react'
import { Box, Button } from '@mui/material'
import dayjs from 'dayjs'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'
export default function FilterPartner({
  onFilter,
  partners = [],
  loading,
  fetchPartners
}) {
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [type, setType] = useState('')
  const [destroy, setDestroy] = useState('false')
  const [sort, setSort] = useState('newest')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const hasMounted = useRef(false)
  useEffect(() => {
    if (hasMounted.current) {
      applyFilters(selectedFilter, startDate, endDate)
    } else {
      hasMounted.current = true
    }
  }, [keyword, type, destroy, sort])

  const handleApplyTimeFilter = (selected) => {
    setSelectedFilter(selected)
    applyFilters(selected, startDate, endDate)
  }

  const handleSearch = () => {
    setKeyword(inputValue)
  }

  const applyFilters = (selectedTime, fromDate, toDate) => {
    const filters = {
      search: keyword || undefined,
      type: type || undefined,
      destroy: destroy !== '' ? destroy === 'true' : undefined,
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
      if (!filters[key] && filters[key] !== false) {
        delete filters[key]
      }
    })

    onFilter(filters)
  }

  const handleReset = () => {
    setKeyword('')
    setInputValue('')
    setType('')
    setDestroy('false')
    setSort('newest')
    setSelectedFilter('')
    setStartDate(dayjs().format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
    onFilter({
      destroy: 'false',
      sort: 'newest'
    })
    // fetchPartners(1, 10)
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <FilterSelect
        label='Trạng thái'
        value={destroy}
        onChange={setDestroy}
        options={[
          { label: 'Chưa xoá', value: 'false' },
          { label: 'Đã xóa', value: 'true' }
        ]}
      />
      <FilterSelect value={sort} onChange={setSort} />
      <FilterSelect
        label='Kiểu đối tác'
        value={type}
        onChange={setType}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Nhà cung cấp', value: 'supplier' },
          { label: 'Khách hàng', value: 'customer' },
          { label: 'Ncc & Khách hàng', value: 'both' }
        ]}
      />

      <FilterByTime
        label='Ngày tạo đối tác '
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onApply={handleApplyTimeFilter}
      />

      <SearchWithSuggestions
        label='Tên đối tác'
        options={partners.map((p) => p.name)}
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
  )
}
