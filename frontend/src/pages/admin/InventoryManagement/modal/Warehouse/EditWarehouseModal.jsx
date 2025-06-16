// modal/Warehouse/EditWarehouseModal.jsx
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Autocomplete
} from '@mui/material'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-toastify'
import ClearIcon from '@mui/icons-material/Clear'
import IconButton from '@mui/material/IconButton'
const EditWarehouseModal = ({ open, onClose, warehouse, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm()

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [loadingProvinces, setLoadingProvinces] = useState(true) // Thêm state loading

  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedWard, setSelectedWard] = useState('')

  const [provinceName, setProvinceName] = useState('')
  const [districtName, setDistrictName] = useState('')
  const [wardName, setWardName] = useState('')

  const [provinceInput, setProvinceInput] = useState('')
  const [districtInput, setDistrictInput] = useState('')
  const [wardInput, setWardInput] = useState('')

  // Hàm chuẩn hóa tên tỉnh/thành để so sánh
  const normalizeName = (name) => {
    if (!name) return ''
    return name
      .toLowerCase()
      .replace(/^(thành phố|tỉnh)\s+/, '') // Loại bỏ "Thành phố" hoặc "Tỉnh"
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Load provinces
  useEffect(() => {
    setLoadingProvinces(true)
    axios
      .get('https://provinces.open-api.vn/api/?depth=1')
      .then((res) => {
        setProvinces(res.data || [])
        setLoadingProvinces(false)
      })
      .catch((err) => {
        console.error('Lỗi load tỉnh/thành: ', err)
        toast.error('Không thể tải danh sách tỉnh/thành')
        setLoadingProvinces(false)
      })
  }, [])

  // Initialize form with warehouse data
  useEffect(() => {
    if (warehouse && provinces.length > 0 && !loadingProvinces) {
      setValue('code', warehouse.code || '')
      setValue('name', warehouse.name || '')
      setValue('address', warehouse.address || '')
      setValue('ward', warehouse.ward || '')
      setValue('district', warehouse.district || '')
      setValue('city', warehouse.city || '')

      // Find province
      const normalizedWarehouseCity = normalizeName(warehouse.city)
      const province = provinces.find(
        (p) => normalizeName(p.name) === normalizedWarehouseCity
      )
      if (province) {
        setSelectedProvince(province.code)
        setProvinceName(province.name)

        // Load districts
        axios
          .get(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`)
          .then((res) => {
            const districtList = res.data.districts || []
            setDistricts(districtList)

            // Find district
            const normalizedWarehouseDistrict = normalizeName(
              warehouse.district
            )
            const district = districtList.find(
              (d) => normalizeName(d.name) === normalizedWarehouseDistrict
            )
            if (district) {
              setSelectedDistrict(district.code)
              setDistrictName(district.name)

              // Load wards
              axios
                .get(
                  `https://provinces.open-api.vn/api/d/${district.code}?depth=2`
                )
                .then((res) => {
                  const wardList = res.data.wards || []
                  setWards(wardList)

                  // Find ward
                  const normalizedWarehouseWard = normalizeName(warehouse.ward)
                  const ward = wardList.find(
                    (w) => normalizeName(w.name) === normalizedWarehouseWard
                  )
                  if (ward) {
                    setSelectedWard(ward.code)
                    setWardName(ward.name)
                  }
                })
                .catch((err) => {
                  console.error('Lỗi load phường/xã:', err)
                  toast.error('Không thể tải danh sách phường/xã')
                })
            }
          })
          .catch((err) => {
            console.error('Lỗi load quận/huyện:', err)
            toast.error('Không thể tải danh sách quận/huyện')
          })
      }
    }
  }, [warehouse, provinces, loadingProvinces, setValue])

  const handleProvinceChange = async (event) => {
    const code = event.target.value
    const province = provinces.find((p) => p.code === code)
    setSelectedProvince(code)
    setProvinceName(province?.name || '')
    setValue('city', province?.name || '')

    setSelectedDistrict('')
    setSelectedWard('')
    setDistrictName('')
    setWardName('')
    setDistricts([])
    setWards([])
    try {
      const res = await axios.get(
        `https://provinces.open-api.vn/api/p/${code}?depth=2`
      )
      setDistricts(res.data.districts || [])
    } catch (err) {
      console.error('Lỗi load quận/huyện:', err)
      toast.error('Không thể tải danh sách quận/huyện')
    }
  }

  const handleDistrictChange = async (event) => {
    const code = event.target.value
    const district = districts.find((d) => d.code === code)
    setSelectedDistrict(code)
    setDistrictName(district?.name || '')
    setValue('district', district?.name || '')

    setSelectedWard('')
    setWardName('')
    setWards([])
    try {
      const res = await axios.get(
        `https://provinces.open-api.vn/api/d/${code}?depth=2`
      )
      setWards(res.data.wards || [])
    } catch (err) {
      console.error('Lỗi load phường/xã:', err)
      toast.error('Không thể tải danh sách phường/xã')
    }
  }

  const handleWardChange = (event) => {
    const code = event.target.value
    const ward = wards.find((w) => w.code === code)
    setSelectedWard(code)
    setWardName(ward?.name || '')
    setValue('ward', ward?.name || '')
  }

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      address: data.address,
      ward: wardName,
      district: districtName,
      city: provinceName
    }

    try {
      await onSave(warehouse._id, payload)
      toast.success('Cập nhật kho hàng thành công')
      onClose()
      reset()
      setSelectedProvince('')
      setSelectedDistrict('')
      setSelectedWard('')
      setProvinceName('')
      setDistrictName('')
      setWardName('')
    } catch (error) {
      toast.error('Cập nhật kho hàng thất bại', error)
    }
  }

  const handleCancel = () => {
    reset()
    setSelectedProvince('')
    setSelectedDistrict('')
    setSelectedWard('')
    setProvinceName('')
    setDistrictName('')
    setWardName('')
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: {
          overflowY: 'visible'
        }
      }}
    >
      <DialogTitle>Sửa thông tin kho hàng</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {loadingProvinces ? (
            <Grid container justifyContent='center'>
              <CircularProgress />
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item size={12} sm={6}>
                <TextField
                  label='Tên kho hàng'
                  fullWidth
                  {...register('name', { required: 'Vui lòng nhập tên kho' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item size={12}>
                <TextField
                  label='Địa chỉ (số nhà, tên đường)'
                  fullWidth
                  {...register('address', {
                    required: 'Vui lòng nhập địa chỉ'
                  })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Grid>
              <Grid item size={12} sm={4}>
                <Autocomplete
                  disableClearable
                  options={provinces}
                  getOptionLabel={(option) => option.name}
                  value={
                    provinces.find((p) => p.code === selectedProvince) || null
                  }
                  inputValue={provinceInput}
                  onInputChange={(event, newInputValue) => {
                    setProvinceInput(newInputValue)
                  }}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      handleProvinceChange({ target: { value: newValue.code } })
                    }
                  }}
                  disabled={loadingProvinces}
                  noOptionsText='Không có kết quả phù hợp'
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Tỉnh / Thành phố'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {provinceInput && (
                              <IconButton
                                onClick={() => {
                                  setProvinceInput('')
                                  setSelectedProvince('')
                                  setDistricts([])
                                  setWards([])
                                }}
                                size='small'
                                sx={{
                                  width: 16,
                                  height: 16,
                                  backgroundColor: '#e0e0e0',
                                  '&:hover': { backgroundColor: '#d5d5d5' },
                                  padding: 0,
                                  marginRight: '6px'
                                }}
                              >
                                <ClearIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item size={12} sm={4}>
                <Autocomplete
                  disableClearable
                  disablePortal
                  options={districts}
                  getOptionLabel={(option) => option.name}
                  value={
                    districts.find((d) => d.code === selectedDistrict) || null
                  }
                  inputValue={districtInput}
                  onInputChange={(event, newInputValue) => {
                    setDistrictInput(newInputValue)
                  }}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      handleDistrictChange({ target: { value: newValue.code } })
                    }
                  }}
                  disabled={!selectedProvince || districts.length === 0}
                  noOptionsText='Không có kết quả phù hợp'
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Quận / Huyện'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {districtInput && (
                              <IconButton
                                onClick={() => {
                                  setDistrictInput('')
                                  setSelectedDistrict('')
                                  setWards([])
                                }}
                                size='small'
                                sx={{
                                  width: 16,
                                  height: 16,
                                  backgroundColor: '#e0e0e0',
                                  '&:hover': { backgroundColor: '#d5d5d5' },
                                  padding: 0,
                                  marginRight: '6px'
                                }}
                              >
                                <ClearIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item size={12} sm={4}>
                <Autocomplete
                  disableClearable
                  options={wards}
                  getOptionLabel={(option) => option.name}
                  value={wards.find((w) => w.code === selectedWard) || null}
                  inputValue={wardInput || ''}
                  onInputChange={(event, newInputValue) => {
                    setWardInput(newInputValue)
                  }}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      handleWardChange({ target: { value: newValue.code } })
                    }
                  }}
                  disabled={!selectedDistrict}
                  noOptionsText='Không có kết quả phù hợp'
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Phường / Xã'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {wardInput && (
                              <IconButton
                                onClick={() => {
                                  setWardInput('')
                                  setSelectedWard('')
                                }}
                                size='small'
                                sx={{
                                  width: 16,
                                  height: 16,
                                  backgroundColor: '#e0e0e0',
                                  '&:hover': {
                                    backgroundColor: '#d5d5d5'
                                  },
                                  padding: 0,
                                  marginRight: '6px'
                                }}
                              >
                                <ClearIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancel}
            sx={{ textTransform: 'none' }}
            color='error'
            variant='outlined'
          >
            Hủy
          </Button>
          <Button
            type='submit'
            sx={{
              backgroundColor: '#001f5d',
              color: '#fff',
              textTransform: 'none'
            }}
            disabled={loadingProvinces}
          >
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditWarehouseModal
