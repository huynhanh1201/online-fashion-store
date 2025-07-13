import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Typography,
  Alert,
  Box,
  Chip,
  FormHelperText,
  InputAdornment
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

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
  const [fieldErrors, setFieldErrors] = useState({})
  const [fieldTouched, setFieldTouched] = useState({})

  // Reset validation state when dialog opens
  useEffect(() => {
    if (open) {
      setFieldErrors({})
      setFieldTouched({})
    }
  }, [open])

  // Validation functions based on backend rules
  const validateFullName = (value) => {
    if (!value) return 'Họ và tên là bắt buộc'
    if (value.length < 3) return 'Họ và tên phải có ít nhất 3 ký tự'
    if (value.length > 100) return 'Họ và tên không được quá 100 ký tự'
    return ''
  }

  const validatePhone = (value) => {
    if (!value) return 'Số điện thoại là bắt buộc'
    if (!/^[0-9]{9,11}$/.test(value)) {
      return 'Số điện thoại phải có 9-11 chữ số'
    }
    return ''
  }

  const validateAddress = (value) => {
    if (!value) return 'Địa chỉ là bắt buộc'
    if (value.length < 5) return 'Địa chỉ phải có ít nhất 5 ký tự'
    if (value.length > 200) return 'Địa chỉ không được quá 200 ký tự'
    return ''
  }

  const validateLocation = (value, fieldName) => {
    if (!value) return `${fieldName} là bắt buộc`
    if (value.length < 2) return `${fieldName} phải có ít nhất 2 ký tự`
    if (value.length > 100) return `${fieldName} không được quá 100 ký tự`
    return ''
  }

  const validateLocationId = (value, fieldName) => {
    if (!value) return `${fieldName} ID là bắt buộc`
    if (value.length < 2) return `${fieldName} ID phải có ít nhất 2 ký tự`
    if (value.length > 100) return `${fieldName} ID không được quá 100 ký tự`
    return ''
  }

  // Update field errors when formData changes
  useEffect(() => {
    const newFieldErrors = {}
    
    // Validate each field
    newFieldErrors.fullName = validateFullName(formData.fullName)
    newFieldErrors.phone = validatePhone(formData.phone)
    newFieldErrors.address = validateAddress(formData.address)
    newFieldErrors.city = validateLocation(formData.city, 'Tỉnh/Thành phố')
    newFieldErrors.district = validateLocation(formData.district, 'Quận/Huyện')
    newFieldErrors.ward = validateLocation(formData.ward, 'Phường/Xã')
    newFieldErrors.cityId = validateLocationId(formData.cityId, 'Tỉnh/Thành phố')
    newFieldErrors.districtId = validateLocationId(formData.districtId, 'Quận/Huyện')
    newFieldErrors.wardId = validateLocationId(formData.wardId, 'Phường/Xã')

    setFieldErrors(newFieldErrors)
  }, [formData])

  // Handle field blur to mark as touched
  const handleFieldBlur = (fieldName) => {
    setFieldTouched(prev => ({ ...prev, [fieldName]: true }))
  }

  // Check if form is complete
  const isFormComplete = () => {
    return formData.fullName && 
           formData.phone && 
           formData.address && 
           formData.city && 
           formData.district && 
           formData.ward &&
           formData.cityId &&
           formData.districtId &&
           formData.wardId &&
           !formErrors.fullName &&
           !formErrors.phone &&
           !formErrors.address &&
           !formErrors.city &&
           !formErrors.district &&
           !formErrors.ward &&
           !formErrors.cityId &&
           !formErrors.districtId &&
           !formErrors.wardId &&
           !fieldErrors.fullName &&
           !fieldErrors.phone &&
           !fieldErrors.address &&
           !fieldErrors.city &&
           !fieldErrors.district &&
           !fieldErrors.ward &&
           !fieldErrors.cityId &&
           !fieldErrors.districtId &&
           !fieldErrors.wardId
  }

  // Get completion percentage
  const getCompletionPercentage = () => {
    const requiredFields = ['fullName', 'phone', 'address', 'city', 'district', 'ward']
    const completedFields = requiredFields.filter(field => 
      formData[field] && !formErrors[field] && !fieldErrors[field]
    )
    return Math.round((completedFields.length / requiredFields.length) * 100)
  }

  // Get field status for visual feedback
  const getFieldStatus = (fieldName) => {
    const hasError = formErrors[fieldName] || fieldErrors[fieldName]
    const hasValue = formData[fieldName]
    const isTouched = fieldTouched[fieldName]
    
    // Only show error if field has been touched or has a value
    if (hasError && (hasValue || isTouched)) return 'error'
    if (hasValue && !hasError) return 'success'
    return 'default'
  }

  // Get field helper text
  const getFieldHelperText = (fieldName) => {
    const hasError = formErrors[fieldName] || fieldErrors[fieldName]
    const hasValue = formData[fieldName]
    const isTouched = fieldTouched[fieldName]
    
    // Only show error message if field has been touched or has a value
    if (hasError && (hasValue || isTouched)) {
      return formErrors[fieldName] || fieldErrors[fieldName]
    }
    return ''
  }

  // Get field end adornment
  const getFieldEndAdornment = (fieldName) => {
    const status = getFieldStatus(fieldName)
    
    if (status === 'error') {
      return (
        <InputAdornment position="end">
          <ErrorIcon color="error" fontSize="small" />
        </InputAdornment>
      )
    }
    
    if (status === 'success') {
      return (
        <InputAdornment position="end">
          <CheckCircleOutlineIcon color="success" fontSize="small" />
        </InputAdornment>
      )
    }
    
    return null
  }

  return (
    <Dialog
      style={{ marginTop: '100px' }}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {editAddressId ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </Typography>
          <Chip 
            label={`${getCompletionPercentage()}% hoàn thành`}
            color={getCompletionPercentage() === 100 ? 'success' : 'default'}
            size="small"
            icon={getCompletionPercentage() === 100 ? <CheckCircleIcon /> : <InfoIcon />}
          />
        </Box>
      </DialogTitle>
      <DialogContent>

        {/* Hiển thị lỗi trùng địa chỉ nếu có */}
        {duplicateError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={500}>
              {duplicateError}
            </Typography>
          </Alert>
        )}

        <TextField
          margin='dense'
          label='Họ và tên'
          fullWidth
          value={formData.fullName}
          onChange={(e) => onFormChange('fullName', e.target.value)}
          onBlur={() => handleFieldBlur('fullName')}
          error={getFieldStatus('fullName') === 'error'}
          helperText={getFieldHelperText('fullName')}
          placeholder="Nhập họ và tên đầy đủ"
          InputProps={{
            endAdornment: getFieldEndAdornment('fullName')
          }}
        />
        <TextField
          margin='dense'
          label='Số điện thoại'
          fullWidth
          value={formData.phone}
          onChange={(e) => onFormChange('phone', e.target.value)}
          onBlur={() => handleFieldBlur('phone')}
          error={getFieldStatus('phone') === 'error'}
          helperText={getFieldHelperText('phone')}
          placeholder="VD: 0912345678"
          InputProps={{
            endAdornment: getFieldEndAdornment('phone'),
            inputProps: {
              maxLength: 11,
              pattern: '[0-9]*'
            }
          }}
        />
        <Autocomplete
          options={provinces}
          getOptionLabel={(option) => option.name || ''}
          value={provinces.find((p) => p.code === formData.city) || null}
          onChange={(event, newValue) => {
            onFormChange('city', newValue ? newValue.code : '')
            onFormChange('cityId', newValue ? newValue.code : '')
            onFormChange('district', '')
            onFormChange('districtId', '')
            onFormChange('ward', '')
            onFormChange('wardId', '')
            setFieldTouched(prev => ({ ...prev, city: true }))
          }}
          onBlur={() => handleFieldBlur('city')}
          renderInput={(params) => (
            <TextField
              {...params}
              margin='dense'
              label='Tỉnh/Thành phố'
              error={getFieldStatus('city') === 'error'}
              helperText={getFieldHelperText('city')}
              placeholder="Chọn tỉnh/thành phố"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {getFieldEndAdornment('city')}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
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
            onFormChange('districtId', newValue ? newValue.code : '')
            onFormChange('ward', '')
            onFormChange('wardId', '')
            setFieldTouched(prev => ({ ...prev, district: true }))
          }}
          onBlur={() => handleFieldBlur('district')}
          renderInput={(params) => (
            <TextField
              {...params}
              margin='dense'
              label='Quận/Huyện'
              error={getFieldStatus('district') === 'error'}
              helperText={getFieldHelperText('district')}
              placeholder="Chọn quận/huyện"
              disabled={!formData.city}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {getFieldEndAdornment('district')}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
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
            onFormChange('wardId', newValue ? newValue.code : '')
            setFieldTouched(prev => ({ ...prev, ward: true }))
          }}
          onBlur={() => handleFieldBlur('ward')}
          renderInput={(params) => (
            <TextField
              {...params}
              margin='dense'
              label='Phường/Xã'
              error={getFieldStatus('ward') === 'error'}
              helperText={getFieldHelperText('ward')}
              placeholder="Chọn phường/xã"
              disabled={!formData.district}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {getFieldEndAdornment('ward')}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
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
          onBlur={() => handleFieldBlur('address')}
          error={getFieldStatus('address') === 'error'}
          helperText={getFieldHelperText('address')}
          placeholder="VD: 123 Đường ABC, Phường XYZ"
          InputProps={{
            endAdornment: getFieldEndAdornment('address')
          }}
        />

        {/* Additional information */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Lưu ý:</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            • Địa chỉ sẽ được sử dụng làm địa chỉ giao hàng mặc định
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Bạn có thể thêm nhiều địa chỉ khác nhau cho các mục đích khác nhau
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Thông tin sẽ được bảo mật và chỉ sử dụng cho mục đích giao hàng
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Hủy
        </Button>
        <Button
          onClick={onSave}
          variant='contained'
          sx={{ textTransform: 'none' }}
          disabled={!isFormComplete()}
        >
          {editAddressId ? 'Lưu' : 'Thêm'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddressDialog
