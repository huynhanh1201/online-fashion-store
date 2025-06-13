import React, { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import dayjs from 'dayjs'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'

export default function FilterPartner({
  onFilter,
  partners = [],
  fetchPartners,
  loading
}) {
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [type, setType] = useState('')
  const [destroy, setDestroy] = useState('')
  const [sort, setSort] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))

  useEffect(() => {
    applyFilters(selectedFilter, startDate, endDate)
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
      status: destroy !== '' ? destroy === 'true' : undefined,
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
    setDestroy('')
    setSort('')
    setSelectedFilter('')
    setStartDate(dayjs().format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
    onFilter({})
    fetchPartners?.(1, 10, {})
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
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

      <FilterSelect
        label='Trạng thái'
        value={destroy}
        onChange={setDestroy}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Đang hoạt động', value: 'false' },
          { label: 'Dừng', value: 'true' }
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

      <SearchWithSuggestions
        label='Tìm kiếm đối tác'
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
      >
        Làm mới
      </Button>
    </Box>
  )
}
