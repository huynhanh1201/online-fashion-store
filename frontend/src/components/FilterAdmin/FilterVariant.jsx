import React, { useEffect, useState, useRef } from 'react'
import { Box, Button } from '@mui/material'
import dayjs from 'dayjs'

import FilterSelect from '~/components/FilterAdmin/common/FilterSelect'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'
import useVariants from '~/hooks/admin/Inventory/useVariants.js'
export default function FilterVariant({
  onFilter,
  products = [],
  fetchProducts,
  loading,
  colors,
  sizes,
  initialSearch
}) {
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')

  const [productId, setProductId] = useState(initialSearch || '')
  const [colorName, setColorName] = useState('')
  const [sizeName, setSizeName] = useState('')
  const [overridePrice, setOverridePrice] = useState('')
  const [destroy, setDestroy] = useState('false')
  const [sort, setSort] = useState('newest')
  const [status, setStatus] = useState('')
  const [importPriceMin, setImportPriceMin] = useState('')
  const [importPriceMax, setImportPriceMax] = useState('')
  const [exportPriceMin, setExportPriceMin] = useState('')
  const [exportPriceMax, setExportPriceMax] = useState('')

  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const hasMounted = useRef(false)
  const { variants, fetchVariants } = useVariants()
  useEffect(() => {
    if (hasMounted.current) {
      applyFilters()
    } else {
      hasMounted.current = true
    }
  }, [
    keyword,
    destroy,
    colorName,
    sizeName,
    productId,
    overridePrice,
    sort,
    status
  ])
  useEffect(() => {
    fetchProducts?.(1, 100000)
    fetchVariants(1, 100000, { destroy: destroy, sort: sort })
  }, [destroy, sort])

  const handleSearch = () => {
    setKeyword(inputValue)
    applyFilters({
      keyword: inputValue,
      productId,
      colorName,
      sizeName,
      overridePrice,
      destroy,
      status,
      sort,
      importPriceRange: { min: importPriceMin, max: importPriceMax },
      exportPriceRange: { min: exportPriceMin, max: exportPriceMax },
      selectedTime: selectedFilter,
      fromDate: startDate,
      toDate: endDate
    })
  }

  const handleApplyTimeFilter = (selected) => {
    setSelectedFilter(selected)
    applyFilters({
      selectedTime: selected,
      fromDate: startDate,
      toDate: endDate
    })
  }

  const applyFilters = ({
    search: kw = keyword,
    productId: pid = productId,
    colorId: c = colorName,
    sizeId: s = sizeName,
    overridePrice: op = overridePrice,
    status: d = status,
    destroy: st = destroy,
    sort: so = sort,
    importPriceMin: ipMin = importPriceMin,
    importPriceMax: ipMax = importPriceMax,
    exportPriceMin: epMin = exportPriceMin,
    exportPriceMax: epMax = exportPriceMax,
    selectedTime = selectedFilter,
    fromDate = startDate,
    toDate = endDate
  } = {}) => {
    const filters = {
      search: kw || undefined,
      productId: pid || undefined,
      colorName: c || undefined,
      sizeName: s || undefined,
      overridePrice: op !== '' ? op === 'true' : undefined,
      status: d || undefined,
      destroy: st !== '' ? st === 'true' : undefined,
      sort: so || undefined,
      importPriceMin: ipMin || undefined,
      importPriceMax: ipMax || undefined,
      exportPriceMin: epMin || undefined,
      exportPriceMax: epMax || undefined
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
    setProductId('')
    setColorName('')
    setSizeName('')
    setOverridePrice('')
    setDestroy('false')
    setStatus('')
    setSort('newest')
    setImportPriceMin('')
    setImportPriceMax('')
    setExportPriceMin('')
    setExportPriceMax('')
    setSelectedFilter('')
    setStartDate(dayjs().format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
    onFilter({ sort: 'newest', destroy: 'false' })
    // fetchVariants?.(1, 10)
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
        label='Sản phẩm'
        value={productId}
        onChange={setProductId}
        options={[
          { label: 'Tất cả', value: '' },
          ...products.map((p) => ({
            label: p.name,
            value: p._id
          }))
        ]}
      />

      {/*<FilterSelect*/}
      {/*  label='Màu sắc'*/}
      {/*  value={colorName}*/}
      {/*  onChange={setColorName}*/}
      {/*  options={[*/}
      {/*    { label: 'Tất cả', value: '' },*/}
      {/*    ...colors.map((p) => ({*/}
      {/*      label: p.name,*/}
      {/*      value: p.name*/}
      {/*    }))*/}
      {/*  ]}*/}
      {/*/>*/}

      {/*<FilterSelect*/}
      {/*  label='Kích cỡ'*/}
      {/*  value={sizeName}*/}
      {/*  onChange={setSizeName}*/}
      {/*  options={[*/}
      {/*    { label: 'Tất cả', value: '' },*/}
      {/*    ...sizes.map((p) => ({*/}
      {/*      label: p.name,*/}
      {/*      value: p.name*/}
      {/*    }))*/}
      {/*  ]}*/}
      {/*/>*/}

      {/*<FilterSelect*/}
      {/*  label='Giá riêng'*/}
      {/*  value={overridePrice}*/}
      {/*  onChange={setOverridePrice}*/}
      {/*  options={[*/}
      {/*    { label: 'Tất cả', value: '' },*/}
      {/*    { label: 'Có', value: 'true' },*/}
      {/*    { label: 'Không', value: 'false' }*/}
      {/*  ]}*/}
      {/*/>*/}

      {/*<FilterSelect*/}
      {/*  label='Trạng thái'*/}
      {/*  value={status}*/}
      {/*  onChange={setStatus}*/}
      {/*  options={[*/}
      {/*    { label: 'Tất cả', value: '' },*/}
      {/*    { label: 'Nháp', value: 'draft' },*/}
      {/*    { label: 'Hoạt động', value: 'active' },*/}
      {/*    { label: 'Ngừng bán', value: 'inactive' }*/}
      {/*  ]}*/}
      {/*/>*/}

      {/*<FilterByPrice*/}
      {/*  label='Giá vốn'*/}
      {/*  priceMin={importPriceMin}*/}
      {/*  priceMax={importPriceMax}*/}
      {/*  setPriceMin={setImportPriceMin}*/}
      {/*  setPriceMax={setImportPriceMax}*/}
      {/*  onApply={() => applyFilters()}*/}
      {/*/>*/}

      {/*<FilterByPrice*/}
      {/*  label='Giá bán'*/}
      {/*  priceMin={exportPriceMin}*/}
      {/*  priceMax={exportPriceMax}*/}
      {/*  setPriceMin={setExportPriceMin}*/}
      {/*  setPriceMax={setExportPriceMax}*/}
      {/*  onApply={() => applyFilters()}*/}
      {/*/>*/}

      <FilterByTime
        label='Ngày tạo biến thể'
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
          label='Tên biến thể'
          options={[...new Set(variants.map((v) => v.name))]}
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
