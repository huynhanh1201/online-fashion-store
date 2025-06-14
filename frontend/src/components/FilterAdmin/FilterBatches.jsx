import React, { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import dayjs from 'dayjs'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime'
import FilterByPrice from '~/components/FilterAdmin/common/FilterByPrice'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'

export default function FilterBatches({
  onFilter,
  batches = [],
  variants = [],
  warehouses = [],
  loading,
  fetchData
}) {
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [variantId, setVariantId] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [destroy, setDestroy] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [sort, setSort] = useState('')
  const [quantityMin, setQuantityMin] = useState('')
  const [quantityMax, setQuantityMax] = useState('')
  const [importPriceMin, setImportPriceMin] = useState('')
  const [importPriceMax, setImportPriceMax] = useState('')

  useEffect(() => {
    applyFilters()
  }, [keyword, variantId, warehouseId, destroy, sort])

  const handleSearch = () => {
    setKeyword(inputValue)
    applyFilters({
      keyword: inputValue,
      variantId,
      warehouseId,
      destroy,
      sort,
      selectedTime: selectedFilter,
      fromDate: startDate,
      toDate: endDate
    })
  }

  const handleApplyTimeFilter = (selected) => {
    setSelectedFilter(selected)
    applyFilters({
      keyword,
      variantId,
      warehouseId,
      destroy,
      sort,
      selectedTime: selected,
      fromDate: startDate,
      toDate: endDate
    })
  }

  const applyFilters = ({
    search: k = keyword,
    variantId: vid = variantId,
    warehouseId: wid = warehouseId,
    quantityMin: qMin = quantityMin,
    quantityMax: qMax = quantityMax,
    importPriceMin: pMin = importPriceMin,
    importPriceMax: pMax = importPriceMax,
    status: d = destroy,
    sort: s = sort,
    selectedTime = selectedFilter,
    fromDate = startDate,
    toDate = endDate
  } = {}) => {
    const filters = {
      search: k || undefined,
      variantId: vid || undefined,
      warehouseId: wid || undefined,
      quantityMin: qMin ? parseInt(qMin) : undefined,
      quantityMax: qMax ? parseInt(qMax) : undefined,
      importPriceMin: pMin ? parseInt(pMin) : undefined,
      importPriceMax: pMax ? parseInt(pMax) : undefined,
      status: d || undefined,
      sort: s || undefined
    }

    if (selectedTime === 'custom') {
      filters.filterTypeDate = 'custom'
      filters.startDate = fromDate
      filters.endDate = toDate
    } else if (selectedTime) {
      filters.filterTypeDate = selectedTime
    }

    // Xoá các field không có giá trị
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
    setVariantId('')
    setWarehouseId('')
    setQuantityMin('')
    setQuantityMax('')
    setImportPriceMin('')
    setImportPriceMax('')
    setDestroy('')
    setSort('')
    setSelectedFilter('')
    setStartDate(dayjs().format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
    onFilter({})
    fetchData?.()
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <FilterSelect
        label='Biến thể'
        value={variantId}
        onChange={setVariantId}
        options={[
          { label: 'Tất cả', value: '' },
          ...variants.map((v) => ({ label: v.name, value: v._id }))
        ]}
      />
      <FilterSelect
        label='Kho'
        value={warehouseId}
        onChange={setWarehouseId}
        options={[
          { label: 'Tất cả', value: '' },
          ...warehouses.map((w) => ({ label: w.name, value: w._id }))
        ]}
      />
      {/*<FilterByPrice*/}
      {/*  label='Số lượng'*/}
      {/*  priceMin={quantityMin}*/}
      {/*  priceMax={quantityMax}*/}
      {/*  setPriceMin={setQuantityMin}*/}
      {/*  setPriceMax={setQuantityMax}*/}
      {/*  onApply={() => applyFilters()}*/}
      {/*/>*/}

      {/*<FilterByPrice*/}
      {/*  label='Giá nhập'*/}
      {/*  priceMin={importPriceMin}*/}
      {/*  priceMax={importPriceMax}*/}
      {/*  setPriceMin={setImportPriceMin}*/}
      {/*  setPriceMax={setImportPriceMax}*/}
      {/*  onApply={() => applyFilters()}*/}
      {/*/>*/}
      <FilterSelect
        label='Trạng thái'
        value={destroy}
        onChange={setDestroy}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Đang hoạt động', value: 'false' },
          { label: 'Dừng hoạt động', value: 'true' }
        ]}
      />
      <FilterSelect
        value={sort}
        onChange={setSort}
        options={[
          { label: 'Mới nhất', value: 'newest' },
          { label: 'Cũ nhất', value: 'oldest' }
        ]}
      />
      <FilterByTime
        label='Ngày tạo lô hàng'
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
          label='Mã lô hàng'
          options={batches.map((b) => b.batchCode)}
          keyword={keyword}
          inputValue={inputValue}
          setKeyword={setKeyword}
          setInputValue={setInputValue}
          onSearch={handleSearch}
          loading={loading}
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
