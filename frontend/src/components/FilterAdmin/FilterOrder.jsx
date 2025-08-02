import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material'
import dayjs from 'dayjs'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'
import FilterByPrice from '~/components/FilterAdmin/common/FilterByPrice'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect.jsx'
export default function FilterOrder({ onFilter }) {
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')

  const [userId, setUserId] = useState('')
  const [minTotal, setMinTotal] = useState('')
  const [maxTotal, setMaxTotal] = useState('')
  const [status, setStatus] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [userInput, setUserInput] = useState('')
  const [sort, setSort] = useState('newest')
  const hasMounted = useRef(false)
  useEffect(() => {
    if (hasMounted.current) {
      applyFilters()
    } else {
      hasMounted.current = true
    }
  }, [keyword, userId, status, sort, paymentMethod, paymentStatus])

  // const handleSearch = () => {
  //   setKeyword(inputValue)
  // }

  const handleApplyTimeFilter = (selected) => {
    setSelectedFilter(selected)
    applyFilters({
      keyword,
      userId,
      minTotal,
      maxTotal,
      status,
      sort,
      paymentMethod,
      paymentStatus,
      selectedTime: selected,
      fromDate: startDate,
      toDate: endDate
    })
  }

  const applyFilters = ({
    search: k = keyword,
    userId: uid = userId,
    minTotal: min = minTotal,
    maxTotal: max = maxTotal,
    statusOrder: st = status,
    sort: s = sort,
    paymentMethod: pm = paymentMethod,
    paymentStatus: ps = paymentStatus,
    selectedTime = selectedFilter,
    fromDate = startDate,
    toDate = endDate
  } = {}) => {
    const filters = {
      search: k || undefined,
      userId: uid || undefined,
      status: st || undefined,
      sort: s || undefined,
      priceMin: min ? parseInt(min) : undefined,
      priceMax: max ? parseInt(max) : undefined,
      paymentMethod: pm || undefined,
      paymentStatus: ps || undefined
    }

    if (selectedTime === 'custom') {
      filters.filterTypeDate = 'custom'
      filters.startDate = fromDate
      filters.endDate = toDate
    } else if (selectedTime) {
      filters.filterTypeDate = selectedTime
    }

    // Xoá các trường null/undefined/rỗng
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
    setUserId('')
    setMinTotal('')
    setMaxTotal('')
    setStatus('')
    setPaymentMethod('')
    setPaymentStatus('')
    setSelectedFilter('')
    setUserInput('')
    setSort('newest')
    setStartDate(dayjs().format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
    onFilter({ sort: 'newest' })
    // fetchOrders()
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      {/*<FilterSelect*/}
      {/*  label='Người dặt'*/}
      {/*  value={userId}*/}
      {/*  onChange={setUserId}*/}
      {/*  options={[*/}
      {/*    { label: 'Tất cả', value: '' },*/}
      {/*    ...users.map((user) => ({*/}
      {/*      label: user.name,*/}
      {/*      value: user._id*/}
      {/*    }))*/}
      {/*  ]}*/}
      {/*/>*/}
      {/*<FilterSelect*/}
      {/*  label='Mã giảm giá'*/}
      {/*  value={couponId}*/}
      {/*  onChange={setCouponId}*/}
      {/*  options={[*/}
      {/*    { label: 'Tất cả', value: '' },*/}
      {/*    { label: 'Không dùng', value: 'none' },*/}
      {/*    ...coupons.map((c) => ({*/}
      {/*      label: c.code,*/}
      {/*      value: c._id*/}
      {/*    }))*/}
      {/*  ]}*/}
      {/*/>*/}
      {/*<FilterByPrice*/}
      {/*  label='Giá trị đơn hàng'*/}
      {/*  priceMin={minTotal}*/}
      {/*  priceMax={maxTotal}*/}
      {/*  setPriceMin={setMinTotal}*/}
      {/*  setPriceMax={setMaxTotal}*/}
      {/*  onApply={applyFilters}*/}
      {/*/>*/}
      <FilterSelect
        label='Trạng thái đơn hàng'
        value={status}
        onChange={setStatus}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Đang chờ', value: 'Pending' },
          { label: 'Đang xử lý', value: 'Processing' },
          { label: 'Đang vận chuyển', value: 'Shipping' },
          { label: 'Đã gửi hàng', value: 'Shipped' },
          { label: 'Đã giao', value: 'Delivered' },
          { label: 'Đã hủy', value: 'Cancelled' },
          { label: 'Thất bại', value: 'Failed' }
        ]}
        sx={{ width: 200 }}
      />
      <FilterSelect
        label='Hình thức thanh toán'
        value={paymentMethod}
        onChange={setPaymentMethod}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Khi nhận hàng', value: 'COD' },
          { label: 'Trực tuyến', value: 'vnpay' }
        ]}
        sx={{ width: 200 }}
      />
      <FilterSelect
        label='Trạng thái thanh toán'
        value={paymentStatus}
        onChange={setPaymentStatus}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Chờ thanh toán', value: 'Pending' },
          { label: 'Đã thanh toán', value: 'Completed' },
          { label: 'Thất bại', value: 'Failed' }
        ]}
        sx={{ width: 200 }}
      />
      <FilterSelect
        value={sort}
        onChange={setSort}
        options={[
          { label: 'Mới nhất', value: 'newest' },
          { label: 'Cũ nhất', value: 'oldest' }
        ]}
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
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
        {/*<SearchWithSuggestions*/}
        {/*  label='Tên người đặt'*/}
        {/*  options={users.map((u) => u.name)} // có thể truyền users.map(u => u.name) nếu muốn*/}
        {/*  keyword={keyword}*/}
        {/*  inputValue={inputValue}*/}
        {/*  setKeyword={setKeyword}*/}
        {/*  setInputValue={setInputValue}*/}
        {/*  onSearch={handleSearch}*/}
        {/*  loading={loading}*/}
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
