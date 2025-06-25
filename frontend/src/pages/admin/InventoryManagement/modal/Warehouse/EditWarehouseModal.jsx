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
import { GHN_TOKEN_API } from '~/utils/constants'
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
  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingWards, setLoadingWards] = useState(false)

  const [selectedProvince, setSelectedProvince] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [selectedWard, setSelectedWard] = useState(null)

  // Hàm chuẩn hóa tên tỉnh/thành để so sánh
  const normalizeName = (name) => {
    if (!name) return ''
    return name
      .toLowerCase()
      .replace(/^(thành phố|tỉnh)\s+/, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Load provinces
  useEffect(() => {
    setLoadingProvinces(true)
    axios
      .get(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
        {
          headers: { Token: GHN_TOKEN_API }
        }
      )
      .then((res) => {
        const data = res.data?.data || []
        setProvinces(data)
      })
      .catch((err) => {
        console.error('Lỗi load tỉnh GHN:', err)
        toast.error('Không thể tải danh sách tỉnh/thành')
      })
      .finally(() => {
        setLoadingProvinces(false)
      })
  }, [])

  // Initialize form with warehouse data
  // Load dữ liệu từ warehouse vào form
  useEffect(() => {
    if (warehouse && provinces.length > 0) {
      setValue('name', warehouse.name || '')
      setValue('address', warehouse.address || '')

      const normalizedCity = normalizeName(warehouse.city)
      const province = provinces.find(
        (p) => normalizeName(p.ProvinceName) === normalizedCity
      )
      if (province) {
        setSelectedProvince(province)
        axios
          .post(
            'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
            { province_id: province.ProvinceID },
            { headers: { Token: GHN_TOKEN_API } }
          )
          .then((res) => {
            const districtList = res.data?.data || []
            setDistricts(districtList)

            const normalizedDistrict = normalizeName(warehouse.district)
            const district = districtList.find(
              (d) => normalizeName(d.DistrictName) === normalizedDistrict
            )
            if (district) {
              setSelectedDistrict(district)

              axios
                .post(
                  'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
                  { district_id: district.DistrictID },
                  { headers: { Token: GHN_TOKEN_API } }
                )
                .then((res) => {
                  const wardList = res.data?.data || []
                  setWards(wardList)

                  const normalizedWard = normalizeName(warehouse.ward)
                  const ward = wardList.find(
                    (w) => normalizeName(w.WardName) === normalizedWard
                  )
                  if (ward) {
                    setSelectedWard(ward)
                  }
                })
                .catch((err) => {
                  console.error('Lỗi load phường GHN:', err)
                  toast.error('Không thể tải danh sách phường/xã')
                })
            }
          })
          .catch((err) => {
            console.error('Lỗi load quận GHN:', err)
            toast.error('Không thể tải danh sách quận/huyện')
          })
      }
    }
  }, [warehouse, provinces, setValue])

  const handleProvinceChange = async (_event, newValue) => {
    if (!newValue) return

    setSelectedProvince(newValue)
    setSelectedDistrict(null)
    setSelectedWard(null)
    setDistricts([])
    setWards([])
    setLoadingDistricts(true)

    try {
      const res = await axios.post(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
        { province_id: newValue.ProvinceID },
        { headers: { Token: GHN_TOKEN_API } }
      )
      setDistricts(res.data?.data || [])
    } catch (err) {
      console.error('Lỗi load quận GHN:', err)
      toast.error('Không thể tải danh sách quận/huyện')
    } finally {
      setLoadingDistricts(false)
    }
  }

  const handleDistrictChange = async (_event, newValue) => {
    if (!newValue) return

    setSelectedDistrict(newValue)
    setSelectedWard(null)
    setWards([])
    setLoadingWards(true)

    try {
      const res = await axios.post(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
        { district_id: newValue.DistrictID },
        { headers: { Token: GHN_TOKEN_API } }
      )
      setWards(res.data?.data || [])
    } catch (err) {
      console.error('Lỗi load phường GHN:', err)
      toast.error('Không thể tải danh sách phường/xã')
    } finally {
      setLoadingWards(false)
    }
  }

  const handleWardChange = (_event, newValue) => {
    if (!newValue) return
    setSelectedWard(newValue)
  }

  const onSubmit = async (data) => {
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      toast.error('Vui lòng chọn đầy đủ Tỉnh, Quận, Phường')
      return
    }

    const payload = {
      name: data.name,
      address: data.address,
      city: selectedProvince.ProvinceName,
      district: selectedDistrict.DistrictName,
      ward: selectedWard.WardName,
      cityId: String(selectedProvince.ProvinceID),
      districtId: String(selectedDistrict.DistrictID),
      wardId: String(selectedWard.WardCode)
    }

    try {
      await onSave(payload, 'edit', warehouse._id)
      toast.success('Cập nhật kho hàng thành công')
      reset()
      setSelectedProvince(null)
      setSelectedDistrict(null)
      setSelectedWard(null)
      setDistricts([])
      setWards([])
      onClose()
    } catch (err) {
      console.error('Lỗi cập nhật:', err)
      toast.error('Cập nhật kho hàng thất bại')
    }
  }

  const handleCancel = () => {
    reset()
    setSelectedProvince(null)
    setSelectedDistrict(null)
    setSelectedWard(null)
    setDistricts([])
    setWards([])
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
                  helperText={'Không thể sửa tên vì kho đã có liên kết'}
                  disabled
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
              <Grid item size={12} xs={12} sm={4}>
                <Autocomplete
                  disableClearable
                  options={provinces}
                  disabled={loadingProvinces}
                  getOptionLabel={(option) => option.ProvinceName}
                  value={selectedProvince}
                  onChange={(_, newValue) => {
                    handleProvinceChange(null, newValue)
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Tỉnh / Thành phố'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {selectedProvince && (
                              <IconButton
                                onClick={() => {
                                  setSelectedProvince(null)
                                  setSelectedDistrict(null)
                                  setSelectedWard(null)
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

              <Grid item size={12} xs={12} sm={4}>
                <Autocomplete
                  disableClearable
                  options={districts}
                  getOptionLabel={(option) => option.DistrictName}
                  value={selectedDistrict}
                  onChange={(_, newValue) => {
                    handleDistrictChange(null, newValue)
                  }}
                  disabled={!selectedProvince || loadingDistricts}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Quận / Huyện'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {selectedDistrict && (
                              <IconButton
                                onClick={() => {
                                  setSelectedDistrict(null)
                                  setSelectedWard(null)
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

              <Grid item size={12} xs={12} sm={4}>
                <Autocomplete
                  disableClearable
                  options={wards}
                  getOptionLabel={(option) => option.WardName}
                  value={selectedWard}
                  onChange={(_, newValue) => {
                    handleWardChange(null, newValue)
                  }}
                  disabled={!selectedDistrict || loadingWards}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Phường / Xã'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {selectedWard && (
                              <IconButton
                                onClick={() => {
                                  setSelectedWard(null)
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
