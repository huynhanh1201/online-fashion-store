import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Divider,
  Box,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import {
  addShippingAddress,
  updateShippingAddress
} from '~/services/addressService'

export default function AddAddressModal({
  open,
  onClose,
  onSuccess, // callback khi thêm/sửa xong để reload danh sách bên ngoài
  addressToEdit = null, // object địa chỉ nếu chỉnh sửa, null nếu thêm mới
  viewOnly = false, // nếu true thì chỉ xem, không cho sửa
  showSnackbar
}) {
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: ''
  })
  const [formErrors, setFormErrors] = useState({
    fullName: false,
    phone: false,
    address: false,
    city: false,
    district: false,
    ward: false
  })

  const isEditMode = !!addressToEdit

  // Load provinces khi mount modal hoặc mở modal
  useEffect(() => {
    if (!open) return

    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/p/')
        if (!response.ok) throw new Error('Lỗi tải provinces')
        const data = await response.json()
        setProvinces(data)
      } catch {
        showSnackbar?.('Không thể tải danh sách tỉnh/thành!', 'error')
      }
    }
    fetchProvinces()
  }, [open, showSnackbar])

  // Load districts khi chọn city
  useEffect(() => {
    if (!formData.city) {
      setDistricts([])
      setWards([])
      setFormData(prev => ({ ...prev, district: '', ward: '' }))
      return
    }

    const fetchDistricts = async () => {
      try {
        const response = await fetch(
          `https://provinces.open-api.vn/api/p/${formData.city}?depth=2`
        )
        if (!response.ok) throw new Error('Lỗi tải districts')
        const data = await response.json()
        setDistricts(data.districts || [])
        // Nếu không chỉnh sửa thì reset district/ward
        if (!isEditMode) {
          setFormData(prev => ({ ...prev, district: '', ward: '' }))
        }
        setWards([])
      } catch {
        showSnackbar?.('Không thể tải danh sách quận/huyện!', 'error')
      }
    }
    fetchDistricts()
  }, [formData.city, isEditMode, showSnackbar])

  // Load wards khi chọn district
  useEffect(() => {
    if (!formData.district) {
      setWards([])
      setFormData(prev => ({ ...prev, ward: '' }))
      return
    }

    const fetchWards = async () => {
      try {
        const response = await fetch(
          `https://provinces.open-api.vn/api/d/${formData.district}?depth=2`
        )
        if (!response.ok) throw new Error('Lỗi tải wards')
        const data = await response.json()
        setWards(data.wards || [])
        if (!isEditMode) {
          setFormData(prev => ({ ...prev, ward: '' }))
        }
      } catch {
        showSnackbar?.('Không thể tải danh sách phường/xã!', 'error')
      }
    }
    fetchWards()
  }, [formData.district, isEditMode, showSnackbar])

  // Load dữ liệu vào form khi modal mở và có chỉnh sửa
  useEffect(() => {
    if (!open) return

    if (isEditMode && addressToEdit) {
      // Chờ provinces đã tải rồi mới load district, ward
      if (provinces.length === 0) return

      const loadLocationCodes = async () => {
        try {
          // Tìm mã city
          const cityCode = provinces.find(p => p.name === addressToEdit.city)?.code || ''
          if (!cityCode) throw new Error('Không tìm thấy tỉnh/thành')

          // Lấy districts
          const districtRes = await fetch(
            `https://provinces.open-api.vn/api/p/${cityCode}?depth=2`
          )
          if (!districtRes.ok) throw new Error('Lỗi tải quận/huyện')
          const districtData = await districtRes.json()
          setDistricts(districtData.districts || [])

          // Tìm mã district
          const districtCode = districtData.districts.find(d => d.name === addressToEdit.district)?.code || ''
          if (!districtCode) throw new Error('Không tìm thấy quận/huyện')

          // Lấy wards
          const wardRes = await fetch(
            `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
          )
          if (!wardRes.ok) throw new Error('Lỗi tải phường/xã')
          const wardData = await wardRes.json()
          setWards(wardData.wards || [])

          // Tìm mã ward
          const wardCode = wardData.wards.find(w => w.name === addressToEdit.ward)?.code || ''

          // Đổ dữ liệu vào form
          setFormData({
            fullName: addressToEdit.fullName || '',
            phone: addressToEdit.phone || '',
            address: addressToEdit.address || '',
            city: cityCode,
            district: districtCode,
            ward: wardCode
          })
          setFormErrors({
            fullName: false,
            phone: false,
            address: false,
            city: false,
            district: false,
            ward: false
          })
        } catch {
          showSnackbar?.('Không thể tải thông tin địa chỉ!', 'error')
        }
      }
      loadLocationCodes()
    } else {
      // Thêm mới hoặc xem => reset form
      setFormData({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: ''
      })
      setDistricts([])
      setWards([])
      setFormErrors({
        fullName: false,
        phone: false,
        address: false,
        city: false,
        district: false,
        ward: false
      })
    }
  }, [open, isEditMode, addressToEdit, provinces, showSnackbar])

  // Validate form
  const validateForm = () => {
    const errors = {
      fullName: !formData.fullName.trim() || formData.fullName.trim().length < 3,
      phone: !formData.phone.trim() || !/^\d{10}$/.test(formData.phone.trim()),
      address: !formData.address.trim() || formData.address.trim().length < 5,
      city: !formData.city,
      district: !formData.district,
      ward: !formData.ward
    }
    setFormErrors(errors)
    return !Object.values(errors).some(Boolean)
  }

  // Handle input/select change
  const handleChange = (field) => (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))

    // Validate ngay khi nhập
    setFormErrors(prev => ({
      ...prev,
      [field]:
        field === 'fullName'
          ? !value.trim() || value.trim().length < 3
          : field === 'phone'
          ? !value.trim() || !/^\d{10}$/.test(value.trim())
          : field === 'address'
          ? !value.trim() || value.trim().length < 5
          : !value
    }))
  }

  // Xử lý submit thêm hoặc sửa
  const handleSubmit = async () => {
    if (!validateForm()) {
      showSnackbar?.('Vui lòng điền đầy đủ và đúng thông tin địa chỉ!', 'error')
      return
    }

    const cityName = provinces.find(p => p.code === formData.city)?.name || ''
    const districtName = districts.find(d => d.code === formData.district)?.name || ''
    const wardName = wards.find(w => w.code === formData.ward)?.name || ''

    const addressData = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      ward: wardName,
      district: districtName,
      city: cityName
    }

    try {
      if (isEditMode) {
        const updated = await updateShippingAddress(addressToEdit._id, addressData)
        if (updated && updated._id) {
          showSnackbar?.('Sửa địa chỉ thành công!')
          onSuccess?.()
          onClose()
        } else {
          showSnackbar?.('Không thể sửa địa chỉ!', 'error')
        }
      } else {
        const added = await addShippingAddress(addressData)
        if (added && added._id) {
          showSnackbar?.('Thêm địa chỉ thành công!')
          onSuccess?.()
          onClose()
        } else {
          showSnackbar?.('Không thể thêm địa chỉ!', 'error')
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Không thể xử lý địa chỉ!'
      showSnackbar?.(`Lỗi: ${errorMessage}`, 'error')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {viewOnly
          ? 'Xem địa chỉ'
          : isEditMode
          ? 'Chỉnh sửa địa chỉ'
          : 'Thêm địa chỉ mới'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent dividers>
        {viewOnly ? (
          <Box>
            <Typography variant="subtitle1">
              <b>Họ và tên:</b> {addressToEdit?.fullName}
            </Typography>
            <Typography variant="subtitle1">
              <b>Số điện thoại:</b> {addressToEdit?.phone}
            </Typography>
            <Typography variant="subtitle1">
              <b>Địa chỉ:</b>{' '}
              {`${addressToEdit?.address}, ${addressToEdit?.ward}, ${addressToEdit?.district}, ${addressToEdit?.city}`}
            </Typography>
          </Box>
        ) : (
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ display: 'grid', gap: 2 }}
          >
            <TextField
              label="Họ và tên"
              fullWidth
              value={formData.fullName}
              onChange={handleChange('fullName')}
              error={formErrors.fullName}
              helperText={formErrors.fullName ? 'Họ và tên phải ít nhất 3 ký tự' : ''}
              disabled={viewOnly}
            />
            <TextField
              label="Số điện thoại"
              fullWidth
              value={formData.phone}
              onChange={handleChange('phone')}
              error={formErrors.phone}
              helperText={formErrors.phone ? 'Số điện thoại phải đúng 10 số' : ''}
              disabled={viewOnly}
            />
            <TextField
              label="Địa chỉ cụ thể"
              fullWidth
              value={formData.address}
              onChange={handleChange('address')}
              error={formErrors.address}
              helperText={formErrors.address ? 'Địa chỉ phải ít nhất 5 ký tự' : ''}
              disabled={viewOnly}
            />
            <FormControl fullWidth error={formErrors.city} disabled={viewOnly}>
              <InputLabel id="select-city-label">Tỉnh/Thành</InputLabel>
              <Select
                labelId="select-city-label"
                value={formData.city}
                label="Tỉnh/Thành"
                onChange={handleChange('city')}
              >
                {provinces.map((p) => (
                  <MenuItem key={p.code} value={p.code}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.city && (
                <Typography color="error" variant="caption">
                  Vui lòng chọn tỉnh/thành
                </Typography>
              )}
            </FormControl>
            <FormControl
              fullWidth
              error={formErrors.district}
              disabled={viewOnly || districts.length === 0}
            >
              <InputLabel id="select-district-label">Quận/Huyện</InputLabel>
              <Select
                labelId="select-district-label"
                value={formData.district}
                label="Quận/Huyện"
                onChange={handleChange('district')}
              >
                {districts.map((d) => (
                  <MenuItem key={d.code} value={d.code}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.district && (
                <Typography color="error" variant="caption">
                  Vui lòng chọn quận/huyện
                </Typography>
              )}
            </FormControl>
            <FormControl
              fullWidth
              error={formErrors.ward}
              disabled={viewOnly || wards.length === 0}
            >
              <InputLabel id="select-ward-label">Phường/Xã</InputLabel>
              <Select
                labelId="select-ward-label"
                value={formData.ward}
                label="Phường/Xã"
                onChange={handleChange('ward')}
              >
                {wards.map((w) => (
                  <MenuItem key={w.code} value={w.code}>
                    {w.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.ward && (
                <Typography color="error" variant="caption">
                  Vui lòng chọn phường/xã
                </Typography>
              )}
            </FormControl>
          </Box>
        )}
      </DialogContent>
      {!viewOnly && (
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditMode ? 'Lưu' : 'Thêm'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}
