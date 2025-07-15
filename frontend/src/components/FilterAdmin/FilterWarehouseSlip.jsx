import React, { useState, useEffect, useRef } from 'react'
import { Box, Button } from '@mui/material'
import dayjs from 'dayjs'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'
import useWarehouseSlip from '~/hooks/admin/Inventory/useWarehouseSlip.js'
export default function FilterWarehouseSlip({ onFilter, loading }) {
  const [code, setCode] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [type, setType] = useState('')
  const [createdBy, setCreatedBy] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('newest')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const hasMounted = useRef(false)
  const { warehouseSlips, fetchWarehouseSlips } = useWarehouseSlip()

  useEffect(() => {
    fetchWarehouseSlips(1, 100000)
  }, [])

  useEffect(() => {
    if (hasMounted.current) {
      applyFilters()
    } else {
      hasMounted.current = true
    }
  }, [code, warehouseId, type, createdBy, status, sort])

  const handleSearch = () => {
    setCode(inputValue)
  }

  const handleApplyTimeFilter = (selected) => {
    setSelectedFilter(selected)
    applyFilters({
      code,
      warehouseId,
      type,
      createdBy,
      status,
      sort,
      selectedTime: selected,
      fromDate: startDate,
      toDate: endDate
    })
  }

  const applyFilters = ({
    search: c = code,
    warehouseId: wId = warehouseId,
    type: t = type,
    createdBy: uId = createdBy,
    status: st = status,
    sort: s = sort,
    selectedTime = selectedFilter,
    fromDate = startDate,
    toDate = endDate
  } = {}) => {
    const filters = {
      search: c || undefined,
      warehouseId: wId || undefined,
      type: t || undefined,
      createdBy: uId || undefined,
      status: st || undefined,
      sort: s || undefined
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
    setCode('')
    setInputValue('')
    setWarehouseId('')
    setType('')
    setCreatedBy('')
    setStatus('')
    setSort('')
    setSelectedFilter('')
    setStartDate(dayjs().format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
    onFilter({})
    // fetchData?.()
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      {/*<FilterSelect*/}
      {/*  label='Kho'*/}
      {/*  value={warehouseId}*/}
      {/*  onChange={setWarehouseId}*/}
      {/*  options={[*/}
      {/*    { label: 'Tất cả', value: '' },*/}
      {/*    ...warehouses.map((w) => ({ label: w.name, value: w._id }))*/}
      {/*  ]}*/}
      {/*/>*/}
      <FilterSelect
        label='Loại phiếu'
        value={type}
        onChange={setType}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Phiếu nhập', value: 'import' },
          { label: 'Phiếu xuất', value: 'export' }
        ]}
      />
      {/*<SearchWithSuggestions*/}
      {/*  label='Người nhập'*/}
      {/*  options={users.map((u) => u.name)}*/}
      {/*  keyword={createdBy}*/}
      {/*  inputValue={createdBy}*/}
      {/*  setKeyword={setCreatedBy}*/}
      {/*  setInputValue={setCreatedBy}*/}
      {/*  onSearch={() => applyFilters({ createdBy })}*/}
      {/*  loading={loading}*/}
      {/*/>*/}

      {/*<FilterSelect*/}
      {/*  label='Trạng thái'*/}
      {/*  value={status}*/}
      {/*  onChange={setStatus}*/}
      {/*  options={[*/}
      {/*    { label: 'Tất cả', value: '' },*/}
      {/*    { label: 'Đã xác nhận', value: 'confirmed' },*/}
      {/*    { label: 'Đang xử lý', value: 'processing' },*/}
      {/*    { label: 'Đã huỷ', value: 'cancelled' }*/}
      {/*  ]}*/}
      {/*/>*/}
      <FilterSelect
        value={sort}
        onChange={setSort}
        options={[
          { label: 'Mới nhất', value: 'newest' },
          { label: 'Cũ nhất', value: 'oldest' }
        ]}
      />
      <FilterByTime
        label='Ngày tạo phiếu'
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
          label='Mã phiếu'
          options={warehouseSlips.map((s) => s.slipId)}
          keyword={code}
          inputValue={inputValue}
          setKeyword={setCode}
          setInputValue={setInputValue}
          onSearch={handleSearch}
          loading={loading}
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
