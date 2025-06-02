// modal/Inventory/EditInventoryModal.jsx
import React, { useState } from 'react'
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
  InputLabel
} from '@mui/material'
import { toast } from 'react-toastify'

const EditInventoryModal = ({ open, onClose, inventory, onSave }) => {
  const [formData, setFormData] = useState(
    inventory
      ? {
          minQuantity: Number(inventory.minQuantity), // Đảm bảo số
          importPrice: Number(inventory.importPrice), // Đảm bảo số
          exportPrice: Number(inventory.exportPrice), // Đảm bảo số
          status: inventory.status
        }
      : {
          minQuantity: 0,
          importPrice: 0,
          exportPrice: 0,
          status: 'in-stock'
        }
  )

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
      await onSave(inventory._id, payload)
      toast.success('Cập nhật tồn kho thành công')
      onClose()
    } catch {
      toast.error('Cập nhật tồn kho thất bại')
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cập nhật tồn kho</DialogTitle>
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
          type='number'
          value={formData.importPrice}
          onChange={handleChange}
          fullWidth
          inputProps={{ min: 0 }} // Ngăn nhập số âm
        />
        <TextField
          margin='dense'
          label='Giá bán'
          name='exportPrice'
          type='number'
          value={formData.exportPrice}
          onChange={handleChange}
          fullWidth
          inputProps={{ min: 0 }} // Ngăn nhập số âm
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
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit}>Lưu</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditInventoryModal
