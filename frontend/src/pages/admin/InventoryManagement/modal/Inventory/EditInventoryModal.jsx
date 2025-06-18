// modal/Inventory/EditInventoryModal.jsx
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material'
import { toast } from 'react-toastify'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
const EditInventoryModal = ({
  open,
  onClose,
  inventory,
  onSave,
  formatCurrency,
  parseCurrency
}) => {
  const [formData, setFormData] = useState({
    minQuantity: 0,
    importPrice: 0,
    exportPrice: 0,
    status: 'in-stock',
    text: 'không'
  })

  useEffect(() => {
    if (inventory) {
      setFormData({
        minQuantity: Number(inventory.minQuantity ?? 0),
        importPrice: Number(inventory.importPrice ?? 0),
        exportPrice: Number(inventory.exportPrice ?? 0),
        status: inventory.status ?? 'in-stock',
        text: 'có'
      })
    }
  }, [inventory])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'minQuantity' ||
        name === 'importPrice' ||
        name === 'exportPrice'
          ? Number(value) || 0 // Chuyển đổi sang số, mặc định 0 nếu giá trị không hợp lệ
          : value // Giữ nguyên cho status
    }))
  }

  const handleSubmit = async () => {
    // Kiểm tra dữ liệu trước khi gửi
    const payload = {
      minQuantity: Number(formData.minQuantity),
      importPrice: Number(formData.importPrice),
      exportPrice: Number(formData.exportPrice),
      status: formData.status
    }

    try {
      await onSave(payload, 'edit', inventory._id)
      toast.success('Cập nhật tồn kho thành công')
      onClose()
    } catch {
      toast.error('Cập nhật tồn kho thất bại')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Sửa thông tin tồn kho</DialogTitle>
      <Divider />
      <DialogContent>
        <TextField
          margin='dense'
          label='Ngưỡng cảnh báo'
          name='minQuantity'
          type='number'
          value={formData.minQuantity}
          onChange={handleChange}
          fullWidth
          inputProps={{ min: 0 }} // Ngăn nhập số âm
        />
        <TextField
          margin='dense'
          label='Giá nhập'
          name='importPrice'
          type='text'
          value={formatCurrency(formData.importPrice)}
          onChange={(e) =>
            handleChange({
              target: {
                name: 'importPrice',
                value: parseCurrency(e.target.value)
              }
            })
          }
          fullWidth
          inputProps={{ inputMode: 'numeric' }} // Gợi ý bàn phím số trên di động
        />

        <TextField
          margin='dense'
          label='Giá bán'
          name='exportPrice'
          type='text'
          value={formatCurrency(formData.exportPrice)}
          onChange={(e) =>
            handleChange({
              target: {
                name: 'exportPrice',
                value: parseCurrency(e.target.value)
              }
            })
          }
          fullWidth
          inputProps={{ inputMode: 'numeric' }}
        />
        <FormControl fullWidth margin='dense'>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            name='status'
            value={formData.status}
            onChange={handleChange}
            label='Trạng thái'
          >
            <MenuItem value='in-stock'>Còn hàng</MenuItem>
            <MenuItem value='low-stock'>Cảnh báo</MenuItem>
            <MenuItem value='out-of-stock'>Hết hàng</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          color='error'
          variant='outlined'
          sx={{ textTransform: 'none' }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#001f5d',
            color: '#fff',
            textTransform: 'none'
          }}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditInventoryModal
