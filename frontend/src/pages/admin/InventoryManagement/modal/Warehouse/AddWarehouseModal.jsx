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
    <Dialog open={open} onClose={handleCancel} maxWidth='sm' fullWidth>
      <DialogTitle>Thêm kho hàng mới</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item size={12} sm={6}>
              <TextField
                label='Tên kho'
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
              <FormControl fullWidth>
                <InputLabel>Tỉnh / Thành phố</InputLabel>
                <Select
                  value={selectedProvince}
                  label='Tỉnh / Thành phố'
                  onChange={handleProvinceChange}
                >
                  {provinces.map((p) => (
                    <MenuItem key={p.code} value={p.code}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Quận / Huyện</InputLabel>
                <Select
                  value={selectedDistrict}
                  label='Quận / Huyện'
                  onChange={handleDistrictChange}
                  disabled={!selectedProvince}
                >
                  {districts.map((d) => (
                    <MenuItem key={d.code} value={d.code}>
                      {d.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Phường / Xã</InputLabel>
                <Select
                  value={selectedWard}
                  label='Phường / Xã'
                  onChange={handleWardChange}
                  disabled={!selectedDistrict}
                >
                  {wards.map((w) => (
                    <MenuItem key={w.code} value={w.code}>
                      {w.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Huỷ</Button>
          <Button type='submit' variant='contained' color='primary'>
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddWarehouseModal
