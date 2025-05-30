import React, { useState } from 'react'
import { Box, Tabs, Tab, Paper } from '@mui/material'
import InventoryTab from './tab/InventoryTab'
import WarehouseSlipsTab from './tab/WarehouseSlipsTab'
import InventoryLogTab from './tab/InventoryLogTab'
import WarehousesTab from './tab/WarehousesTab'
import VariantsTab from './tab/VariantTab'
import BatchesTab from './tab/BatchesTab'
import {
  Products,
  Variants,
  Inventory,
  Warehouses,
  WarehouseSlips,
  Batch,
  InventoryLog,
  Colors,
  Sizes
} from './data.js'

const InventoryTable = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setPage(0) // Reset page when switching tabs
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const tabLabels = [
    'Tồn kho',
    'Phiếu nhập/xuất',
    'Lịch sử',
    'Kho hàng',
    'Biến thể',
    'Lô hàng'
  ]
  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label='inventory tabs'
      >
        {tabLabels.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>
      <Box sx={{ p: 2 }}>
        {activeTab === 0 && (
          <InventoryTab
            data={Inventory}
            variants={Variants}
            warehouses={Warehouses}
            colors={Colors}
            sizes={Sizes}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
        {activeTab === 1 && (
          <WarehouseSlipsTab
            data={WarehouseSlips}
            warehouses={Warehouses}
            variants={Variants} // Add this prop
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            batches={Batch}
          />
        )}
        {activeTab === 2 && (
          <InventoryLogTab
            data={InventoryLog}
            variants={Variants}
            warehouses={Warehouses}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
        {activeTab === 3 && (
          <WarehousesTab
            data={Warehouses}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
        {activeTab === 4 && (
          <VariantsTab
            data={Variants}
            products={Products}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
        {activeTab === 5 && (
          <BatchesTab
            data={Batch}
            warehouseSlips={WarehouseSlips}
            variants={Variants}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Box>
    </Box>
  )
}

export default InventoryTable
