import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import { Box, Typography, Stack, Avatar } from '@mui/material'

const ViewInventoryModal = ({ open, onClose, inventory }) => {
  if (!inventory) return null

  const {
    productId,
    variant,
    quantity,
    importPrice,
    exportPrice,
    minQuantity,
    status,
    variant: { color, size, sku }
  } = inventory

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Xem thông tin biến thể kho</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <form id='view-inventory-form'>
          <TextField
            label='Tên sản phẩm (ID)'
            fullWidth
            margin='normal'
            defaultValue={productId}
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />

          <Stack direction='row' spacing={2} alignItems='center'>
            <Box sx={{ width: '100%' }}>
              <TextField
                label='Màu sắc'
                fullWidth
                margin='normal'
                defaultValue={color?.name}
                InputProps={{ readOnly: true }}
                sx={{
                  ...StyleAdmin.InputCustom,
                  ...StyleAdmin.InputCustom.CursorNone
                }}
              />
            </Box>
            {color?.image && (
              <Avatar
                src={color.image}
                alt={color.name}
                sx={{ width: 56, height: 56, mt: 2 }}
              />
            )}
          </Stack>

          <TextField
            label='Kích thước'
            fullWidth
            margin='normal'
            defaultValue={size?.name}
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />

          <TextField
            label='SKU (Mã biến thể)'
            fullWidth
            margin='normal'
            defaultValue={sku}
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />

          <TextField
            label='Số lượng'
            fullWidth
            margin='normal'
            defaultValue={quantity}
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />

          <TextField
            label='Giá nhập'
            fullWidth
            margin='normal'
            defaultValue={importPrice}
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />

          <TextField
            label='Giá bán'
            fullWidth
            margin='normal'
            defaultValue={exportPrice}
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />

          <TextField
            label='Ngưỡng cảnh báo (min qty)'
            fullWidth
            margin='normal'
            defaultValue={minQuantity}
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />

          <TextField
            label='Trạng thái'
            fullWidth
            margin='normal'
            defaultValue={status}
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone
            }}
          />
        </form>
      </DialogContent>
      <Divider sx={{ my: 0 }} />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color='error' variant='contained'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewInventoryModal
