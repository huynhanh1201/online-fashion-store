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
  batches,
  handleChange,
  handleDateChange,
  handleAdd,
  warehouses,
  items,
  handleItemChange,
  handleDeleteRow,
  handleAddRow,
  variants,
  warehouseSlips,
  type = 'input' // Default to 'input' if not provided
}) {
  const [isEditing, setIsEditing] = useState(false) // State to toggle edit mode

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
        _id: variant.id,
        sku: variant.sku,
        name: `${variant.sku || ''} - ${variant.name || ''}`
      }))
      .filter((item) =>
        normalizeVietnamese(item.name).includes(searchNormalized)
      )
  }

  // Filter batches (lots) based on batchCode
  const filterLotsByBatchCode = (searchText, itemIndex) => {
    if (!batches || !Array.isArray(batches)) {
      console.warn('batches is undefined or not an array', { batches })
      return []
    }

    const searchNormalized = normalizeVietnamese(searchText)
    return batches
      .filter((batch) =>
        normalizeVietnamese(batch.batchCode || '').includes(searchNormalized)
      )
      .map((batch) => ({ _id: batch.id, name: batch.batchCode }))
  }

  // Helper to get SKU from variantId
  const getSkuFromVariantId = (variantId) => {
    if (!variantId || !variants || !Array.isArray(variants)) return ''
    const variant = variants.find((v) => v.id === variantId)
    return variant ? variant.sku : ''
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
            <Button variant='contained' color='success' onClick={handleAdd}>
              Duyệt & Hoàn thành
            </Button>
          </DialogActions>
        </Box>

        <DialogContent>
          <Card variant='outlined' sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item size={10} sm={4} md={3}>
                  <TextField
                    label='Mã phiếu'
                    value={newSlipData.slipId || ''}
                    onChange={handleChange('slipId')}
                    fullWidth
                  />
                </Grid>
                <Grid item size={2} sm={4} md={3}>
                  <DatePicker
                    label='Ngày nhập'
                    value={newSlipData.date || null}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
                  />
                </Grid>
                <Grid item size={12} sm={4} md={3} sx={{ display: 'none' }}>
                  <FormControl fullWidth>
                    <InputLabel>Lãi phiếu</InputLabel>
                    <Select
                      value={
                        newSlipData.profitType ||
                        (type === 'input' ? 'Import' : 'Export')
                      }
                      onChange={handleChange('profitType')}
                    >
                      {!isEditing ? (
                        <MenuItem
                          value={type === 'input' ? 'Import' : 'Export'}
                        >
                          {type === 'input' ? 'Import' : 'Export'}
                        </MenuItem>
                      ) : (
                        <>
                          <MenuItem value='Import'>Import</MenuItem>
                          <MenuItem value='Export'>Export</MenuItem>
                        </>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={1}>
                <Grid item size={4} sm={4} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Kho nhập hàng</InputLabel>
                    <Select
                      value={newSlipData.warehouseId || ''}
                      onChange={handleChange('warehouseId')}
                    >
                      <MenuItem value=''>Chọn kho</MenuItem>
                      {warehouses.map((warehouse) => (
                        <MenuItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={4} sm={4} md={3}>
                  <TextField
                    label='Mã đối tác'
                    value={newSlipData.partnerCode || ''}
                    onChange={handleChange('partnerCode')}
                    fullWidth
                  />
                </Grid>
                <Grid item size={4} sm={4} md={3}>
                  <TextField
                    label='Tên đối tác'
                    value={newSlipData.partnerName || ''}
                    onChange={handleChange('partnerName')}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid item size={12} mt={2}>
                <TextField
                  label='Ghi chú'
                  value={newSlipData.note || ''}
                  onChange={handleChange('note')}
                  fullWidth
                  multiline
                  rows={3}
                />
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
            <Box p={2} sx={{ minHeight: '372px' }}>
              <Typography fontWeight={600} mb={1}>
                Danh sách sản phẩm {type === 'input' ? 'nhập' : 'xuất'}
              </Typography>
              <TableContainer
                sx={{ minHeight: '300px', overflow: 'auto', zIndex: 0 }}
              >
                <Table stickyHeader size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Variant</TableCell>
                      <TableCell>Lô</TableCell>
                      <TableCell>
                        SL {type === 'input' ? 'nhập' : 'xuất'}
                      </TableCell>
                      <TableCell>Đơn vị</TableCell>
                      <TableCell>Ghi chú</TableCell>
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
                            index={index} // Pass the row index
                          />
                        </TableCell>
                        <TableCell sx={{ position: 'relative', minWidth: 200 }}>
                          <Search
                            data={(searchText) =>
                              filterLotsByBatchCode(searchText, index)
                            }
                            onSelect={(selectedLot) =>
                              handleItemChange(
                                index,
                                'lot'
                              )({
                                target: { value: selectedLot }
                              })
                            }
                            searchText={item.lot || ''}
                            setSearchText={(value) =>
                              handleItemChange(
                                index,
                                'lot'
                              )({
                                target: { value }
                              })
                            }
                            placeholder='Tìm theo mã lô...'
                            index={index} // Pass the row index
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
                            value={item.unit || 'pcs'}
                            disabled
                            fullWidth
                            size='small'
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 150 }}>
                          <TextField
                            value={item.note || ''}
                            onChange={handleItemChange(index, 'note')}
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
