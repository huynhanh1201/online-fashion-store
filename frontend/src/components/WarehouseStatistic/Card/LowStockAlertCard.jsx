import React, { useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import AddWarehouseSlipModal from '~/pages/admin/InventoryManagement/modal/WarehouseSlip/AddWarehouseSlipModal.jsx'
import usePermissions from '~/hooks/usePermissions'

export default function LowStockAlertCard({
  data,
  loading,
  warehouses,
  variants,
  batches,
  partners,
  addWarehouseSlip,
  fetchVariants,
  fetchWarehouses,
  fetchPartner,
  addPartner,
  addWarehouse,
  fetchStatistics
}) {
  const { hasPermission } = usePermissions()
  const filteredWarehouses = (data ?? []).filter(
    (warehouse) => warehouse.lowStockVariants?.length > 0
  )

  const [openModal, setOpenModal] = useState(false)
  const [newSlipData, setNewSlipData] = useState({
    slipId: '',
    date: new Date(),
    profitType: 'Import',
    warehouseId: '',
    partnerCode: '',
    partnerName: '',
    note: ''
  })
  const [items, setItems] = useState([
    { variantId: '', lot: '', quantity: '', unit: '', note: '' }
  ])
  const [modalType, setModalType] = useState('input')

  const handleOpenModal = async (item, warehouseId) => {
    // Đợi tất cả gọi fetch xong
    await Promise.all([
      fetchWarehouses(1, 100000, { destroy: false }),
      fetchVariants(1, 100000, { destroy: false }),
      fetchPartner(1, 100000, { destroy: false })
    ])

    // Sau khi chắc chắn đã có dữ liệu → gán
    setModalType('input')
    setNewSlipData({
      slipId: '',
      date: new Date(),
      profitType: 'Import',
      warehouseId: warehouseId || '',
      partnerCode: '',
      partnerName: '',
      note: ''
    })
    setItems([
      {
        variantId: item.variantId || '',
        lot: '',
        quantity: item.minQuantity || '',
        unit: 'cái',
        note: ''
      }
    ])
    setOpenModal(true)
  }

  const handleCloseModal = (updated) => {
    if (updated === 'updated') {
      fetchStatistics()
    }
    setOpenModal(false)
    setNewSlipData({
      slipId: '',
      date: new Date(),
      profitType: 'Import',
      warehouseId: '',
      partnerCode: '',
      partnerName: '',
      note: ''
    })
    setItems([{ variantId: '', lot: '', quantity: '', unit: '', note: '' }])
    setModalType('input')
  }

  const handleChange = (field) => (event) => {
    setNewSlipData({ ...newSlipData, [field]: event.target.value })
  }

  const handleDateChange = (date) => {
    setNewSlipData({ ...newSlipData, date })
  }

  const handleItemChange = (index, field) => (event) => {
    const newItems = [...items]
    newItems[index][field] = event.target.value
    setItems(newItems)
  }

  const handleAddRow = () => {
    setItems([
      ...items,
      { variantId: '', lot: '', quantity: '', unit: '', note: '' }
    ])
  }

  const handleDeleteRow = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleAddPartner = async (partnerData) => {
    const newPartner = await addPartner(partnerData, {}, true)
    if (newPartner) {
      // ✅ Gán đối tượng mới được thêm vào Select
      setNewSlipData((prev) => ({
        ...prev,
        partnerId: newPartner._id
      }))
    }
  }
  const handleAddWarehouse = async (warehouseData) => {
    const newWarehouse = await addWarehouse(warehouseData)
    if (newWarehouse) {
      // ✅ Gán đối tượng mới được thêm vào Select
      setNewSlipData((prev) => ({
        ...prev,
        warehouseId: newWarehouse._id
      }))
    }
  }

  return (
    <>
      <Stack spacing={2}>
        {filteredWarehouses.length === 0 ? (
          <Typography color='text.secondary' sx={{ pb: 2 }}>
            Không có kho nào cần cảnh báo
          </Typography>
        ) : (
          filteredWarehouses.map((warehouse, wIndex) => (
            <Box key={wIndex} sx={{ mb: 2 }}>
              {warehouse.lowStockVariants.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: '#fce4ec',
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Typography fontWeight='bold' sx={{ color: '#333' }}>
                      {item.sku} - {item.name}
                    </Typography>
                    <Typography color='text.secondary' fontSize={14}>
                      {item.quantity === 0
                        ? 'Hết hàng hoàn toàn'
                        : `Còn lại: ${item.quantity} sản phẩm (Min: ${item.minQuantity})`}
                    </Typography>
                  </Box>
                  {hasPermission('warehouseSlip:create') && (
                    <Button
                      variant='contained'
                      onClick={() =>
                        handleOpenModal(
                          item,
                          warehouse._id || warehouse.warehouseId
                        )
                      }
                      sx={{
                        background:
                          'linear-gradient(to right, #5e35b1, #7e57c2)',
                        borderRadius: 4,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        fontSize: 13,
                        px: 2
                      }}
                    >
                      Tạo Phiếu Nhập
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          ))
        )}
      </Stack>

      <AddWarehouseSlipModal
        open={openModal}
        onCloseStock={handleCloseModal}
        newSlipData={newSlipData}
        handleChange={handleChange}
        handleDateChange={handleDateChange}
        warehouses={warehouses}
        items={items}
        handleItemChange={handleItemChange}
        handleDeleteRow={handleDeleteRow}
        handleAddRow={handleAddRow}
        variants={variants}
        warehouseSlips={data}
        batches={batches}
        type={modalType}
        partners={partners}
        addWarehouseSlip={addWarehouseSlip}
        addPartner={handleAddPartner}
        addWarehouse={handleAddWarehouse}
      />
    </>
  )
}
