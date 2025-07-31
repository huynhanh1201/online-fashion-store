import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  IconButton,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Divider
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import customVi from '~/components/DateInput/CustomVi.jsx'
import DeleteIcon from '@mui/icons-material/Delete'
import Search from '~/components/SearchAdmin/Search.jsx'
import AddPartnerModal from '~/pages/admin/InventoryManagement/modal/Partner/AddPartnerModal.jsx'
import AddWarehouseModal from '~/pages/admin/InventoryManagement/modal/Warehouse/AddWarehouseModal.jsx'
import Tooltip from '@mui/material/Tooltip'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
export default function AddWarehouseSlipModal({
  open,
  onClose,
  newSlipData,
  handleChange,
  handleDateChange,
  warehouses,
  items,
  handleItemChange,
  handleDeleteRow,
  handleAddRow,
  variants,
  type = 'input', // 'input' for import, 'output' for export
  partners,
  addWarehouseSlip,
  addPartner,
  addWarehouse,
  onCloseStock,
  filter
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openAddWarehouse, setOpenAddWarehouse] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (
      warehouses.length > 0 &&
      (!newSlipData.warehouseId || newSlipData.warehouseId === '')
    ) {
      handleChange('warehouseId')({
        target: { value: warehouses[0]._id }
      })
    }
  }, [warehouses, newSlipData.warehouseId])

  // Sửa lỗi: Đặt openAddWarehouse thành true để mở Chart
  const handleOpenAddWarehouse = () => {
    setOpenAddWarehouse(true)
  }

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false)
  }

  if (!newSlipData) {
    console.warn('newSlipData is undefined')
    return null
  }

  const normalizeVietnamese = (str = '') => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
  }

  const filterVariantsBySkuAndName = (searchText) => {
    if (!variants || !Array.isArray(variants)) {
      console.warn('variants is undefined or not an array', { variants })
      return []
    }
    const searchNormalized = normalizeVietnamese(searchText)
    return variants
      .filter((variant) => !variant.destroy) // Lọc bỏ variant có destroy: true
      .map((variant) => ({
        _id: variant._id,
        sku: variant.sku,
        name: `${variant.sku || ''} - ${variant.name || ''}`
      }))
      .filter((item) =>
        normalizeVietnamese(item.name).includes(searchNormalized)
      )
  }

  const getSkuFromVariantId = (variantId) => {
    if (!variantId || !variants || !Array.isArray(variants)) return ''
    const variant = variants.find((v) => v._id === variantId)
    return variant ? variant.sku : ''
  }

  const onSubmit = async () => {
    // Hàm kiểm tra dữ liệu đầu vào
    const validateForm = () => {
      if (!newSlipData) {
        setErrorMessage('Dữ liệu phiếu nhập kho không hợp lệ!')
        return false
      }
      if (!newSlipData.date) {
        setErrorMessage('Vui lòng chọn ngày nhập kho!')
        return false
      }
      if (!newSlipData.warehouseId) {
        setErrorMessage('Vui lòng chọn kho nhập hàng!')
        return false
      }
      if (!newSlipData.partnerId) {
        setErrorMessage('Vui lòng chọn đối tác!')
        return false
      }
      if (!items || items.length === 0) {
        setErrorMessage('Vui lòng thêm ít nhất một sản phẩm!')
        return false
      }

      const hasMissingVariant = items.some((item) => !item.variantId)
      const hasMissingQuantity = items.some(
        (item) =>
          item.quantity === undefined ||
          item.quantity === null ||
          item.quantity === ''
      )
      const hasInvalidQuantity = items.some(
        (item) => Number(item.quantity) <= 0
      )

      if (hasMissingVariant) {
        setErrorMessage('Vui lòng chọn biến thể sản phẩm!')
        return false
      }

      if (hasMissingQuantity) {
        setErrorMessage('Vui lòng nhập số lượng sản phẩm!')
        return false
      }

      if (hasInvalidQuantity) {
        setErrorMessage('Số lượng sản phẩm phải lớn hơn 0!')
        return false
      }

      // Kiểm tra biến thể có destroy: true
      if (
        variants &&
        items.some((item) => {
          const variant = variants.find((v) => v._id === item.variantId)
          return variant && variant.destroy === true
        })
      ) {
        setErrorMessage('Một hoặc nhiều biến thể đã bị xóa (destroy: true)!')
        return false
      }
      return true
    }

    // Kiểm tra dữ liệu trước khi gửi
    if (!validateForm()) {
      setSnackbarOpen(true)
      return
    }

    try {
      const formattedData = {
        type: type === 'input' ? 'import' : 'export',
        date: new Date(newSlipData.date).toISOString(),
        partnerId: newSlipData.partnerId,
        warehouseId: newSlipData.warehouseId,
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: parseInt(item.quantity),
          unit: item.unit || 'cái'
        })),
        note: newSlipData.note || ''
      }
      await addWarehouseSlip(formattedData, filter)

      setSnackbarOpen(true)
      if (onCloseStock) onCloseStock('updated')
      onClose()
      setSnackbarOpen(false) // 🛠 reset
      setErrorMessage('') // 🛠 reset
    } catch (error) {
      setErrorMessage(
        `Lỗi khi tạo phiếu ${type === 'input' ? 'nhập' : 'xuất'} kho: ${error.message}`
      )
      setSnackbarOpen(false)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={customVi}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth='xl'
        fullWidth
        sx={{
          '& .MuiDialog-container': { alignItems: 'end' },
          '& .MuiDialog-paper': {
            maxHeight: '96%',
            height: '96%',
            mt: 0,
            mb: 2.4
          }
        }}
        BackdropProps={{
          sx: StyleAdmin.OverlayModal
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'start',
            flexDirection: 'column',
            mb: '20px'
          }}
        >
          <DialogTitle
            sx={{ fontWeight: 600, fontSize: 20, padding: '20px 0 0 24px' }}
          >
            {type === 'input' ? 'Tạo phiếu nhập kho' : 'Tạo phiếu xuất kho'}
          </DialogTitle>

          <DialogActions sx={{ padding: '8px 0 0 20px' }}>
            {/*{!isEditing && (*/}
            {/*  <Button*/}
            {/*    onClick={() => setIsEditing(true)}*/}
            {/*    sx={{ display: 'none', textTransform: 'none' }}*/}
            {/*  >*/}
            {/*    Sửa*/}
            {/*  </Button>*/}
            {/*)}*/}
            <Button
              onClick={onClose || onCloseStock}
              sx={{ textTransform: 'none' }}
              variant='outlined'
              color='error'
            >
              Hủy
            </Button>
            <Button
              variant='contained'
              color='success'
              onClick={onSubmit}
              sx={{
                backgroundColor: 'var(--primary-color)',
                color: '#fff',
                textTransform: 'none'
              }}
            >
              Duyệt & Hoàn thành
            </Button>
          </DialogActions>
        </Box>
        <Divider />
        <DialogContent>
          <Card variant='outlined' sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item size={4} sm={6} md={4}>
                  <DatePicker
                    sx={{ width: '100%' }}
                    label={
                      <>
                        Ngày tạo phiếu <span style={{ color: 'red' }}>*</span>
                      </>
                    }
                    value={newSlipData.date || null}
                    onChange={handleDateChange}
                    format='dd/MM/yyyy'
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: 'Chọn ngày tạo phiếu'
                      }
                    }}
                  />
                </Grid>
                <Grid item size={4} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id='warehouse-label'>
                      Kho {type === 'input' ? 'nhập' : 'xuất'} hàng{' '}
                      <span style={{ color: 'red' }}>*</span>
                    </InputLabel>
                    {warehouses.length > 0 ? (
                      <Select
                        labelid='warehouse-label'
                        label={
                          <>
                            Kho {type === 'input' ? 'nhập' : 'xuất'} hàng{' '}
                            <span style={{ color: 'red' }}>*</span>
                          </>
                        }
                        value={newSlipData.warehouseId || ''}
                        onChange={handleChange('warehouseId')}
                      >
                        {warehouses.map((warehouse) => (
                          <MenuItem key={warehouse._id} value={warehouse._id}>
                            {warehouse.name}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <Select
                        label='Kho hàng'
                        value=''
                        onChange={handleChange('warehouseId')}
                      >
                        <MenuItem onClick={handleOpenAddWarehouse}>
                          Thêm kho
                        </MenuItem>
                      </Select>
                    )}
                  </FormControl>
                </Grid>
                <Grid item size={4} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id='partner-label'>
                      Đối tác <span style={{ color: 'red' }}>*</span>
                    </InputLabel>
                    <Select
                      labelId='partner-label'
                      label={
                        <>
                          Đối tác <span style={{ color: 'red' }}>*</span>
                        </>
                      }
                      value={newSlipData.partnerId || ''}
                      onChange={handleChange('partnerId')}
                    >
                      {partners.map((partner) => (
                        <MenuItem key={partner._id} value={partner._id}>
                          {partner.name}
                        </MenuItem>
                      ))}
                      <MenuItem onClick={() => setOpenAddDialog(true)}>
                        Thêm đối tác
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={12}>
                  <TextField
                    label='Ghi chú'
                    value={newSlipData.note || ''}
                    onChange={handleChange('note')}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </CardContent>
            {isEditing && (
              <Box mt={2} display='flex' justifyContent='flex-end'>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => setIsEditing(false)}
                >
                  Lưu
                </Button>
                <Button sx={{ ml: 1 }} onClick={() => setIsEditing(false)}>
                  Hủy
                </Button>
              </Box>
            )}
          </Card>
          <Paper variant='outlined'>
            <Box p={2} sx={{ minHeight: '295px' }}>
              <Typography fontWeight={600} mb={1}>
                Danh sách sản phẩm {type === 'input' ? 'nhập' : 'xuất'}
              </Typography>
              <TableContainer
                sx={{ minHeight: '288px', overflow: 'auto', zIndex: 0 }}
              >
                <Table stickyHeader size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: 60,
                          textAlign: 'center',
                          backgroundColor: 'transparent'
                        }}
                      >
                        STT
                      </TableCell>
                      <TableCell sx={{ backgroundColor: 'transparent' }}>
                        Tên sản phẩm
                      </TableCell>
                      <TableCell sx={{ backgroundColor: 'transparent' }}>
                        SL {type === 'input' ? 'nhập' : 'xuất'}
                      </TableCell>
                      <TableCell sx={{ backgroundColor: 'transparent' }}>
                        Đơn vị
                      </TableCell>
                      <TableCell sx={{ backgroundColor: 'transparent' }}>
                        Thao tác
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ width: 60, textAlign: 'center' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell sx={{ position: 'relative', minWidth: 200 }}>
                          <Search
                            data={filterVariantsBySkuAndName}
                            onSelect={(selectedVariantId) =>
                              handleItemChange(
                                index,
                                'variantId'
                              )({
                                target: { value: selectedVariantId }
                              })
                            }
                            searchText={
                              getSkuFromVariantId(item.variantId) || ''
                            }
                            setSearchText={(value) =>
                              handleItemChange(
                                index,
                                'variantId'
                              )({
                                target: { value }
                              })
                            }
                            placeholder='Tìm theo SKU hoặc tên...'
                            index={index}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 100 }}>
                          <TextField
                            type='number'
                            value={item.quantity || ''}
                            onChange={handleItemChange(index, 'quantity')}
                            fullWidth
                            size='small'
                            inputProps={{ min: 0 }}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 100 }}>
                          <TextField
                            value={item.unit || 'cái'}
                            onChange={handleItemChange(index, 'unit')}
                            fullWidth
                            size='small'
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, width: 100 }}>
                          <Tooltip title='Xoá'>
                            <IconButton
                              sx={{ ml: -1.6 }}
                              onClick={() => handleDeleteRow(index)}
                            >
                              <DeleteIcon color='error' />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </DialogContent>
        <Box
          display='flex'
          justifyContent='space-between'
          sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0' }}
        >
          <Button
            variant='outlined'
            onClick={handleAddRow}
            sx={{
              color: 'var(--primary-color)',
              textTransform: 'none'
            }}
          >
            + Thêm dòng
          </Button>
          <Box display='flex' gap={3} alignItems='center'>
            <Typography variant='body2'>Tổng dòng: {items.length}</Typography>
            <Typography variant='body2'>
              Tổng SL:{' '}
              {items.reduce(
                (sum, item) => sum + (parseInt(item.quantity) || 0),
                0
              )}
            </Typography>
          </Box>
        </Box>
        <AddPartnerModal
          open={openAddDialog}
          onClose={handleCloseAddDialog}
          onSave={addPartner}
        />
        <AddWarehouseModal
          open={openAddWarehouse}
          onClose={() => setOpenAddWarehouse(false)}
          Add={addWarehouse}
        />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => {
            setSnackbarOpen(false)
            setErrorMessage('')
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => {
              setSnackbarOpen(false)
              setErrorMessage('')
            }}
            severity={errorMessage.includes('thành công') ? 'success' : 'error'}
            sx={{ width: '100%', fontSize: '0.9rem' }}
            elevation={6}
            variant='filled'
          >
            {errorMessage || 'Đã xảy ra lỗi, vui lòng thử lại!'}
          </Alert>
        </Snackbar>
      </Dialog>
    </LocalizationProvider>
  )
}
