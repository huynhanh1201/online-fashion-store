import React, { useEffect, useState, useRef } from 'react'
// import axios from 'axios'
import { Box, Button } from '@mui/material'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect'
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
  const [destroy, setDestroy] = useState('false')
  const [sort, setSort] = useState('newest')
  // const [provinces, setProvinces] = useState([])
  // const [districts, setDistricts] = useState([])
  // const [wards, setWards] = useState([])
  //
  // const [selectedProvince, setSelectedProvince] = useState('')
  // const [selectedDistrict, setSelectedDistrict] = useState('')
  // const [selectedWard, setSelectedWard] = useState('')

  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))

  // useEffect(() => {
  //   axios
  //     .get('https://provinces.open-api.vn/api/?depth=1')
  //     .then((res) => setProvinces(res.data))
  //     .catch((err) => console.error('Lỗi load tỉnh/thành: ', err))
  // }, [])
  const hasMounted = useRef(false)

  useEffect(() => {
    if (hasMounted.current) {
      if (selectedFilter !== 'custom') {
        applyFilters()
      }
    }
  }, [keyword, destroy, sort, selectedFilter])

  useEffect(() => {
    hasMounted.current = true
  }, [])

  const handleSelectFilter = (filter) => {
    if (filter === selectedFilter) {
      setSelectedFilter('')
      setStartDate(dayjs().format('YYYY-MM-DD'))
      setEndDate(dayjs().format('YYYY-MM-DD'))
    } else {
      setSelectedFilter(filter)
    }
  }

  const handleApplyTime = () => {
    if (selectedFilter === 'custom') {
      applyFilters()
    }
  }

  const handleSearch = () => {
    setKeyword(inputValue)
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
      filters.startDate = startDate
      filters.endDate = endDate
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

  // const applyFilters = () => {
  //   const filters = {
  //     search: keyword || undefined,
  //     status: destroy !== '' ? destroy === 'true' : undefined,
  //     sort: sort || undefined
  //   }
  //
  //   if (selectedFilter === 'custom') {
  //     filters.filterTypeDate = 'custom'
  //     filters.startDate = startDate
  //     filters.endDate = endDate
  //   } else if (selectedFilter) {
  //     filters.filterTypeDate = selectedFilter
  //   }
  //
  //   Object.keys(filters).forEach((key) => {
  //     if (!filters[key]) delete filters[key]
  //   })
  //
  //   onFilter(filters)
  // }

  //
  // const handleProvinceChange = async (code) => {
  //   const province = provinces.find((p) => p.code === code)
  //   const name = province?.name || ''
  //   setSelectedProvince(code)
  //   setProvinceName(name)
  //   setSelectedDistrict('')
  //   setSelectedWard('')
  //   setDistricts([])
  //   setWards([])
  //   setDistrictName('')
  //   setWardName('')
  //
  //   try {
  //     const res = await axios.get(
  //       `https://provinces.open-api.vn/api/p/${code}?depth=2`
  //     )
  //     setDistricts(res.data.districts || [])
  //   } catch (err) {
  //     console.error('Lỗi load quận/huyện:', err)
  //   }
  //
  //   applyFilters({ city: name })
  // }
  //
  // const handleDistrictChange = async (code) => {
  //   const district = districts.find((d) => d.code === code)
  //   const name = district?.name || ''
  //   setSelectedDistrict(code)
  //   setDistrictName(name)
  //   setSelectedWard('')
  //   setWardName('')
  //   setWards([])
  //
  //   try {
  //     const res = await axios.get(
  //       `https://provinces.open-api.vn/api/d/${code}?depth=2`
  //     )
  //     setWards(res.data.wards || [])
  //   } catch (err) {
  //     console.error('Lỗi load phường/xã:', err)
  //   }
  //
  //   applyFilters({ district: name })
  // }
  //
  // const handleWardChange = (code) => {
  //   const ward = wards.find((w) => w.code === code)
  //   const name = ward?.name || ''
  //   setSelectedWard(code)
  //   setWardName(name)
  //   applyFilters({ ward: name })
  // }

  const handleReset = () => {
    setKeyword('')
    setProvinceName('')
    setDistrictName('')
    setWardName('')
    setDestroy('')
    setSort('')
    // setSelectedProvince('')
    // setSelectedDistrict('')
    // setSelectedWard('')
    // setDistricts([])
    // setWards([])
    setSelectedFilter('')
    setStartDate(dayjs().format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
    onFilter({})
    // fetchWarehouses(1, 10)
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      {/*<FilterSelect*/}
      {/*  label='Tỉnh/Thành phố'*/}
      {/*  value={selectedProvince}*/}
      {/*  onChange={handleProvinceChange}*/}
      {/*  options={[*/}
      {/*    { label: 'Tất cả', value: '' },*/}
      {/*    ...provinces.map((p) => ({*/}
      {/*      label: p.name,*/}
      {/*      value: p.code*/}
      {/*    }))*/}
      {/*  ]}*/}
      {/*/>*/}

      {/*<FilterSelect*/}
      {/*  label='Quận/Huyện'*/}
      {/*  value={selectedDistrict}*/}
      {/*  onChange={handleDistrictChange}*/}
      {/*  options={*/}
      {/*    districts.length*/}
      {/*      ? [*/}
      {/*          { label: 'Tất cả', value: '' },*/}
      {/*          ...districts.map((d) => ({ label: d.name, value: d.code }))*/}
      {/*        ]*/}
      {/*      : [*/}
      {/*          {*/}
      {/*            label: 'Vui lòng chọn tỉnh/thành phố',*/}
      {/*            value: '',*/}
      {/*            disabled: true*/}
      {/*          }*/}
      {/*        ]*/}
      {/*  }*/}
      {/*/>*/}

      {/*<FilterSelect*/}
      {/*  label='Phường/Xã'*/}
      {/*  value={selectedWard}*/}
      {/*  onChange={handleWardChange}*/}
      {/*  options={*/}
      {/*    wards.length*/}
      {/*      ? [*/}
      {/*          { label: 'Tất cả', value: '' },*/}
      {/*          ...wards.map((d) => ({ label: d.name, value: d.code }))*/}
      {/*        ]*/}
      {/*      : [{ label: 'Vui lòng chọn quận/huyện', value: '', disabled: true }]*/}
      {/*  }*/}
      {/*/>*/}

      <FilterSelect
        label='Trạng thái'
        value={destroy}
        onChange={(val) => setDestroy(val)}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Đang hoạt động', value: 'false' },
          { label: 'Ngừng hoạt động', value: 'true' }
        ]}
      />

      <FilterSelect value={sort} onChange={setSort} />

      <FilterByTime
        label='Lọc thời gian tạo'
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        onSelectFilter={handleSelectFilter}
        onApply={handleApplyTime}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <SearchWithSuggestions
          label='Tên kho'
          keyword={keyword}
          inputValue={inputValue}
          setKeyword={setKeyword}
          setInputValue={setInputValue}
          options={warehouses.map((w) => w.name)}
          loading={loading}
          onSearch={handleSearch}
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
