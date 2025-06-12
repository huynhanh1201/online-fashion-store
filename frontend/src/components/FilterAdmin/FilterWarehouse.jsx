import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Button, MenuItem, TextField } from '@mui/material'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect.jsx'
import dayjs from 'dayjs'

export default function FilterWarehouse({
  onFilter,
  loading,
  warehouses = [],
  fetchWarehouses
}) {
  const [inputValue, setInputValue] = useState('')
  const [keyword, setKeyword] = useState('')
  const [provinceName, setProvinceName] = useState('')
  const [districtName, setDistrictName] = useState('')
  const [wardName, setWardName] = useState('')
  const [destroy, setDestroy] = useState('')
  const [sort, setSort] = useState('')
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedWard, setSelectedWard] = useState('')

  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))

  useEffect(() => {
    axios
      .get('https://provinces.open-api.vn/api/?depth=1')
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error('Lỗi load tỉnh/thành: ', err))
  }, [])

  useEffect(() => {
    applyFilters()
  }, [keyword, destroy, sort])

  const handleSearch = () => {
    setKeyword(inputValue)
    applyFilters()
  }

  const applyFilters = (overrides = {}) => {
    const filters = {
      search: keyword || undefined,
      city: provinceName || undefined,
      district: districtName || undefined,
      ward: wardName || undefined,
      status: destroy !== '' ? destroy === 'true' : undefined,
      sort: sort || undefined,
      ...overrides
    }

    if (selectedFilter === 'custom') {
      filters.filterTypeDate = selectedFilter
      filters.startDate = startDate || undefined
      filters.endDate = endDate || undefined
    } else if (selectedFilter) {
      filters.filterTypeDate = selectedFilter
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

  const handleProvinceChange = async (e) => {
    const code = e.target.value
    const province = provinces.find((p) => p.code === code)
    const name = province?.name || ''
    setSelectedProvince(code)
    setProvinceName(name)
    setSelectedDistrict('')
    setSelectedWard('')
    setDistricts([])
    setWards([])
    setDistrictName('')
    setWardName('')

    try {
      const res = await axios.get(
        `https://provinces.open-api.vn/api/p/${code}?depth=2`
      )
      setDistricts(res.data.districts || [])
    } catch (err) {
      console.error('Lỗi load quận/huyện:', err)
    }

    applyFilters({ city: name })
  }

  const handleDistrictChange = async (e) => {
    const code = e.target.value
    const district = districts.find((d) => d.code === code)
    const name = district?.name || ''
    setSelectedDistrict(code)
    setDistrictName(name)
    setSelectedWard('')
    setWardName('')
    setWards([])

    try {
      const res = await axios.get(
        `https://provinces.open-api.vn/api/d/${code}?depth=2`
      )
      setWards(res.data.wards || [])
    } catch (err) {
      console.error('Lỗi load phường/xã:', err)
    }

    applyFilters({ district: name })
  }

  const handleWardChange = (e) => {
    const code = e.target.value
    const ward = wards.find((w) => w.code === code)
    const name = ward?.name || ''
    setSelectedWard(code)
    setWardName(name)
    applyFilters({ ward: name })
  }

  const handleReset = () => {
    setKeyword('')
    setProvinceName('')
    setDistrictName('')
    setWardName('')
    setDestroy('')
    setSort('')
    setSelectedProvince('')
    setSelectedDistrict('')
    setSelectedWard('')
    setDistricts([])
    setWards([])
    setSelectedFilter('')
    setStartDate(dayjs().format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
    onFilter({})
    fetchWarehouses(1, 10)
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <TextField
        label='Tỉnh/Thành phố'
        select
        value={selectedProvince}
        onChange={handleProvinceChange}
        size='small'
        sx={{ minWidth: 180 }}
      >
        <MenuItem value=''>Tất cả</MenuItem>
        {provinces.map((p) => (
          <MenuItem key={p.code} value={p.code}>
            {p.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label='Quận/Huyện'
        select
        value={selectedDistrict}
        onChange={handleDistrictChange}
        size='small'
        sx={{ minWidth: 160 }}
        disabled={!districts.length}
      >
        <MenuItem value=''>Tất cả</MenuItem>
        {districts.map((d) => (
          <MenuItem key={d.code} value={d.code}>
            {d.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label='Phường/Xã'
        select
        value={selectedWard}
        onChange={handleWardChange}
        size='small'
        sx={{ minWidth: 160 }}
        disabled={!wards.length}
      >
        <MenuItem value=''>Tất cả</MenuItem>
        {wards.map((w) => (
          <MenuItem key={w.code} value={w.code}>
            {w.name}
          </MenuItem>
        ))}
      </TextField>

      <FilterSelect
        label='Trạng thái'
        value={destroy}
        onChange={setDestroy}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Đang hoạt động', value: 'true' },
          { label: 'Ngừng hoạt động', value: 'false' }
        ]}
      />
      <FilterSelect value={sort} onChange={setSort} />
      <FilterByTime
        label='Ngày tạo'
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onApply={() => applyFilters()}
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <SearchWithSuggestions
          label='Tìm kiếm kho'
          keyword={keyword}
          inputValue={inputValue}
          setKeyword={setKeyword}
          setInputValue={setInputValue}
          options={warehouses.map((w) => `${w.code} - ${w.name}`)}
          loading={loading}
          onSearch={handleSearch}
        />

        <Button
          variant='outlined'
          color='error'
          onClick={handleReset}
          size='small'
        >
          Làm mới
        </Button>
      </Box>
    </Box>
  )
}
