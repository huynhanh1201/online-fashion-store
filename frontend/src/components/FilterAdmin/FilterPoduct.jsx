import React, { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime.jsx'
import FilterByPrice from '~/components/FilterAdmin/common/FilterByPrice'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect.jsx'
import dayjs from 'dayjs'

export default function FilterProduct({
  onFilter,
  categories,
  fetchCategories,
  loading,
  products,
  fetchProducts
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
  }, [keyword, status, category, sort])

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
    fetchProducts(1, 10) // Reset products to initial state
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <FilterSelect
        label='Danh mục'
        value={category}
        onChange={(value) => {
          setCategory(value)
        }}
        options={[
          { label: 'Tất cả', value: '' },
          ...categories.map((c) => ({
            label: c.name,
            value: c._id
          }))
        ]}
      />

      {/*<FilterByPrice*/}
      {/*  label='Giá sản phẩm'*/}
      {/*  priceMin={priceMin}*/}
      {/*  priceMax={priceMax}*/}
      {/*  setPriceMin={setPriceMin}*/}
      {/*  setPriceMax={setPriceMax}*/}
      {/*  onApply={() => applyFilters()}*/}
      {/*/>*/}

      <FilterSelect
        label='Trạng thái'
        value={status}
        onChange={(value) => {
          setStatus(value)
          applyFilters(selectedFilter, startDate, endDate)
        }}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Đang bán', value: false },
          { label: 'Ngừng bán', value: true }
        ]}
      />

      <FilterSelect value={sort} onChange={setSort} />
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
          label='Tên sản phẩm'
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
          sx={{ textTransform: 'none' }}
        >
          Làm mới
        </Button>
      </Box>
    </Box>
  )
}
