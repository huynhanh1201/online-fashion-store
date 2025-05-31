import React, { useState } from 'react'
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
  MenuItem
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import DeleteIcon from '@mui/icons-material/Delete'
import Search from '~/components/SearchAdmin/Search.jsx' // Adjust the import path as needed

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
  handleAdd
}) {
  const [isEditing, setIsEditing] = useState(false)

  // Safeguard against undefined newSlipData
  if (!newSlipData) {
    console.warn('newSlipData is undefined')
    return null
  }

  // Normalize Vietnamese for search
  const normalizeVietnamese = (str = '') => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
  }

  // Filter variants based on sku and name
  const filterVariantsBySkuAndName = (searchText) => {
    if (!variants || !Array.isArray(variants)) {
      console.warn('variants is undefined or not an array', { variants })
      return []
    }

    const searchNormalized = normalizeVietnamese(searchText)
    return variants
      .map((variant) => ({
        _id: variant._id,
        sku: variant.sku,
        name: `${variant.sku || ''} - ${variant.name || ''}`
      }))
      .filter((item) =>
        normalizeVietnamese(item.name).includes(searchNormalized)
      )
  }

  // Helper to get SKU from variantId
  const getSkuFromVariantId = (variantId) => {
    if (!variantId || !variants || !Array.isArray(variants)) return ''
    const variant = variants.find((v) => v._id === variantId)
    return variant ? variant.sku : ''
  }

  // Modified handleAdd to match the desired JSON structure
  const onSubmit = async () => {
    const formattedData = {
      type: type === 'input' ? 'import' : 'export',
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
    await handleAdd(formattedData)
    onClose()
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth='xl'
        fullWidth
        sx={{ maxHeight: '95vh', marginTop: '60px' }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <DialogTitle
            sx={{ fontWeight: 600, fontSize: 20, padding: '20px 0 0 24px' }}
          >
            {type === 'input' ? 'Nhập kho' : 'Xuất kho'} – Tạo phiếu mới
          </DialogTitle>
          <DialogActions sx={{ padding: '20px 24px 0 0' }}>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                sx={{ display: 'none' }}
              >
                Sửa
              </Button>
            )}
            <Button onClick={onClose}>Hủy</Button>
            <Button variant='contained' color='success' onClick={onSubmit}>
              Duyệt & Hoàn thành
            </Button>
          </DialogActions>
        </Box>

        <DialogContent>
          <Card variant='outlined' sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item size={12} sm={6} md={4}>
                  <DatePicker
                    sx={{ width: '100%' }}
                    label='Ngày nhập'
                    value={newSlipData.date || null}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
                  />
                </Grid>
                <Grid item size={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Kho nhập hàng</InputLabel>
                    <Select
                      value={newSlipData.warehouseId || ''}
                      onChange={handleChange('warehouseId')}
                    >
                      <MenuItem value=''>Chọn kho</MenuItem>
                      {warehouses.map((warehouse) => (
                        <MenuItem key={warehouse._id} value={warehouse._id}>
                          {warehouse.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Nhà cung cấp</InputLabel>
                    <Select
                      value={newSlipData.partnerId || ''}
                      onChange={handleChange('partnerId')}
                    >
                      <MenuItem value=''>Chọn nhà cung cấp</MenuItem>
                      {partners.map((partner) => (
                        <MenuItem key={partner._id} value={partner._id}>
                          {partner.name}
                        </MenuItem>
                      ))}
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
          <Paper variant='outlined' sx={{ mb: 3 }}>
            <Box p={2} sx={{ minHeight: '350px' }}>
              <Typography fontWeight={600} mb={1}>
                Danh sách sản phẩm {type === 'input' ? 'nhập' : 'xuất'}
              </Typography>
              <TableContainer
                sx={{ minHeight: '350px', overflow: 'auto', zIndex: 0 }}
              >
                <Table stickyHeader size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Variant</TableCell>
                      <TableCell>
                        SL {type === 'input' ? 'nhập' : 'xuất'}
                      </TableCell>
                      <TableCell>Đơn vị</TableCell>
                      <TableCell>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
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
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 100 }}>
                          <TextField
                            value={'cái'}
                            onChange={handleItemChange(index, 'unit')}
                            fullWidth
                            size='small'
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 100 }}>
                          <IconButton onClick={() => handleDeleteRow(index)}>
                            <DeleteIcon color='error' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box display='flex' justifyContent='space-between' mt={2}>
                <Button variant='outlined' onClick={handleAddRow}>
                  + Thêm dòng
                </Button>
                <Box display='flex' gap={3}>
                  <Typography variant='body2'>
                    Tổng dòng: {items.length}
                  </Typography>
                  <Typography variant='body2'>
                    Tổng SL:{' '}
                    {items.reduce(
                      (sum, item) => sum + (parseInt(item.quantity) || 0),
                      0
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  )
}
