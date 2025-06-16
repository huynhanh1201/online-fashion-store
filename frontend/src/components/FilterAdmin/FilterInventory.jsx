// import React, { useState, useEffect } from 'react'
// import { Box, Button } from '@mui/material'
// import dayjs from 'dayjs'
// import FilterSelect from '~/components/FilterAdmin/common/FilterSelect'
// import FilterByTime from '~/components/FilterAdmin/common/FilterByTime'
// import FilterByPrice from '~/components/FilterAdmin/common/FilterByPrice'
// import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'
//
// export default function FilterInventory({
//   onFilter,
//   warehouses = [],
//   loading,
//   variants,
//   fetchInventories
// }) {
//   const [keyword, setKeyword] = useState('')
//   const [inputValue, setInputValue] = useState('')
//   const [warehouseId, setWarehouseId] = useState('')
//   const [quantityMin, setQuantityMin] = useState('')
//   const [quantityMax, setQuantityMax] = useState('')
//   const [minQtyMin, setMinQtyMin] = useState('')
//   const [minQtyMax, setMinQtyMax] = useState('')
//   const [importPriceMin, setImportPriceMin] = useState('')
//   const [importPriceMax, setImportPriceMax] = useState('')
//   const [exportPriceMin, setExportPriceMin] = useState('')
//   const [exportPriceMax, setExportPriceMax] = useState('')
//   const [status, setStatus] = useState('')
//   const [sort, setSort] = useState('')
//   const [destroy, setDestroy] = useState('')
//   const [selectedFilter, setSelectedFilter] = useState('')
//   const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
//   const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
//
//   useEffect(() => {
//     handleApplyFilters(selectedFilter, startDate, endDate)
//   }, [warehouseId, keyword, sort, destroy, status])
//   const handleSearch = () => {
//     setKeyword(inputValue)
//     handleApplyFilters(selectedFilter, startDate, endDate)
//   }
//   const handleApplyFilters = () => {
//     const filters = {
//       search: keyword || undefined,
//       warehouseId: warehouseId || undefined,
//       quantityMin: quantityMin ? parseInt(quantityMin) : undefined,
//       quantityMax: quantityMax ? parseInt(quantityMax) : undefined,
//       minQtyMin: minQtyMin ? parseInt(minQtyMin) : undefined,
//       minQtyMax: minQtyMax ? parseInt(minQtyMax) : undefined,
//       importPriceMin: importPriceMin ? parseInt(importPriceMin) : undefined,
//       importPriceMax: importPriceMax ? parseInt(importPriceMax) : undefined,
//       exportPriceMin: exportPriceMin ? parseInt(exportPriceMin) : undefined,
//       exportPriceMax: exportPriceMax ? parseInt(exportPriceMax) : undefined,
//       statusInventory: status || undefined,
//       sort: sort || undefined,
//       status: destroy !== '' ? destroy : undefined
//     }
//     // 👇 Lọc theo thời gian tạo
//     if (selectedFilter === 'custom') {
//       filters.filterTypeDate = selectedFilter
//       filters.startDate = startDate || undefined
//       filters.endDate = endDate || undefined
//     } else if (selectedFilter) {
//       filters.filterTypeDate = selectedFilter
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
//     setWarehouseId('')
//     setQuantityMin('')
//     setQuantityMax('')
//     setMinQtyMin('')
//     setMinQtyMax('')
//     setImportPriceMin('')
//     setImportPriceMax('')
//     setExportPriceMin('')
//     setExportPriceMax('')
//     setStatus('')
//     setDestroy('')
//     setSelectedFilter('')
//     setSort('')
//     setStartDate(dayjs().format('YYYY-MM-DD'))
//     setEndDate(dayjs().format('YYYY-MM-DD'))
//     onFilter({})
//     fetchInventories(1, 10) // Reset the inventory list
//   }
//   const variantOptions = variants.map((v) => ({
//     label: v.name,
//     value: v._id
//   }))
//   return (
//     <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
//       <FilterSelect
//         label='Kho hàng'
//         value={warehouseId}
//         onChange={(val) => {
//           setWarehouseId(val)
//           handleApplyFilters()
//         }}
//         options={[
//           { label: 'Tất cả', value: '' },
//           ...warehouses.map((wh) => ({
//             label: wh.warehouseId.name,
//             value: wh.warehouseId._id
//           }))
//         ]}
//       />
//
//       {/*<FilterByPrice*/}
//       {/*  label='Số lượng tồn kho'*/}
//       {/*  priceMin={quantityMin}*/}
//       {/*  priceMax={quantityMax}*/}
//       {/*  setPriceMin={setQuantityMin}*/}
//       {/*  setPriceMax={setQuantityMax}*/}
//       {/*  onApply={handleApplyFilters}*/}
//       {/*/>*/}
//
//       {/*<FilterByPrice*/}
//       {/*  label='Ngưỡng cảnh báo'*/}
//       {/*  priceMin={minQtyMin}*/}
//       {/*  priceMax={minQtyMax}*/}
//       {/*  setPriceMin={setMinQtyMin}*/}
//       {/*  setPriceMax={setMinQtyMax}*/}
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
//       <FilterSelect
//         label='Trạng thái kho'
//         value={status}
//         onChange={setStatus}
//         options={[
//           { label: 'Tất cả', value: '' },
//           { label: 'Còn hàng', value: 'in-stock' },
//           { label: 'Sắp hết hàng', value: 'low-stock' },
//           { label: 'Hết hàng', value: 'out-of-stock' }
//         ]}
//       />
//
//       <FilterSelect
//         label='Trạng thái'
//         value={destroy}
//         onChange={setDestroy}
//         options={[
//           { label: 'Tất cả', value: '' },
//           { label: 'Đang hoạt động', value: false },
//           { label: 'Dừng hoạt động', value: true }
//         ]}
//       />
//       <FilterSelect
//         value={sort}
//         onChange={setSort}
//         options={[
//           { label: 'Mới nhất', value: 'newest' },
//           { label: 'Cũ nhất', value: 'oldest' }
//         ]}
//       />
//
//       <Box sx={{ display: 'flex', gap: 2 }}>
//         <FilterByTime
//           label='Ngày tạo'
//           selectedFilter={selectedFilter}
//           setSelectedFilter={setSelectedFilter}
//           startDate={startDate}
//           setStartDate={setStartDate}
//           endDate={endDate}
//           setEndDate={setEndDate}
//           onApply={handleApplyFilters}
//         />
//         <SearchWithSuggestions
//           label='Biến thể sản phẩm'
//           keyword={keyword}
//           inputValue={inputValue}
//           setKeyword={setKeyword}
//           setInputValue={setInputValue}
//           options={variantOptions.map((v) => v.label)} // Gợi ý theo tên biến thể
//           loading={loading}
//           onSearch={handleSearch}
//         />
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

import React, { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import dayjs from 'dayjs'
import FilterSelect from '~/components/FilterAdmin/common/FilterSelect'
import FilterByTime from '~/components/FilterAdmin/common/FilterByTime'
import SearchWithSuggestions from '~/components/FilterAdmin/common/SearchWithSuggestions'

export default function FilterInventory({
  onFilter,
  warehouses = [],
  loading,
  variants = [],
  fetchInventories
}) {
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [status, setStatus] = useState('')
  const [destroy, setDestroy] = useState('')
  const [sort, setSort] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))

  useEffect(() => {
    applyFilters(selectedFilter, startDate, endDate)
  }, [keyword, warehouseId, status, destroy, sort])

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

  const applyFilters = (filterType, fromDate, toDate) => {
    const filters = {
      search: keyword || undefined,
      warehouseId: warehouseId || undefined,
      statusInventory: status || undefined,
      status: destroy !== '' ? destroy : undefined,
      sort: sort || undefined
    }

    if (filterType === 'custom') {
      filters.filterTypeDate = 'custom'
      filters.startDate = fromDate
      filters.endDate = toDate
    } else if (filterType) {
      filters.filterTypeDate = filterType
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
    setWarehouseId('')
    setStatus('')
    setDestroy('')
    setSort('')
    setSelectedFilter('')
    setStartDate(dayjs().format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
    onFilter({})
    fetchInventories(1, 10)
  }

  return (
    <Box display='flex' flexWrap='wrap' gap={2} mb={2} justifyContent='end'>
      <FilterSelect
        label='Kho hàng'
        value={warehouseId}
        onChange={(val) => {
          setWarehouseId(val)
          applyFilters(selectedFilter, startDate, endDate)
        }}
        options={[
          { label: 'Tất cả', value: '' },
          ...warehouses.map((wh) => ({
            label: wh.warehouseId?.name,
            value: wh.warehouseId?._id
          }))
        ]}
      />

      <FilterSelect
        label='Trạng thái kho'
        value={status}
        onChange={(val) => {
          setStatus(val)
          applyFilters(selectedFilter, startDate, endDate)
        }}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Còn hàng', value: 'in-stock' },
          { label: 'Sắp hết hàng', value: 'low-stock' },
          { label: 'Hết hàng', value: 'out-of-stock' }
        ]}
      />

      <FilterSelect
        label='Trạng thái'
        value={destroy}
        onChange={(val) => {
          setDestroy(val)
          applyFilters(selectedFilter, startDate, endDate)
        }}
        options={[
          { label: 'Tất cả', value: '' },
          { label: 'Đang hoạt động', value: false },
          { label: 'Dừng hoạt động', value: true }
        ]}
      />

      <FilterSelect
        label='Sắp xếp'
        value={sort}
        onChange={(val) => {
          setSort(val)
          applyFilters(selectedFilter, startDate, endDate)
        }}
        options={[
          { label: 'Mới nhất', value: 'newest' },
          { label: 'Cũ nhất', value: 'oldest' }
        ]}
      />

      <FilterByTime
        label='Ngày tạo'
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
          label='Biến thể sản phẩm'
          options={variants.map((v) => v.name)}
          keyword={keyword}
          inputValue={inputValue}
          setKeyword={setKeyword}
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
