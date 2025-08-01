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
  IconButton,
  Chip
} from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import AddWarehouseSlipModal from '../modal/WarehouseSlip/AddWarehouseSlipModal'
import ViewWarehouseSlipModal from '../modal/WarehouseSlip/ViewWarehouseSlipModal'
import FilterWarehouseSlip from '~/components/FilterAdmin/FilterWarehouseSlip.jsx'
import useVariants from '~/hooks/admin/Inventory/useVariants.js'
import useWarehouses from '~/hooks/admin/Inventory/useWarehouses.js'
import useWarehouseSlips from '~/hooks/admin/Inventory/useWarehouseSlip.js'
import useBatches from '~/hooks/admin/Inventory/useBatches.js'
import usePartner from '~/hooks/admin/Inventory/usePartner.js'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
import Tooltip from '@mui/material/Tooltip'
import usePermissions from '~/hooks/usePermissions'
const WarehouseSlipsTab = () => {
  const { hasPermission } = usePermissions()

  const {
    warehouseSlips,
    fetchWarehouseSlips,
    createNewWarehouseSlip,
    loadingSlip,
    totalPageSlip,
    ROWS_PER_PAGE,
    setROWS_PER_PAGE
  } = useWarehouseSlips()

  const { variants, fetchVariants } = useVariants()
  const { warehouses, fetchWarehouses, createNewWarehouse } = useWarehouses()
  const { batches, fetchBatches } = useBatches()
  const { partners, fetchPartners, createNewPartner } = usePartner()

  const [openModal, setOpenModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false) // State cho View Chart
  const [selectedSlip, setSelectedSlip] = useState(null) // State cho phiếu được chọn
  const [modalType, setModalType] = useState('input')
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({
    sort: 'newest'
  })
  useEffect(() => {
    fetchWarehouseSlips(page, ROWS_PER_PAGE, filter)
  }, [page, ROWS_PER_PAGE, filter])

  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filter, newFilters)) {
      setPage(1)
      setFilter(newFilters)
    }
  }

  const [newSlipData, setNewSlipData] = useState({
    slipId: '',
    date: new Date(),
    profitType: 'Import',
    warehouseId: '',
    partnerId: '',
    partnerName: '',
    note: ''
  })
  const [items, setItems] = useState([
    { variantId: '', lot: '', quantity: '', unit: '', note: '' }
  ])

  const handleOpenModal = (type) => {
    fetchPartners(1, 100000, { destroy: false })
    fetchWarehouses(1, 10, { destroy: false })
    fetchVariants(1, 100000, { destroy: false })
    fetchBatches()
    setModalType(type)
    setNewSlipData({
      ...initialSlipData,
      profitType: type === 'input' ? 'Import' : 'Export'
    })
    setOpenModal(true)
  }

  const initialSlipData = {
    slipId: '',
    date: new Date(),
    profitType: 'Import',
    warehouseId: '',
    partnerId: '',
    partnerName: '',
    note: ''
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setModalType('input')
    setNewSlipData(initialSlipData)
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

  const handleAddPartner = async (partnerData) => {
    const newPartner = await createNewPartner(partnerData)
    if (newPartner) {
      // ✅ Gán đối tượng mới được thêm vào Select
      setNewSlipData((prev) => ({
        ...prev,
        partnerId: newPartner._id
      }))
    }
  }
  const handleAddWarehouse = async (warehouseData) => {
    const newWarehouse = await createNewWarehouse(warehouseData)
    if (newWarehouse) {
      // ✅ Gán đối tượng mới được thêm vào Select
      setNewSlipData((prev) => ({
        ...prev,
        warehouseId: newWarehouse._id
      }))
    }
  }

  const enrichedWarehouseSlips = warehouseSlips.map((slip) => {
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
      warehouse: warehouseName || 'Không có dữ liệu',
      type: slip.type === 'import' ? 'Nhập' : 'Xuất',
      createdAtFormatted: new Date(slip.createdAt).toLocaleDateString('vi-VN'),
      itemCount: slip.items.length,
      createdByName: slip.createdBy?.name || 'Không có dữ liệu'
    }
  })
  const warehouseSlipColumns = [
    {
      id: 'index',
      label: 'STT',
      minWidth: 50,
      maxWidth: 50,
      width: 50,
      align: 'center'
    },
    { id: 'slipId', label: 'Mã phiếu kho', minWidth: 120, maxWidth: 160 },
    { id: 'type', label: 'Loại phiếu', minWidth: 100, align: 'start' },
    { id: 'warehouse', label: 'Kho hàng', minWidth: 120, maxWidth: 180 },
    {
      id: 'itemCount',
      label: 'Số lượng sản phẩm',
      minWidth: 90,
      align: 'right',
      pr: 14,
      format: (value) => `${value.toLocaleString('vi-VN')}`
    },
    {
      id: 'createdByName',
      label: 'Người tạo phiếu',
      minWidth: 150,
      align: 'start'
    },
    {
      id: 'createdAtFormatted',
      label: 'Ngày thực hiện',
      minWidth: 150,
      align: 'start',
      format: (value) => new Date(value).toLocaleDateString('vi-VN')
    },
    { id: 'action', label: 'Hành động', minWidth: 130, align: 'start' }
  ]

  const handleChangePage = (event, value) => setPage(value)

  const onChangeRowsPerPage = (newLimit) => {
    setPage(1)
    setROWS_PER_PAGE(newLimit)
  }

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
                          minWidth: 200,
                          gap: 1
                        }}
                      >
                        {hasPermission('warehouseSlip:create') ? (
                          <>
                            <Button
                              variant='contained'
                              color='primary'
                              onClick={() => handleOpenModal('input')}
                              sx={{
                                textTransform: 'none',
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#4CAF50', //093FB4
                                color: '#fff'
                              }}
                            >
                              Nhập kho
                            </Button>
                            <Button
                              variant='contained'
                              color='error'
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
                          </>
                        ) : (
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{
                              fontStyle: 'italic',
                              textAlign: 'center',
                              py: 1
                            }}
                          >
                            Bạn không có quyền tạo phiếu kho
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <FilterWarehouseSlip
                    onFilter={handleFilter}
                    loading={loadingSlip}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {warehouseSlipColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{
                    minWidth: column.minWidth,
                    width: column.width,
                    px: 1,
                    pr: column.pr,
                    ...(column.maxWidth && { maxWidth: column.maxWidth }),
                    ...(column.id === 'action' && {
                      width: 130,
                      maxWidth: 130,
                      paddingLeft: 2
                    })
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingSlip ? (
              <TableRow>
                <TableCell colSpan={warehouseSlipColumns.length} align='center'>
                  Đang tải phiếu kho...
                </TableCell>
              </TableRow>
            ) : enrichedWarehouseSlips.length === 0 ? (
              <TableNoneData
                col={warehouseSlipColumns.length}
                message='Không có dữ liệu phiếu kho.'
              />
            ) : (
              enrichedWarehouseSlips.map((row, index) => (
                <TableRow hover key={index}>
                  {warehouseSlipColumns.map((col) => {
                    let rawValue

                    // Xử lý các field đặc biệt
                    switch (col.id) {
                      case 'index':
                        rawValue = index + 1 + (page - 1) * ROWS_PER_PAGE
                        break
                      case 'createdAtFormatted': {
                        rawValue = row?.date
                        break
                      }
                      case 'warehouse': {
                        const name = row.warehouseId?.name || 'Không có tên kho'
                        rawValue = name
                          .toLowerCase()
                          .split(' ')
                          .filter(Boolean)
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(' ')
                        break
                      }
                      case 'createdByName': {
                        const name =
                          row.createdBy?.name || 'Không có tên người tạo'
                        rawValue = name
                          .toLowerCase()
                          .split(' ')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(' ')
                        break
                      }

                      default:
                        rawValue = row[col.id]
                    }

                    // Định dạng nếu có format
                    let content = rawValue ?? '—'
                    if (col.format && rawValue !== undefined) {
                      content = col.format(rawValue)
                    }

                    // Chip loại phiếu
                    if (col.id === 'type') {
                      content = (
                        <Chip
                          label={row.type === 'Nhập' ? 'Nhập' : 'Xuất'}
                          size='large'
                          color={row.type === 'Nhập' ? 'success' : 'error'}
                          sx={{
                            width: 120,
                            fontWeight: 800,
                            backgroundColor: row.type === 'Nhập' && '#4CAF50'
                          }}
                        />
                      )
                    }

                    // Nút hành động
                    if (col.id === 'action') {
                      content = (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {hasPermission('warehouseSlip:read') && (
                            <Tooltip title='Xem'>
                              <IconButton
                                onClick={() => handleViewSlip(row)}
                                size='small'
                                color='primary'
                              >
                                <RemoveRedEyeIcon color='primary' />
                              </IconButton>
                            </Tooltip>
                          )}
                          {!hasPermission('warehouseSlip:read') && (
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              Không có quyền
                            </Typography>
                          )}
                        </Box>
                      )
                    }

                    return (
                      <TableCell
                        key={col.id}
                        align={col.align || 'left'}
                        onClick={
                          col.id === 'slipId' &&
                          hasPermission('warehouseSlip:read')
                            ? () => handleViewSlip(row)
                            : undefined
                        }
                        sx={{
                          py: 0,
                          px: 1,
                          height: 55,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          background: '#fff',
                          ...(col.maxWidth && { maxWidth: col.maxWidth }),
                          ...(col.id === 'itemCount' && { pr: col.pr }),
                          ...(col.id === 'slipId' &&
                            hasPermission('warehouseSlip:read') && {
                              cursor: 'pointer'
                            })
                        }}
                        title={
                          typeof content === 'string' ? content : undefined
                        }
                      >
                        {content}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{ background: '#fff' }}
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={totalPageSlip || 0}
        rowsPerPage={ROWS_PER_PAGE}
        page={page - 1}
        onPageChange={(event, newPage) => handleChangePage(event, newPage + 1)} // truyền lại đúng logic cho parent
        onRowsPerPageChange={(event) => {
          const newLimit = parseInt(event.target.value, 10)
          if (onChangeRowsPerPage) {
            onChangeRowsPerPage(newLimit)
          }
        }}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) => {
          const totalPages = Math.max(1, Math.ceil(count / ROWS_PER_PAGE))
          return `${from}–${to} trên ${count} | Trang ${page} / ${totalPages}`
        }}
        ActionsComponent={TablePaginationActions}
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
        warehouseSlips={warehouseSlips}
        batches={batches}
        type={modalType}
        partners={partners}
        addWarehouseSlip={createNewWarehouseSlip}
        addPartner={handleAddPartner}
        addWarehouse={handleAddWarehouse}
        filter={filter}
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
