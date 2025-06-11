import React, { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime.jsx'
import FilterByPrice from '~/components/FilterAdmin/common/FilterByPrice'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'
import FilterCategorySelect from '~/components/FilterAdmin/common/FilterCategorySelect.jsx'
import FilterStatusSelect from '~/components/FilterAdmin/common/FilterStatusSelect'
import SortSelect from '~/components/FilterAdmin/common/SortSelect.jsx'
import dayjs from 'dayjs'

export default function FilterProduct({
  onFilter,
  categories,
  fetchCategories,
  loading,
  products
}) {
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [category, setCategory] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [keyword, status, category, priceMin, priceMax, sort])

  const handleSearch = () => {
    setKeyword(inputValue)
    applyFilters({
      keyword: inputValue,
      categoryId: category,
      priceMin,
      priceMax,
      status,
      sort,
      selectedTime: selectedFilter,
      fromDate: startDate,
      toDate: endDate
    })
  }

  const handleApplyTimeFilter = (selected) => {
    setSelectedFilter(selected)
    applyFilters(selected, startDate, endDate)
  }

  const applyFilters = ({
    keyword: keywordInput = keyword,
    categoryId = category,
    priceMin: min = priceMin,
    priceMax: max = priceMax,
    status: statusInput = status,
    sort: sortInput = sort,
    selectedTime = selectedFilter,
    fromDate = startDate,
    toDate = endDate
  } = {}) => {
    const filters = {
      search: keywordInput || undefined,
      categoryId: categoryId || undefined,
      priceMin: min ? parseInt(min) : undefined,
      priceMax: max ? parseInt(max) : undefined,
      status: statusInput !== '' ? statusInput : undefined,
      sort: sortInput || undefined
    }

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
    setInputValue('')
    setKeyword('')
    setCategory('')
    setPriceMin('')
    setPriceMax('')
    setStatus('')
    setSort('')
    setSelectedFilter('')
    setStartDate(dayjs().format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
    onFilter({})
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <FilterCategorySelect
        value={category}
        onChange={(value) => {
          setCategory(value)
        }}
        categories={categories}
      />

      <FilterByPrice
        priceMin={priceMin}
        priceMax={priceMax}
        setPriceMin={setPriceMin}
        setPriceMax={setPriceMax}
        onApply={() => applyFilters()}
      />

      <FilterStatusSelect
        value={status}
        onChange={(value) => {
          setStatus(value)
        }}
      />

      <SortSelect value={sort} onChange={setSort} />
      <FilterByTime
        label='Lọc theo ngày tạo'
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onApply={handleApplyTimeFilter}
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        {' '}
        <SearchWithSuggestions
          label='Tìm sản phẩm'
          options={products.map((p) => p.name)}
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
