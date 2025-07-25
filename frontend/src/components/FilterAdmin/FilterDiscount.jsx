import React, { useEffect, useState, useRef } from 'react'
import { Box, Button } from '@mui/material'
import dayjs from 'dayjs'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'
import useDiscounts from '~/hooks/admin/useDiscount.js'
export default function FilterDiscount({ onFilter, loading }) {
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')

  const [type, setType] = useState('')
  const [amountMin, setAmountMin] = useState('')
  const [amountMax, setAmountMax] = useState('')
  const [minOrderMin, setMinOrderMin] = useState('')
  const [minOrderMax, setMinOrderMax] = useState('')
  const [usageMin, setUsageMin] = useState('')
  const [usageMax, setUsageMax] = useState('')
  const [usedCountMin, setUsedCountMin] = useState('')
  const [usedCountMax, setUsedCountMax] = useState('')
  const [isActive, setIsActive] = useState('true') // true: Đang hoạt động, false: Ngừng hoạt động
  const [sort, setSort] = useState('newest')
  const [destroy, setDestroy] = useState('false')

  const [validFromStart, setValidFromStart] = useState(
    dayjs().format('YYYY-MM-DD')
  )
  const [validFromEnd, setValidFromEnd] = useState(dayjs().format('YYYY-MM-DD'))
  const [validUntilStart, setValidUntilStart] = useState(
    dayjs().format('YYYY-MM-DD')
  )
  const [validUntilEnd, setValidUntilEnd] = useState(
    dayjs().format('YYYY-MM-DD')
  )
  const [createdStart, setCreatedStart] = useState(dayjs().format('YYYY-MM-DD'))
  const [createdEnd, setCreatedEnd] = useState(dayjs().format('YYYY-MM-DD'))

  const [validFromFilter, setValidFromFilter] = useState('')
  const [validUntilFilter, setValidUntilFilter] = useState('')
  const [createdFilter, setCreatedFilter] = useState('')
  const hasMounted = useRef(false)
  const { discounts, fetchDiscounts } = useDiscounts()

  useEffect(() => {
    fetchDiscounts(1, 100000, { destroy: destroy, sort: sort })
  }, [sort, destroy])

  useEffect(() => {
    if (hasMounted.current) {
      applyFilters()
    } else {
      hasMounted.current = true
    }
  }, [keyword, type, isActive, sort, destroy])

  const applyFilters = (
    selectedTime = createdFilter,
    fromDate = createdStart,
    toDate = createdEnd
  ) => {
    const filters = {
      search: keyword || undefined,
      type: type || undefined,
      status: isActive !== '' ? isActive === 'true' : undefined,
      sort: sort || undefined,
      destroy: destroy || undefined,

      amountMin: amountMin ? parseInt(amountMin) : undefined,
      amountMax: amountMax ? parseInt(amountMax) : undefined,

      minOrderMin: minOrderMin ? parseInt(minOrderMin) : undefined,
      minOrderMax: minOrderMax ? parseInt(minOrderMax) : undefined,

      usageLimitMin: usageMin ? parseInt(usageMin) : undefined,
      usageLimitMax: usageMax ? parseInt(usageMax) : undefined,

      usedCountMin: usedCountMin ? parseInt(usedCountMin) : undefined,
      usedCountMax: usedCountMax ? parseInt(usedCountMax) : undefined
    }

    if (selectedTime === 'custom') {
      filters.filterTypeDate = 'custom'
      filters.startDate = fromDate
      filters.endDate = toDate
    } else if (selectedTime) {
      filters.filterTypeDate = selectedTime
    }

    // Giữ lại logic validFrom/validUntil nếu cần
    if (validFromFilter === 'custom') {
      filters.validFromQuick = validFromFilter
      filters.validFromFrom = validFromStart
      filters.validFromTo = validFromEnd
    } else if (validFromFilter) {
      filters.validFromQuick = validFromFilter
    }

    if (validUntilFilter === 'custom') {
      filters.validUntilQuick = validUntilFilter
      filters.validUntilFrom = validUntilStart
      filters.validUntilTo = validUntilEnd
    } else if (validUntilFilter) {
      filters.validUntilQuick = validUntilFilter
    }

    // Xoá field rỗng
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
    setAmountMin('')
    setAmountMax('')
    setMinOrderMin('')
    setMinOrderMax('')
    setUsageMin('')
    setUsageMax('')
    setUsedCountMin('')
    setUsedCountMax('')
    setIsActive('true')
    setSort('newest')
    setDestroy('false')
    setValidFromStart(dayjs().format('YYYY-MM-DD'))
    setValidFromEnd(dayjs().format('YYYY-MM-DD'))
    setValidUntilStart(dayjs().format('YYYY-MM-DD'))
    setValidUntilEnd(dayjs().format('YYYY-MM-DD'))
    setCreatedStart(dayjs().format('YYYY-MM-DD'))
    setCreatedEnd(dayjs().format('YYYY-MM-DD'))
    setValidFromFilter('')
    setValidUntilFilter('')
    setCreatedFilter('')
    onFilter({
      status: 'true',
      sort: 'newest',
      destroy: 'false'
    })
    // fetchDiscounts(1, 10)
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <FilterSelect
        label='Xoá'
        value={destroy}
        onChange={(value) => {
          setDestroy(value)
        }}
        options={[
          { label: 'Chưa xoá', value: 'false' },
          { label: 'Đã xoá', value: 'true' }
        ]}
      />
      <FilterSelect
        label='Loại mã'
        value={type}
        onChange={setType}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Giảm theo phần trăm', value: 'percent' },
          { label: 'Giảm theo số tiền', value: 'fixed' }
        ]}
      />
      {/*<FilterByPrice*/}
      {/*  label='Giá trị giảm'*/}
      {/*  priceMin={amountMin}*/}
      {/*  priceMax={amountMax}*/}
      {/*  setPriceMin={setAmountMin}*/}
      {/*  setPriceMax={setAmountMax}*/}
      {/*  onApply={() => applyFilters()}*/}
      {/*/>*/}
      {/*<FilterByPrice*/}
      {/*  label='Giá tối thiểu đơn hàng'*/}
      {/*  priceMin={minOrderMin}*/}
      {/*  priceMax={minOrderMax}*/}
      {/*  setPriceMin={setMinOrderMin}*/}
      {/*  setPriceMax={setMinOrderMax}*/}
      {/*  onApply={() => applyFilters()}*/}
      {/*/>*/}
      {/*<FilterByPrice*/}
      {/*  label='Giới hạn sử dụng'*/}
      {/*  priceMin={usageMin}*/}
      {/*  priceMax={usageMax}*/}
      {/*  setPriceMin={setUsageMin}*/}
      {/*  setPriceMax={setUsageMax}*/}
      {/*  onApply={() => applyFilters()}*/}
      {/*/>*/}
      {/*<FilterByPrice*/}
      {/*  label='Số lượng đã sử dụng'*/}
      {/*  priceMin={usedCountMin}*/}
      {/*  priceMax={usedCountMax}*/}
      {/*  setPriceMin={setUsedCountMin}*/}
      {/*  setPriceMax={setUsedCountMax}*/}
      {/*  onApply={() => applyFilters()}*/}
      {/*/>*/}
      <FilterSelect
        label='Trạng thái'
        value={isActive}
        onChange={(val) => {
          setIsActive(val)
        }}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Đang hoạt động', value: 'true' },
          { label: 'Ngừng hoạt động', value: 'false' }
        ]}
      />
      <FilterSelect value={sort} onChange={setSort} />
      {/*<FilterByTime*/}
      {/*  label='Ngày bắt đầu hiệu lực'*/}
      {/*  selectedFilter={validFromFilter}*/}
      {/*  setSelectedFilter={setValidFromFilter}*/}
      {/*  startDate={validFromStart}*/}
      {/*  setStartDate={setValidFromStart}*/}
      {/*  endDate={validFromEnd}*/}
      {/*  setEndDate={setValidFromEnd}*/}
      {/*  onApply={() => applyFilters()}*/}
      {/*/>*/}
      {/*<FilterByTime*/}
      {/*  label='Ngày hết hiệu lực'*/}
      {/*  selectedFilter={validUntilFilter}*/}
      {/*  setSelectedFilter={setValidUntilFilter}*/}
      {/*  startDate={validUntilStart}*/}
      {/*  setStartDate={setValidUntilStart}*/}
      {/*  endDate={validUntilEnd}*/}
      {/*  setEndDate={setValidUntilEnd}*/}
      {/*  onApply={() => applyFilters()}*/}
      {/*/>*/}

      <FilterByTime
        label='Lọc thời gian tạo'
        selectedFilter={createdFilter}
        setSelectedFilter={setCreatedFilter}
        startDate={createdStart}
        setStartDate={setCreatedStart}
        endDate={createdEnd}
        setEndDate={setCreatedEnd}
        onApply={(selected) => {
          setCreatedFilter(selected)
          applyFilters(selected, createdStart, createdEnd)
        }}
      />
      <Box display='flex' gap={2}>
        <SearchWithSuggestions
          label='Mã giảm giá'
          keyword={keyword}
          inputValue={inputValue}
          setKeyword={setKeyword}
          setInputValue={setInputValue}
          onSearch={() => {
            setKeyword(inputValue)
          }}
          options={discounts.map((d) => d.code)}
          loading={loading}
        />
        <Button
          variant='outlined'
          color='error'
          onClick={handleReset}
          size='small'
          sx={{ textTransform: 'none' }}
        >
          Làm mới
        </Button>
      </Box>
    </Box>
  )
}
