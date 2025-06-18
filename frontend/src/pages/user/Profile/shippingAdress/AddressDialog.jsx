import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Typography
} from '@mui/material'

function AddressDialog({
  open,
  onClose,
  editAddressId,
  formData,
  formErrors,
  provinces,
  districts,
  wards,
  onFormChange,
  onSave,
  duplicateError
}) {
  return (
    <Dialog
      style={{ marginTop: '100px' }}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>
        {editAddressId ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
      </DialogTitle>
      <DialogContent>
        {/* Hiển thị lỗi trùng địa chỉ nếu có */}
        {duplicateError && (
          <Typography color="error" sx={{ mb: 2, fontWeight: 500 }}>
            {duplicateError}
          </Typography>
        )}
        <TextField
          margin='dense'
          label='Họ và tên'
          fullWidth
          value={formData.fullName}
          onChange={(e) => onFormChange('fullName', e.target.value)}
          error={formErrors.fullName}
          helperText={formErrors.fullName ? 'Tên phải có ít nhất 3 ký tự' : ''}
        />
        <TextField
          margin='dense'
          label='Số điện thoại'
          fullWidth
          value={formData.phone}
          onChange={(e) => onFormChange('phone', e.target.value)}
          error={formErrors.phone}
          // Cho phép nhập nhiều loại số điện thoại, helperText chỉ báo lỗi nếu có
          helperText={formErrors.phone ? 'Vui lòng nhập số điện thoại hợp lệ' : ''}
          placeholder="VD: 0912345678, (028) 38234567"
        />
        <Autocomplete
          options={provinces}
          getOptionLabel={(option) => option.name || ''}
          value={provinces.find((p) => p.code === formData.city) || null}
          onChange={(event, newValue) => {
            onFormChange('city', newValue ? newValue.code : '')
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              margin='dense'
              label='Tỉnh/Thành phố'
              error={formErrors.city}
              helperText={formErrors.city ? 'Vui lòng chọn tỉnh/thành' : ''}
            />
          )}
          fullWidth
        />
        <Autocomplete
          options={districts}
          getOptionLabel={(option) => option.name || ''}
          value={districts.find((d) => d.code === formData.district) || null}
          onChange={(event, newValue) => {
            onFormChange('district', newValue ? newValue.code : '')
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              margin='dense'
              label='Quận/Huyện'
              error={formErrors.district}
              helperText={formErrors.district ? 'Vui lòng chọn quận/huyện' : ''}
              disabled={!formData.city}
            />
          )}
          fullWidth
          disabled={!formData.city}
        />
        <Autocomplete
          options={wards}
          getOptionLabel={(option) => option.name || ''}
          value={wards.find((w) => w.code === formData.ward) || null}
          onChange={(event, newValue) => {
            onFormChange('ward', newValue ? newValue.code : '')
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              margin='dense'
              label='Phường/Xã'
              error={formErrors.ward}
              helperText={formErrors.ward ? 'Vui lòng chọn phường/xã' : ''}
              disabled={!formData.district}
            />
          )}
          fullWidth
          disabled={!formData.district}
        />
        <TextField
          margin='dense'
          label='Số nhà, tên đường'
          fullWidth
          value={formData.address}
          onChange={(e) => onFormChange('address', e.target.value)}
          error={formErrors.address}
          helperText={
            formErrors.address
              ? 'Số nhà, tên đường phải có ít nhất 5 ký tự'
              : ''
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Hủy
        </Button>
        <Button
          onClick={onSave}
          variant='contained'
          sx={{ textTransform: 'none' }}
          disabled={
            !formData.fullName ||
            !formData.phone ||
            !formData.address ||
            !formData.city ||
            !formData.district ||
            !formData.ward ||
            formErrors.fullName ||
            formErrors.phone ||
            formErrors.address
          }
        >
          {editAddressId ? 'Lưu' : 'Thêm'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddressDialog
