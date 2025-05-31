import React, { useState, useEffect } from 'react'
import { Box, Tabs, Tab, Paper } from '@mui/material'
import InventoryTab from './tab/InventoryTab'
import WarehouseSlipsTab from './tab/WarehouseSlipsTab'
import InventoryLogTab from './tab/InventoryLogTab'
import WarehousesTab from './tab/WarehousesTab'
import VariantsTab from './tab/VariantTab'
import BatchesTab from './tab/BatchesTab'
import PartnersTab from './tab/PartnersTab'
import useProducts from '~/hooks/admin/useProducts.js'
import useColors from '~/hooks/admin/useColor.js'
import useSizes from '~/hooks/admin/useSize.js'
import useVariants from '~/hooks/admin/Inventory/useVariants.js'
import useInventory from '~/hooks/admin/Inventory/useInventorys.js'
import useWarehouses from '~/hooks/admin/Inventory/useWarehouses.js'
import useWarehouseSlips from '~/hooks/admin/Inventory/useWarehouseSlip.js'
import useBatches from '~/hooks/admin/Inventory/useBatches.js'
import useInventoryLog from '~/hooks/admin/Inventory/useInventoryLogs.js'
import usePartner from '~/hooks/admin/Inventory/usePartner.js'
const InventoryTable = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { products, fetchProducts } = useProducts()
  const { colors } = useColors()
  const { sizes } = useSizes()
  const {
    inventories,
    fetchInventories,
    createNewInventory,
    updateInventoryById,
    deleteInventoryById
  } = useInventory(page + 1, rowsPerPage)
  const {
    variants,
    fetchVariants,
    createNewVariant,
    updateVariantById,
    deleteVariantById
  } = useVariants()
  const {
    warehouses,
    fetchWarehouses,
    createNewWarehouse,
    updateWarehouseById,
    deleteWarehouseById
  } = useWarehouses()
  const {
    warehouseSlips,
    fetchWarehouseSlips,
    createNewWarehouseSlip,
    update,
    removeWarehouseSlip
  } = useWarehouseSlips(page + 1, rowsPerPage)
  const {
    batches,
    fetchBatches,
    createNewBatch,
    updateBatchById,
    deleteBatchById
  } = useBatches()
  const { logs, fetchLogs, createNewLog } = useInventoryLog()
  const {
    partners,
    fetchPartners,
    createNewPartner,
    updateExistingPartner,
    removePartner
  } = usePartner()
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
    'Lô hàng',
    'Đối tác'
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
            data={inventories}
            variants={variants}
            warehouses={warehouses}
            colors={colors}
            sizes={sizes}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            addInventory={createNewInventory}
            refreshInventories={fetchInventories}
            updateInventory={updateInventoryById}
            deleteInventory={deleteInventoryById}
          />
        )}
        {activeTab === 1 && (
          <WarehouseSlipsTab
            data={warehouseSlips}
            warehouses={warehouses}
            variants={variants} // Add this prop
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            batches={batches}
            addWarehouseSlip={createNewWarehouseSlip}
            partners={partners}
            refreshWarehouseSlips={fetchWarehouseSlips}
            updateWarehouseSlip={update}
            deleteWarehouseSlip={removeWarehouseSlip}
          />
        )}
        {activeTab === 2 && (
          <InventoryLogTab
            data={logs}
            variants={variants}
            warehouses={warehouses}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            addInventoryLog={createNewLog}
            refreshInventoryLogs={fetchLogs}
            updateInventoryLog={update}
            deleteInventoryLog={removeWarehouseSlip}
          />
        )}
        {activeTab === 3 && (
          <WarehousesTab
            data={warehouses}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            addWarehouse={createNewWarehouse}
            refreshWarehouses={fetchWarehouses}
            updateWarehouse={updateWarehouseById}
            deleteWarehouse={deleteWarehouseById}
          />
        )}
        {activeTab === 4 && (
          <VariantsTab
            data={variants}
            products={products}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            addVariant={createNewVariant}
            refreshVariants={fetchVariants}
            updateVariant={updateVariantById}
            deleteVariant={deleteVariantById}
            refreshProducts={fetchProducts}
          />
        )}
        {activeTab === 5 && (
          <BatchesTab
            data={batches}
            warehouseSlips={warehouses}
            variants={variants}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            addBatch={createNewBatch}
            refreshBatches={fetchBatches}
            updateBatch={updateBatchById}
            deleteBatch={deleteBatchById}
          />
        )}
        {activeTab === 6 && (
          <PartnersTab
            data={partners}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            refreshPartners={fetchPartners}
            addPartner={createNewPartner}
            updatePartner={updateExistingPartner}
            deletePartner={removePartner}
          />
        )}
      </Box>
    </Box>
  )
}

export default InventoryTable
