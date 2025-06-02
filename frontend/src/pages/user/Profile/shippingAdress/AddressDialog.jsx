import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete
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
  onSave
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
          helperText={formErrors.phone ? 'Số điện thoại phải là 10 chữ số' : ''}
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
