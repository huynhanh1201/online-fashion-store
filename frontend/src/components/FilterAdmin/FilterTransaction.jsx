import React, { useState, useEffect, useRef } from 'react'
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
  const [destroy, setDestroy] = useState('false')
  const [sort, setSort] = useState('newest')

  // Thời gian tạo
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))

  // Thời gian thanh toán
  const [paidFilter, setPaidFilter] = useState('')
  const [paidFrom, setPaidFrom] = useState(dayjs().format('YYYY-MM-DD'))
  const [paidTo, setPaidTo] = useState(dayjs().format('YYYY-MM-DD'))
  const hasMounted = useRef(false)
  useEffect(() => {
    if (hasMounted.current) {
      applyFilters(selectedFilter, startDate, endDate)
    } else {
      hasMounted.current = true
    }
  }, [keyword, orderId, method, status, destroy, sort])

  const applyFilters = (selectedTime, fromDate, toDate) => {
    const filters = {
      search: keyword || undefined,
      orderId: orderId || undefined,
      method: method || undefined,
      statusPayment: status || undefined,
      sort: sort || undefined,
      status: destroy !== '' ? destroy : undefined
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
    // fetchTransactions(1, 10)
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <FilterSelect
        sx={{ minWidth: 220 }}
        label='Phương thức thanh toán'
        value={method}
        onChange={(val) => {
          setMethod(val)
        }}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Tiền mặt', value: 'COD' },
          { label: 'VNPay', value: 'vnpay' }
        ]}
      />
      <FilterSelect
        sx={{ minWidth: 190 }}
        label='Trạng thái giao dịch'
        value={status}
        onChange={(val) => {
          setStatus(val)
        }}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Đang xử lý', value: 'Pending' },
          { label: 'Thành công', value: 'Completed' },
          { label: 'Thất bại', value: 'Failed' }
        ]}
      />
      <FilterSelect
        label='Trạng thái xoá'
        value={destroy}
        onChange={(val) => {
          setDestroy(val)
        }}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Chưa xoá', value: false },
          { label: 'Đã xoá', value: true }
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
        label='Thời gian tạo'
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onApply={handleApplyCreatedTime}
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <SearchWithSuggestions
          label='Mã đơn hàng'
          options={transactions.map((t) => t.orderCode)}
          loading={loading}
          keyword={keyword}
          inputValue={inputValue}
          setKeyword={setKeyword}
          setInputValue={setInputValue}
          onSearch={handleSearch}
        />
        {/*<FilterByTime*/}
        {/*  label='Thời gian thanh toán'*/}
        {/*  selectedFilter={paidFilter}*/}
        {/*  setSelectedFilter={setPaidFilter}*/}
        {/*  startDate={paidFrom}*/}
        {/*  setStartDate={setPaidFrom}*/}
        {/*  endDate={paidTo}*/}
        {/*  setEndDate={setPaidTo}*/}
        {/*  onApply={handleApplyPaidTime}*/}
        {/*/>*/}

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
          sx={{ textTransform: 'none' }}
        >
          Làm mới
        </Button>
      </Box>
    </Box>
  )
}
