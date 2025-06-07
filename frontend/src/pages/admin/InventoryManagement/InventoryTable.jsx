import React, { useState } from 'react'
import { Box, Tabs, Tab, Paper } from '@mui/material'
import InventoryTab from './tab/InventoryTab'
import WarehouseSlipsTab from './tab/WarehouseSlipsTab'
import InventoryLogTab from './tab/InventoryLogTab'
import WarehousesTab from './tab/WarehousesTab'
import VariantsTab from './tab/VariantTab'
import BatchesTab from './tab/BatchesTab'
import PartnersTab from './tab/PartnersTab'
import WarehouseStatisticTab from './tab/WarehouseStatisticTab'
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
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { products, fetchProducts } = useProducts()
  const { colors, fetchColors } = useColors()
  const { sizes, fetchSizes } = useSizes()
  const {
    inventories,
    fetchInventories,
    updateInventoryById,
    deleteInventoryById,
    getInventoryId
  } = useInventory()
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
  } = useWarehouseSlips()
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
  const formatCurrency = (value) => {
    if (!value) return ''
    return Number(value).toLocaleString('vi-VN') // Thêm dấu chấm theo chuẩn VNĐ
  }

  const parseCurrency = (value) => {
    return value.replaceAll('.', '').replace(/[^\d]/g, '') // Loại bỏ dấu . và ký tự khác ngoài số
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setPage(0) // Reset page when switching tabs
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event, source) => {
    const newRowsPerPage = +event.target.value
    setRowsPerPage(newRowsPerPage)
    const page = 0
    setPage(page)

    switch (source) {
      case 'inventory':
        fetchInventories(page + 1, newRowsPerPage)
        break
      case 'batch':
        fetchBatches(page + 1, newRowsPerPage)
        break
      case 'warehouseSlip':
        fetchWarehouseSlips(page + 1, newRowsPerPage) // nếu API dùng page bắt đầu từ 1
        break
      case 'log':
        fetchLogs(page + 1, newRowsPerPage)
        break
      case 'partner':
        fetchPartners(page + 1, newRowsPerPage)
        break
      case 'warehouse':
        fetchWarehouses(page + 1, newRowsPerPage)
        break
      case 'variant':
        fetchVariants(page + 1, newRowsPerPage)
        break
      default:
        console.warn(`Unknown source: ${source}`)
    }
  }

  const tabLabels = [
    'Thống kê kho',
    'Tồn kho',
    'Nhập/xuất kho',
    'Lịch sử nhập/xuất kho',
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
        {activeTab === 0 && <WarehouseStatisticTab />}
        {activeTab === 1 && (
          <InventoryTab
            data={inventories}
            variants={variants}
            warehouses={warehouses}
            colors={colors}
            sizes={sizes}
            batches={batches}
            partners={partners}
            products={products}
            //properties
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            //handle
            updateInventory={updateInventoryById}
            deleteInventory={deleteInventoryById}
            addWarehouseSlip={createNewWarehouseSlip}
            // fetch
            fetchWarehouses={fetchWarehouses}
            fetchPartner={fetchPartners}
            refreshInventories={fetchInventories}
            refreshVariants={fetchVariants}
            refreshProducts={fetchProducts}
            refreshColors={fetchColors}
            refreshSizes={fetchSizes}
            getInventoryId={getInventoryId} // Add this prop
            // format giá
            formatCurrency={formatCurrency}
            parseCurrency={parseCurrency}
          />
        )}
        {activeTab === 2 && (
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
            fetchVariants={fetchVariants}
            updateWarehouseSlip={update}
            deleteWarehouseSlip={removeWarehouseSlip}
            fetchWarehouses={fetchWarehouses}
            fetchPartner={fetchPartners}
            addPartner={createNewPartner}
            addWarehouse={createNewWarehouse}
            // format giá
            formatCurrency={formatCurrency}
            parseCurrency={parseCurrency}
          />
        )}
        {activeTab === 3 && (
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
            inventories={inventories}
            fetchInventories={fetchInventories}
            fetchVariants={fetchVariants}
            batches={batches}
            fetchBatches={fetchBatches}
            // format giá
            formatCurrency={formatCurrency}
            parseCurrency={parseCurrency}
          />
        )}
        {activeTab === 4 && (
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
        {activeTab === 5 && (
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
            // format giá
            formatCurrency={formatCurrency}
            parseCurrency={parseCurrency}
          />
        )}
        {activeTab === 6 && (
          <BatchesTab
            data={batches}
            warehouse={warehouses}
            variants={variants}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            addBatch={createNewBatch}
            refreshBatches={fetchBatches}
            updateBatch={updateBatchById}
            deleteBatch={deleteBatchById}
            // format giá
            formatCurrency={formatCurrency}
            parseCurrency={parseCurrency}
          />
        )}
        {activeTab === 7 && (
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
