import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  MenuItem
} from '@mui/material'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import { useForm } from 'react-hook-form'

const EditInventoryModal = ({ open, onClose, inventory, onSave }) => {
  const { register, handleSubmit, reset } = useForm()
  // Reset dữ liệu form mỗi khi inventory thay đổi
  React.useEffect(() => {
    if (inventory) {
      reset({
        importPrice: inventory.importPrice ?? 0,
        exportPrice: inventory.exportPrice ?? 0,
        minQuantity: inventory.minQuantity ?? 0,
        status: inventory.status ?? 'in-stock'
      })
    }
  }, [inventory, reset])

  const onSubmit = async (data) => {
    try {
      if (
        data.importPrice < 0 ||
        data.exportPrice < 0 ||
        data.minQuantity < 0
      ) {
        alert('Giá và số lượng không được nhỏ hơn 0')
        return
      }

      const updatedInventory = {
        importPrice: Number(data.importPrice),
        exportPrice: Number(data.exportPrice),
        minQuantity: Number(data.minQuantity),
        status: data.status
      }

      const result = await onSave(inventory._id, updatedInventory) // GỌI HÀM ĐÚNG

      if (result) {
        onClose() // Đóng modal
        reset() // Reset form
      } else {
        alert('Cập nhật kho không thành công')
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật kho:', error)
      alert('Có lỗi xảy ra, vui lòng thử lại')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      BackdropProps={{ sx: StyleAdmin.OverlayModal }}
    >
      <DialogTitle>Chỉnh sửa thông tin kho</DialogTitle>
      <Divider />
      <DialogContent>
        <form id='edit-inventory-form' onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label='Giá nhập'
            type='number'
            fullWidth
            margin='normal'
            {...register('importPrice')}
          />
          <TextField
            label='Giá bán'
            type='number'
            fullWidth
            margin='normal'
            {...register('exportPrice')}
          />
          <TextField
            label='Ngưỡng cảnh báo'
            type='number'
            fullWidth
            margin='normal'
            {...register('minQuantity')}
          />
          <TextField
            label='Trạng thái'
            select
            fullWidth
            margin='normal'
            {...register('status')}
            defaultValue='in-stock' // fallback nếu inventory chưa sẵn sàng
          >
            <MenuItem value='in-stock'>Còn hàng</MenuItem>
            <MenuItem value='out-of-stock'>Hết hàng</MenuItem>
            <MenuItem value='discontinued'>Ngừng bán</MenuItem>
          </TextField>
        </form>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} color='error'>
          Hủy
        </Button>
        <Button type='submit' form='edit-inventory-form' variant='contained'>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditInventoryModal
