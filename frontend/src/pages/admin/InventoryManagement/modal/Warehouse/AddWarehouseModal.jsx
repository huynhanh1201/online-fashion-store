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
  MenuItem
} from '@mui/material'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Autocomplete from '@mui/material/Autocomplete'
import ClearIcon from '@mui/icons-material/Clear'
import IconButton from '@mui/material/IconButton'

const AddWarehouseModal = ({ open, onClose, onSave }) => {
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

  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedWard, setSelectedWard] = useState('')

  const [provinceName, setProvinceName] = useState('')
  const [districtName, setDistrictName] = useState('')
  const [wardName, setWardName] = useState('')

  const [provinceInput, setProvinceInput] = useState('')
  const [districtInput, setDistrictInput] = useState('')
  const [wardInput, setWardInput] = useState('')

  useEffect(() => {
    axios
      .get('https://provinces.open-api.vn/api/?depth=1')
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error('Lỗi load tỉnh/thành: ', err))
  }, [])

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
    setWards([])
    try {
      const res = await axios.get(
        `https://provinces.open-api.vn/api/p/${code}?depth=2`
      )
      setDistricts(res.data.districts || [])
    } catch (err) {
      console.error('Lỗi load quận/huyện:', err)
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
    try {
      const res = await axios.get(
        `https://provinces.open-api.vn/api/d/${code}?depth=2`
      )
      setWards(res.data.wards || [])
    } catch (err) {
      console.error('Lỗi load phường/xã:', err)
    }
  }

  const handleWardChange = (event) => {
    const code = event.target.value
    const ward = wards.find((w) => w.code === code)
    setSelectedWard(code)
    setWardName(ward?.name || '')
    setValue('ward', ward?.name || '')
  }

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      address: data.address,
      ward: wardName,
      district: districtName,
      city: provinceName
    }
    const result = onSave(payload)
    if (result) {
      onClose()
      reset()
      setSelectedProvince('')
      setSelectedDistrict('')
      setSelectedWard('')
      setProvinceName('')
      setDistrictName('')
      setWardName('')
    } else {
      alert('Thêm kho hàng thất bại. Vui lòng thử lại!')
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
      <DialogTitle>Thêm kho hàng mới</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item size={12} sm={6}>
              <TextField
                label='Tên kho hàng '
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
                {...register('address', { required: 'Vui lòng nhập địa chỉ' })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>

            <Grid item size={12} sm={4}>
              <Autocomplete
                disableClearable
                disablePortal
                options={provinces}
                getOptionLabel={(option) => option.name}
                value={
                  provinces.find((p) => p.code === selectedProvince) || null
                }
                inputValue={provinceInput || ''} // <- bạn cần thêm useState để kiểm soát input
                onInputChange={(event, newInputValue) => {
                  setProvinceInput(newInputValue)
                }}
                onChange={(event, newValue) => {
                  if (newValue)
                    handleProvinceChange({ target: { value: newValue.code } })
                }}
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

            <Grid item size={12} sm={4}>
              <Autocomplete
                disableClearable
                disablePortal
                options={districts}
                getOptionLabel={(option) => option.name}
                value={
                  districts.find((d) => d.code === selectedDistrict) || null
                }
                inputValue={districtInput || ''}
                onInputChange={(event, newInputValue) => {
                  setDistrictInput(newInputValue)
                }}
                onChange={(event, newValue) => {
                  if (newValue) {
                    handleDistrictChange({ target: { value: newValue.code } })
                  }
                }}
                disabled={!selectedProvince}
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
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button
            onClick={handleCancel}
            sx={{ textTransform: 'none' }}
            color='error'
            variant='outlined'
          >
            Huỷ
          </Button>
          <Button
            type='submit'
            sx={{
              backgroundColor: '#001f5d',
              color: '#fff',
              textTransform: 'none'
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddWarehouseModal
