import React, { useState } from 'react'
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
  Button
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddWarehouseSlipModal from '../modal/WarehouseSlip/AddWarehouseSlipModal'

const WarehouseSlipsTab = ({
  data: initialData,
  warehouses,
  variants,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  batches,
  partners,
  addWarehouseSlip,
  refreshWarehouseSlips
}) => {
  const [data, setData] = useState(initialData)
  const [openModal, setOpenModal] = useState(false)
  const [modalType, setModalType] = useState('input') // Track the type ('input' or 'output')
  const [newSlipData, setNewSlipData] = useState({
    slipId: `PNK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`,
    date: new Date(),
    profitType: 'Import', // Default, will be updated based on type
    warehouseId: '',
    partnerCode: '',
    partnerName: '',
    note: ''
  })
  const [items, setItems] = useState([
    { variantId: '', lot: '', quantity: '', unit: '', note: '' }
  ])

  const handleOpenModal = (type) => {
    setModalType(type)
    setNewSlipData({
      ...newSlipData,
      slipId: `${type === 'input' ? 'PNK' : 'PXK'}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`,
      profitType: type === 'input' ? 'Import' : 'Export' // Set profitType based on type
    })
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    refreshWarehouseSlips() // Refresh the slips after closing the modal
    setModalType('input') // Reset to default
    setNewSlipData({
      slipId: `PNK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`,
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
    setData([...data, newSlip])
    await addWarehouseSlip(newSlip) // Call the function to add the slip
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

  const enrichedWarehouseSlips = data.map((slip) => {
    const warehouse = warehouses.find((w) => w.id === slip.warehouseId)
    return {
      ...slip,
      warehouse: warehouse ? warehouse.name : 'N/A',
      type: slip.type === 'import' ? 'Nhập' : 'Xuất',
      statusLabel: slip.status === 'pending' ? 'Đang xử lý' : 'Hoàn thành',
      createdAtFormatted: new Date(slip.createdAt).toLocaleString()
    }
  })

  const warehouseSlipColumns = [
    { id: 'slipId', label: 'Mã phiếu', minWidth: 100 },
    { id: 'type', label: 'Loại', minWidth: 100 },
    { id: 'warehouse', label: 'Kho', minWidth: 100 },
    { id: 'statusLabel', label: 'Trạng thái', minWidth: 100 },
    { id: 'note', label: 'Ghi chú', minWidth: 150 },
    { id: 'createdAtFormatted', label: 'Ngày tạo', minWidth: 150 },
    { id: 'action', label: 'Hành động', minWidth: 100, align: 'center' }
  ]
  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
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
            {enrichedWarehouseSlips
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                  {warehouseSlipColumns.map((column) => {
                    const value = row[column.id]
                    if (column.id === 'action') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <VisibilityIcon />
                        </TableCell>
                      )
                    }
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number'
                          ? column.format(value)
                          : value}
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
        count={enrichedWarehouseSlips.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
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
        warehouseSlips={data} // Pass warehouseSlips
        batches={batches} // Pass batches
        type={modalType} // Pass the type ('input' or 'output')
        partners={partners} // Pass partners
        addWarehouseSlip={addWarehouseSlip}
      />
    </Paper>
  )
}

export default WarehouseSlipsTab
