// import React, { useState, useEffect } from 'react'
// import { Box, Button } from '@mui/material'
// import FilterSelect from '~/components/FilterAdmin/common/FilterSelect'
// import FilterByTime from '~/components/FilterAdmin/common/FilterByTime'
// import FilterByPrice from '~/components/FilterAdmin/common/FilterByPrice'
// import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'
// import dayjs from 'dayjs'
//
// export default function FilterInventoryLog({
//   onFilter,
//   inventories = [],
//   warehouses = [],
//   batches = [],
//   users = [],
//   loading,
//   inventoryLog
// }) {
//   const [keyword, setKeyword] = useState('')
//   const [inputValue, setInputValue] = useState('')
//   const [inventoryId, setInventoryId] = useState('')
//   const [warehouseId, setWarehouseId] = useState('')
//   const [batchId, setBatchId] = useState('')
//   const [type, setType] = useState('')
//   const [sort, setSort] = useState('')
//   const [amountMin, setAmountMin] = useState('')
//   const [amountMax, setAmountMax] = useState('')
//   const [importPriceMin, setImportPriceMin] = useState('')
//   const [importPriceMax, setImportPriceMax] = useState('')
//   const [exportPriceMin, setExportPriceMin] = useState('')
//   const [exportPriceMax, setExportPriceMax] = useState('')
//   const [createdById, setCreatedById] = useState('')
//   const [createdFilter, setCreatedFilter] = useState('')
//   const [createdStart, setCreatedStart] = useState(dayjs().format('YYYY-MM-DD'))
//   const [createdEnd, setCreatedEnd] = useState(dayjs().format('YYYY-MM-DD'))
//
//   useEffect(() => {
//     handleApplyFilters(createdFilter, createdStart, createdEnd)
//   }, [keyword, inventoryId, warehouseId, batchId, type, createdById, sort])
//
//   const handleApplyFilters = () => {
//     const filters = {
//       search: keyword || undefined,
//       inventoryId: inventoryId || undefined,
//       warehouseId: warehouseId || undefined,
//       batchId: batchId || undefined,
//       type: type || undefined,
//       sort: sort || undefined,
//       createdById: createdById || undefined,
//       amountMin: amountMin ? parseInt(amountMin) : undefined,
//       amountMax: amountMax ? parseInt(amountMax) : undefined,
//       importPriceMin: importPriceMin ? parseInt(importPriceMin) : undefined,
//       importPriceMax: importPriceMax ? parseInt(importPriceMax) : undefined,
//       exportPriceMin: exportPriceMin ? parseInt(exportPriceMin) : undefined,
//       exportPriceMax: exportPriceMax ? parseInt(exportPriceMax) : undefined
//     }
//
//     if (createdFilter === 'custom') {
//       filters.filterTypeDate = createdFilter
//       filters.startDate = createdStart || undefined
//       filters.endDate = createdEnd || undefined
//     } else if (createdFilter) {
//       filters.filterTypeDate = createdFilter
//     }
//
//     Object.keys(filters).forEach((key) => {
//       if (
//         filters[key] === undefined ||
//         filters[key] === null ||
//         filters[key] === ''
//       ) {
//         delete filters[key]
//       }
//     })
//
//     onFilter(filters)
//   }
//
//   const handleReset = () => {
//     setKeyword('')
//     setInputValue('')
//     setInventoryId('')
//     setWarehouseId('')
//     setBatchId('')
//     setType('')
//     setSort('')
//     setAmountMin('')
//     setAmountMax('')
//     setImportPriceMin('')
//     setImportPriceMax('')
//     setExportPriceMin('')
//     setExportPriceMax('')
//     setCreatedById('')
//     setCreatedFilter('')
//     setCreatedStart(dayjs().format('YYYY-MM-DD'))
//     setCreatedEnd(dayjs().format('YYYY-MM-DD'))
//     onFilter({})
//   }
//   const sourceOptions = inventoryLog.map((item) => ({
//     label: item.source,
//     value: item._id
//   }))
//
//   return (
//     <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
//       {/*<FilterSelect*/}
//       {/*  label='Kho hàng'*/}
//       {/*  value={warehouseId}*/}
//       {/*  onChange={(val) => {*/}
//       {/*    setWarehouseId(val)*/}
//       {/*  }}*/}
//       {/*  options={[*/}
//       {/*    { label: 'Tất cả', value: '' },*/}
//       {/*    ...warehouses.map((w) => ({*/}
//       {/*      label: w.name,*/}
//       {/*      value: w._id*/}
//       {/*    }))*/}
//       {/*  ]}*/}
//       {/*/>*/}
//
//       {/*<FilterSelect*/}
//       {/*  label='Bản ghi tồn kho'*/}
//       {/*  value={inventoryId}*/}
//       {/*  onChange={(val) => {*/}
//       {/*    setInventoryId(val)*/}
//       {/*  }}*/}
//       {/*  options={[*/}
//       {/*    { label: 'Tất cả', value: '' },*/}
//       {/*    ...inventories.map((inv) => ({*/}
//       {/*      label: inv.variantId.sku,*/}
//       {/*      value: inv._id*/}
//       {/*    }))*/}
//       {/*  ]}*/}
//       {/*/>*/}
//
//       {/*<FilterSelect*/}
//       {/*  label='Lô hàng'*/}
//       {/*  value={batchId}*/}
//       {/*  onChange={(val) => {*/}
//       {/*    setBatchId(val)*/}
//       {/*  }}*/}
//       {/*  options={[*/}
//       {/*    { label: 'Tất cả', value: '' },*/}
//       {/*    ...batches.map((b) => ({*/}
//       {/*      label: b.batchCode,*/}
//       {/*      value: b._id*/}
//       {/*    }))*/}
//       {/*  ]}*/}
//       {/*/>*/}
//
//       <FilterSelect
//         label='Loại'
//         value={type}
//         onChange={(val) => {
//           setType(val)
//         }}
//         options={[
//           { label: 'Tất cả', value: '' },
//           { label: 'Nhập', value: 'in' },
//           { label: 'Xuất', value: 'out' }
//         ]}
//       />
//
//       {/*<FilterByPrice*/}
//       {/*  label='Số lượng thay đổi'*/}
//       {/*  priceMin={amountMin}*/}
//       {/*  priceMax={amountMax}*/}
//       {/*  setPriceMin={setAmountMin}*/}
//       {/*  setPriceMax={setAmountMax}*/}
//       {/*  onApply={handleApplyFilters}*/}
//       {/*/>*/}
//
//       {/*<FilterByPrice*/}
//       {/*  label='Giá nhập (VNĐ)'*/}
//       {/*  priceMin={importPriceMin}*/}
//       {/*  priceMax={importPriceMax}*/}
//       {/*  setPriceMin={setImportPriceMin}*/}
//       {/*  setPriceMax={setImportPriceMax}*/}
//       {/*  onApply={handleApplyFilters}*/}
//       {/*/>*/}
//
//       {/*<FilterByPrice*/}
//       {/*  label='Giá bán (VNĐ)'*/}
//       {/*  priceMin={exportPriceMin}*/}
//       {/*  priceMax={exportPriceMax}*/}
//       {/*  setPriceMin={setExportPriceMin}*/}
//       {/*  setPriceMax={setExportPriceMax}*/}
//       {/*  onApply={handleApplyFilters}*/}
//       {/*/>*/}
//
//       {/*<FilterSelect*/}
//       {/*  label='Người người thực hiện'*/}
//       {/*  value={createdById}*/}
//       {/*  onChange={(val) => {*/}
//       {/*    setCreatedById(val)*/}
//       {/*  }}*/}
//       {/*  options={[*/}
//       {/*    { label: 'Tất cả', value: '' },*/}
//       {/*    ...users.map((u) => ({*/}
//       {/*      label: `${u.name} (${u.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'})`,*/}
//       {/*      value: u._id*/}
//       {/*    }))*/}
//       {/*  ]}*/}
//       {/*/>*/}
//       <FilterSelect
//         value={sort}
//         onChange={setSort}
//         options={[
//           { label: 'Mới nhất', value: 'newest' },
//           { label: 'Cũ nhất', value: 'oldest' }
//         ]}
//       />
//       <FilterByTime
//         label='Ngày tạo phiếu'
//         selectedFilter={createdFilter}
//         setSelectedFilter={setCreatedFilter}
//         startDate={createdStart}
//         setStartDate={setCreatedStart}
//         endDate={createdEnd}
//         setEndDate={setCreatedEnd}
//         onApply={handleApplyFilters}
//       />
//       <Box sx={{ display: 'flex', gap: 2 }}>
//         <SearchWithSuggestions
//           label='Mã phiếu'
//           keyword={keyword}
//           inputValue={inputValue}
//           setKeyword={setKeyword}
//           setInputValue={setInputValue}
//           options={sourceOptions.map((s) => s.label)}
//           loading={loading}
//           onSearch={() => {
//             // const found = sourceOptions.find((s) => s.label === inputValue)
//             // setSource(found?.value || '')
//             // // đặt keyword là inputValue thay vì chờ onchange
//             setKeyword(inputValue)
//             handleApplyFilters()
//           }}
//         />
//
//         <Button
//           variant='outlined'
//           size='small'
//           color='error'
//           onClick={handleReset}
//           sx={{ textTransform: 'none' }}
//         >
//           Làm mới
//         </Button>
//       </Box>
//     </Box>
//   )
// }

import React, { useState, useEffect, useRef } from 'react'
import { Box, Button } from '@mui/material'
import dayjs from 'dayjs'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'
import useInventoryLogs from '~/hooks/admin/Inventory/useInventoryLogs.js'
export default function FilterInventoryLog({ onFilter, loading }) {
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [inventoryId, setInventoryId] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [batchId, setBatchId] = useState('')
  const [type, setType] = useState('')
  const [sort, setSort] = useState('newest')
  const [amountMin, setAmountMin] = useState('')
  const [amountMax, setAmountMax] = useState('')
  const [importPriceMin, setImportPriceMin] = useState('')
  const [importPriceMax, setImportPriceMax] = useState('')
  const [exportPriceMin, setExportPriceMin] = useState('')
  const [exportPriceMax, setExportPriceMax] = useState('')
  const [createdById, setCreatedById] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const hasMounted = useRef(false)
  const { logs, fetchLogs } = useInventoryLogs()
  useEffect(() => {
    fetchLogs(1, 100000)
  }, [])

  useEffect(() => {
    if (hasMounted.current) {
      applyFilters(selectedFilter, startDate, endDate)
    } else {
      hasMounted.current = true
    }
  }, [keyword, inventoryId, warehouseId, batchId, type, createdById, sort])

  const handleSearch = () => {
    setKeyword(inputValue)
  }

  const handleSelectFilter = (filter) => {
    if (filter === selectedFilter) {
      setSelectedFilter('')
      setStartDate(dayjs().format('YYYY-MM-DD'))
      setEndDate(dayjs().format('YYYY-MM-DD'))
      applyFilters('', '', '')
    } else {
      setSelectedFilter(filter)
      if (filter !== 'custom') {
        applyFilters(filter, startDate, endDate)
      }
    }
  }

  const handleApplyTime = (filterType) => {
    applyFilters(filterType, startDate, endDate)
  }

  const applyFilters = (filterTypeDate, fromDate, toDate) => {
    const filters = {
      search: keyword || undefined,
      inventoryId: inventoryId || undefined,
      warehouseId: warehouseId || undefined,
      batchId: batchId || undefined,
      type: type || undefined,
      sort: sort || undefined,
      createdById: createdById || undefined,
      amountMin: amountMin ? parseInt(amountMin) : undefined,
      amountMax: amountMax ? parseInt(amountMax) : undefined,
      importPriceMin: importPriceMin ? parseInt(importPriceMin) : undefined,
      importPriceMax: importPriceMax ? parseInt(importPriceMax) : undefined,
      exportPriceMin: exportPriceMin ? parseInt(exportPriceMin) : undefined,
      exportPriceMax: exportPriceMax ? parseInt(exportPriceMax) : undefined
    }

    if (filterTypeDate === 'custom') {
      filters.filterTypeDate = filterTypeDate
      filters.startDate = fromDate
      filters.endDate = toDate
    } else if (filterTypeDate) {
      filters.filterTypeDate = filterTypeDate
    }

    Object.keys(filters).forEach((key) => {
      if (filters[key] === undefined || filters[key] === '') {
        delete filters[key]
      }
    })

    onFilter(filters)
  }

  const handleReset = () => {
    setKeyword('')
    setInputValue('')
    setInventoryId('')
    setWarehouseId('')
    setBatchId('')
    setType('')
    setSort('newest')
    setAmountMin('')
    setAmountMax('')
    setImportPriceMin('')
    setImportPriceMax('')
    setExportPriceMin('')
    setExportPriceMax('')
    setCreatedById('')
    setSelectedFilter('')
    setStartDate(dayjs().format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
    onFilter({ sort: 'newest' })
  }

  const sourceOptions = logs.map((item) => ({
    label: item.source,
    value: item._id
  }))

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <FilterSelect
        label='Loại phiếu'
        value={type}
        onChange={(val) => setType(val)}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Phiếu nhập', value: 'in' },
          { label: 'Phiếu xuất', value: 'out' }
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
          label='Mã phiếu'
          keyword={keyword}
          inputValue={inputValue}
          setKeyword={setKeyword}
          setInputValue={setInputValue}
          options={sourceOptions.map((s) => s.label)}
          loading={loading}
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
