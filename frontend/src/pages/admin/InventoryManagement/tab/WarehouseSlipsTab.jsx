// WarehouseSlipsTab.js
import React, { useState, useEffect } from 'react'
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Typography,
  Box,
  Button,
  IconButton
} from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import AddWarehouseSlipModal from '../modal/WarehouseSlip/AddWarehouseSlipModal'
import ViewWarehouseSlipModal from '../modal/WarehouseSlip/ViewWarehouseSlipModal'

import { Chip } from '@mui/material'

const WarehouseSlipsTab = ({
  data,
  warehouses,
  variants,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  batches,
  partners,
  addWarehouseSlip,
  refreshWarehouseSlips,
  fetchWarehouses,
  fetchPartner,
  addPartner,
  addWarehouse,
  fetchVariants
}) => {
  const [openModal, setOpenModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false) // State cho View modal
  const [selectedSlip, setSelectedSlip] = useState(null) // State cho phiếu được chọn
  const [modalType, setModalType] = useState('input')
  useEffect(() => {
    refreshWarehouseSlips()
  }, [])
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

  const handleOpenModal = (type) => {
    fetchPartner()
    fetchWarehouses()
    fetchVariants()
    setModalType(type)
    setNewSlipData({
      ...newSlipData,
      slipId: '',
      profitType: type === 'input' ? 'Import' : 'Export'
    })
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    refreshWarehouseSlips()
    setModalType('input')
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
  }

  const handleAddSlip = async (newSlip) => {
    // setData([...data, newSlip])
    await addWarehouseSlip(newSlip)
    handleCloseModal()
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

  const handleAdd = () => {
    const newSlip = {
      type: modalType === 'input' ? 'import' : 'export',
      date: newSlipData.date ? new Date(newSlipData.date).toISOString() : null,
      partnerId: newSlipData.partnerId || '',
      warehouseId: newSlipData.warehouseId || '',
      items: items.map((item) => ({
        variantId: item.variantId || '',
        quantity: parseInt(item.quantity) || 0,
        unit: item.unit || 'cái'
      })),
      note: newSlipData.note || ''
    }
    handleAddSlip(newSlip)
  }

  const handleViewSlip = (slip) => {
    setSelectedSlip(slip)
    setOpenViewModal(true)
  }

  const enrichedWarehouseSlips = data.map((slip) => {
    // const warehouseId =
    //   slip.warehouseId && typeof slip.warehouseId === 'object'
    //     ? slip.warehouseId._id || slip.warehouseId.id
    //     : slip.warehouseId

    const warehouseName =
      typeof slip.warehouseId === 'object'
        ? slip.warehouseId.name
        : warehouses.find(
            (w) => w._id === slip.warehouseId || w.id === slip.warehouseId
          )?.name

    return {
      ...slip,
      warehouse: warehouseName || 'N/A',
      type: slip.type === 'import' ? 'Nhập' : 'Xuất',
      createdAtFormatted: new Date(slip.createdAt).toLocaleString('vi-VN'),
      itemCount: slip.items.length,
      createdByName: slip.createdBy?.name || 'N/A'
    }
  })
  const warehouseSlipColumns = [
    { id: 'slipId', label: 'Mã phiếu', minWidth: 120 },
    { id: 'type', label: 'Loại', minWidth: 100, align: 'center' },
    { id: 'warehouse', label: 'Kho', minWidth: 120 },
    {
      id: 'itemCount',
      label: 'Số mặt hàng',
      minWidth: 120,
      align: 'center',
      format: (value) => `${value.toLocaleString('vi-VN')}`
    },
    { id: 'createdByName', label: 'Người tạo', minWidth: 150, align: 'center' },
    {
      id: 'createdAtFormatted',
      label: 'Ngày tạo',
      minWidth: 160,
      align: 'center'
    },
    { id: 'action', label: 'Hành động', minWidth: 120, align: 'center' }
  ]

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label='warehouse slips table'>
          <TableHead>
            <TableRow>
              <TableCell colSpan={warehouseSlipColumns.length}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant='h6' sx={{ fontWeight: '800' }}>
                    Danh sách phiếu nhập/xuất kho
                  </Typography>
                  <Box>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => handleOpenModal('input')}
                      sx={{ mr: 1 }}
                    >
                      Nhập kho
                    </Button>
                    <Button
                      variant='contained'
                      color='secondary'
                      onClick={() => handleOpenModal('output')}
                    >
                      Xuất kho
                    </Button>
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {warehouseSlipColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {enrichedWarehouseSlips.map((row, index) => (
              <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                {warehouseSlipColumns.map((column) => {
                  const value = row[column.id]
                  if (column.id === 'action') {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <IconButton
                          onClick={() => handleViewSlip(row)}
                          size='small'
                          color='primary'
                        >
                          <RemoveRedEyeIcon color='primary' />
                        </IconButton>
                      </TableCell>
                    )
                  }
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'type' ? (
                        <Chip
                          label={value}
                          color={value === 'Nhập' ? 'success' : 'error'}
                          size='large'
                          sx={{ width: '120px', fontWeight: '800' }}
                        />
                      ) : column.format && typeof value === 'number' ? (
                        column.format(value)
                      ) : (
                        value
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={(e) => onRowsPerPageChange(e, 'warehouseSlip')}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) => {
          const actualTo = to > count ? count : to // nếu to vượt quá count thì lấy count
          const actualFrom = from > count ? count : from // nếu from vượt quá count thì lấy count
          return `${actualFrom}–${actualTo} trên ${count !== -1 ? count : `hơn ${actualTo}`}`
        }}
      />
      <AddWarehouseSlipModal
        open={openModal}
        onClose={handleCloseModal}
        newSlipData={newSlipData}
        handleChange={handleChange}
        handleDateChange={handleDateChange}
        handleAdd={handleAdd}
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
        addPartner={addPartner}
        addWarehouse={addWarehouse}
      />
      <ViewWarehouseSlipModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        slip={selectedSlip}
        warehouses={warehouses}
        variants={variants}
        partners={partners}
      />
    </Paper>
  )
}

export default WarehouseSlipsTab
