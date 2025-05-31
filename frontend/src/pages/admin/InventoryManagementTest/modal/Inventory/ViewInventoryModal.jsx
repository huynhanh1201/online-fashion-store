// modal/Inventory/ViewInventoryModal.jsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip
} from '@mui/material'

const ViewInventoryModal = ({
  open,
  onClose,
  inventory,
  variants,
  warehouses
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chi tiết tồn kho</DialogTitle>
      <DialogContent>
        {inventory && (
          <>
            <Typography>
              <strong>ID:</strong> {inventory.id}
            </Typography>
            <Typography>
              <strong>Biến thể:</strong>{' '}
              {variants.find((v) => v._id === inventory.variantId)?.name ||
                'N/A'}
            </Typography>
            <Typography>
              <strong>Kho:</strong>{' '}
              {warehouses.find((w) => w._id === inventory.warehouseId)?.name ||
                'N/A'}
            </Typography>
            <Typography>
              <strong>Số lượng:</strong> {inventory.quantity}
            </Typography>
            <Typography>
              <strong>Ngưỡng cảnh báo:</strong> {inventory.minQuantity}
            </Typography>
            <Typography>
              <strong>Giá nhập:</strong>{' '}
              {inventory.importPrice.toLocaleString()}đ
            </Typography>
            <Typography>
              <strong>Giá bán:</strong> {inventory.exportPrice.toLocaleString()}
              đ
            </Typography>
            <Typography>
              <strong>Ngày tạo:</strong>{' '}
              {new Date(inventory.createdAt).toLocaleString('vi-VN')}
            </Typography>
            <Typography>
              <strong>Ngày cập nhật:</strong>{' '}
              {new Date(inventory.updatedAt).toLocaleString('vi-VN')}
            </Typography>
            <Typography>
              <strong>Trạng thái:</strong>
              <Chip
                label={
                  inventory.status === 'in-stock'
                    ? 'Còn hàng'
                    : inventory.status === 'low-stock'
                      ? 'Cảnh báo'
                      : 'Hết hàng'
                }
                color={
                  inventory.status === 'in-stock'
                    ? 'success'
                    : inventory.status === 'low-stock'
                      ? 'warning'
                      : 'error'
                }
                size='small'
              />
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewInventoryModal
