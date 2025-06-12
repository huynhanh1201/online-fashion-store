import React, { useState, useEffect } from 'react'
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
export default function FilterOrder({
  onFilter,
  users = [],
  coupons = [],
  loading,
  fetchOrders
}) {
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')

  const [userId, setUserId] = useState('')
  const [couponId, setCouponId] = useState('')
  const [minTotal, setMinTotal] = useState('')
  const [maxTotal, setMaxTotal] = useState('')
  const [status, setStatus] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))

  useEffect(() => {
    applyFilters()
  }, [
    keyword,
    userId,
    couponId,
    status,
    paymentMethod,
    paymentStatus,
    minTotal,
    maxTotal
  ])

  const handleSearch = () => {
    setKeyword(inputValue)
    applyFilters({
      keyword: inputValue,
      userId,
      couponId,
      minTotal,
      maxTotal,
      status,
      paymentMethod,
      paymentStatus,
      selectedTime: selectedFilter,
      fromDate: startDate,
      toDate: endDate
    })
  }

  const handleApplyTimeFilter = (selected) => {
    setSelectedFilter(selected)
    applyFilters({
      keyword,
      userId,
      couponId,
      minTotal,
      maxTotal,
      status,
      paymentMethod,
      paymentStatus,
      selectedTime: selected,
      fromDate: startDate,
      toDate: endDate
    })
  }

  const applyFilters = ({
    keyword: k = keyword,
    userId: uid = userId,
    couponId: cid = couponId,
    minTotal: min = minTotal,
    maxTotal: max = maxTotal,
    status: st = status,
    paymentMethod: pm = paymentMethod,
    paymentStatus: ps = paymentStatus,
    selectedTime = selectedFilter,
    fromDate = startDate,
    toDate = endDate
  } = {}) => {
    const filters = {
      keyword: k || undefined,
      userId: uid || undefined,
      couponId: cid === 'none' ? null : cid || undefined,
      status: st || undefined,
      paymentMethod: pm || undefined,
      paymentStatus: ps || undefined
    }

    if (min || max) {
      filters.totalRange = {
        ...(min && { min: parseInt(min) }),
        ...(max && { max: parseInt(max) })
      }
    }

    if (selectedTime === 'custom') {
      filters.createdAt = {
        from: fromDate,
        to: toDate
      }
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
    setCouponId('')
    setMinTotal('')
    setMaxTotal('')
    setStatus('')
    setPaymentMethod('')
    setPaymentStatus('')
    setSelectedFilter('')
    setStartDate(dayjs().format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
    onFilter({})
    fetchOrders()
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <SearchWithSuggestions
        label='Tìm theo tên/địa chỉ'
        options={[]} // có thể truyền users.map(u => u.name) nếu muốn
        keyword={keyword}
        inputValue={inputValue}
        setKeyword={setKeyword}
        setInputValue={setInputValue}
        onSearch={handleSearch}
        loading={loading}
      />

      <FilterSelect
        label='Người dùng'
        value={userId}
        onChange={setUserId}
        options={[
          { label: 'Tất cả', value: '' },
          ...users.map((user) => ({
            label: user.name,
            value: user._id
          }))
        ]}
      />

      <FilterSelect
        label='Mã giảm giá'
        value={couponId}
        onChange={setCouponId}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Không dùng', value: 'none' },
          ...coupons.map((c) => ({
            label: c.code,
            value: c._id
          }))
        ]}
      />

      <FilterByPrice
        priceMin={minTotal}
        priceMax={maxTotal}
        setPriceMin={setMinTotal}
        setPriceMax={setMaxTotal}
        onApply={applyFilters}
      />

      <FilterSelect
        label='Trạng thái đơn hàng'
        value={status}
        onChange={setStatus}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Chờ xác nhận', value: 'PENDING' },
          { label: 'Đã xác nhận', value: 'CONFIRMED' },
          { label: 'Đã huỷ', value: 'CANCELLED' },
          { label: 'Hoàn thành', value: 'COMPLETED' }
        ]}
      />

      <FilterSelect
        label='Phương thức thanh toán'
        value={paymentMethod}
        onChange={setPaymentMethod}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'COD', value: 'COD' },
          { label: 'Chuyển khoản', value: 'BANKING' }
        ]}
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
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FilterByTime
          label='Thời gian đặt hàng'
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onApply={handleApplyTimeFilter}
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
