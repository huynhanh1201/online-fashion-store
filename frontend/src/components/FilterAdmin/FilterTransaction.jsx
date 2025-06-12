import React, { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import TextField from '@mui/material/TextField'
import dayjs from 'dayjs'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'

export default function FilterTransaction({
  onFilter,
  transactions = [],
  fetchTransactions,
  loading
}) {
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [orderId, setOrderId] = useState('')
  const [method, setMethod] = useState('')
  const [status, setStatus] = useState('')
  const [destroy, setDestroy] = useState('')
  const [sort, setSort] = useState('')

  // Thời gian tạo
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))

  // Thời gian thanh toán
  const [paidFilter, setPaidFilter] = useState('')
  const [paidFrom, setPaidFrom] = useState(dayjs().format('YYYY-MM-DD'))
  const [paidTo, setPaidTo] = useState(dayjs().format('YYYY-MM-DD'))

  useEffect(() => {
    applyFilters(selectedFilter, startDate, endDate)
  }, [keyword, orderId, method, status, destroy, sort])

  const applyFilters = (selectedTime, fromDate, toDate) => {
    const filters = {
      search: keyword || undefined,
      orderId: orderId || undefined,
      method: method || undefined,
      status: status || undefined,
      sort: sort || undefined,
      destroy: destroy !== '' ? destroy : undefined
    }

    // Thời gian tạo
    if (selectedTime === 'custom') {
      filters.filterTypeDate = 'custom'
      filters.startDate = fromDate
      filters.endDate = toDate
    } else if (selectedTime) {
      filters.filterTypeDate = selectedTime
    }

    // Thời gian thanh toán
    if (paidFilter === 'custom') {
      filters.paidAtType = paidFilter
      filters.paidAtFrom = paidFrom
      filters.paidAtTo = paidTo
    } else if (paidFilter) {
      filters.paidAtType = paidFilter
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

  const handleApplyCreatedTime = (selected) => {
    setSelectedFilter(selected)
    applyFilters(selected, startDate, endDate)
  }

  const handleApplyPaidTime = (filterType) => {
    setPaidFilter(filterType)
    applyFilters()
  }

  const handleSearch = () => {
    setKeyword(inputValue)
    fetchTransactions(1, 10, { keyword: inputValue })
  }

  const handleReset = () => {
    setKeyword('')
    setInputValue('')
    setOrderId('')
    setMethod('')
    setStatus('')
    setDestroy('')
    setSort('')
    setSelectedFilter('')
    setPaidFilter('')
    setStartDate(dayjs().format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
    setPaidFrom(dayjs().format('YYYY-MM-DD'))
    setPaidTo(dayjs().format('YYYY-MM-DD'))
    onFilter({})
    fetchTransactions(1, 10)
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <FilterSelect
        label='Phương thức thanh toán'
        value={method}
        onChange={(val) => {
          setMethod(val)
          applyFilters()
        }}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Momo', value: 'momo' },
          { label: 'ZaloPay', value: 'zalopay' },
          { label: 'Chuyển khoản', value: 'bank_transfer' },
          { label: 'Tiền mặt', value: 'cash' }
        ]}
      />
      <FilterSelect
        label='Trạng thái'
        value={status}
        onChange={(val) => {
          setStatus(val)
          applyFilters()
        }}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Thành công', value: 'Completed' },
          { label: 'Đang xử lý', value: 'Pending' },
          { label: 'Thất bại', value: 'Failed' }
        ]}
      />
      <FilterSelect
        label='Đã xoá mềm'
        value={destroy}
        onChange={(val) => {
          setDestroy(val)
          applyFilters()
        }}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Chưa xoá', value: false },
          { label: 'Đã xoá', value: true }
        ]}
      />
      <FilterSelect value={sort} onChange={setSort} />

      <FilterByTime
        label='Thời gian tạo'
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onApply={handleApplyCreatedTime}
      />

      <FilterByTime
        label='Thời gian thanh toán'
        selectedFilter={paidFilter}
        setSelectedFilter={setPaidFilter}
        startDate={paidFrom}
        setStartDate={setPaidFrom}
        endDate={paidTo}
        setEndDate={setPaidTo}
        onApply={handleApplyPaidTime}
      />

      {/*<SearchWithSuggestions*/}
      {/*  label='Tìm mã giao dịch'*/}
      {/*  options={transactions.map((t) => t.transactionId)}*/}
      {/*  loading={loading}*/}
      {/*  keyword={keyword}*/}
      {/*  inputValue={inputValue}*/}
      {/*  setKeyword={setKeyword}*/}
      {/*  setInputValue={setInputValue}*/}
      {/*  onSearch={handleSearch}*/}
      {/*/>*/}

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
