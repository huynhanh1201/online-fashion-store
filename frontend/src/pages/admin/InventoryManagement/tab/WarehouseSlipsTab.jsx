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
import FilterWarehouseSlip from '~/components/FilterAdmin/FilterWarehouseSlip.jsx'
import { Chip } from '@mui/material'

const WarehouseSlipsTab = ({
  data,
  warehouses,
  variants,
  page,
  rowsPerPage,
  onPageChange,
  loading,
  total,
  onChangeRowsPerPage,
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
  const [filter, setFilter] = useState('')

  useEffect(() => {
    refreshWarehouseSlips(page, rowsPerPage, filter)
  }, [page, rowsPerPage])

  const handleFilter = (newFilters) => {
    setFilter(newFilters)
    if (Object.keys(newFilters).length > 0) {
      refreshWarehouseSlips(1, rowsPerPage, newFilters)
    }
  }

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
      createdAtFormatted: new Date(slip.createdAt).toLocaleDateString('vi-VN'),
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
      align: 'center',
      format: (value) => new Date(value).toLocaleDateString('vi-VN')
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
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  mb={2}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      flex: 1
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        minWidth: 250
                      }}
                    >
                      <Typography variant='h6' sx={{ fontWeight: '800' }}>
                        Danh Sách Phiếu Kho
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          minWidth: 250,
                          gap: 1
                        }}
                      >
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={() => handleOpenModal('input')}
                          sx={{
                            textTransform: 'none',
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          Nhập kho
                        </Button>
                        <Button
                          variant='contained'
                          color='secondary'
                          onClick={() => handleOpenModal('output')}
                          sx={{
                            textTransform: 'none',
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          Xuất kho
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  <FilterWarehouseSlip
                    warehouses={warehouses}
                    slips={data}
                    fetchData={refreshWarehouseSlips}
                    onFilter={handleFilter}
                    loading={loading}
                  />
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
        count={total || 0}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={(event, newPage) => onPageChange(event, newPage + 1)} // +1 để đúng logic bên cha
        onRowsPerPageChange={(event) => {
          const newLimit = parseInt(event.target.value, 10)
          if (onChangeRowsPerPage) {
            onChangeRowsPerPage(newLimit)
          }
        }}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`
        }
      />
      <AddWarehouseSlipModal
        open={openModal}
        onClose={handleCloseModal}
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
