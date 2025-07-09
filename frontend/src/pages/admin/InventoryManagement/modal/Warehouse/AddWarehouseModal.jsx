import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
  Autocomplete,
  IconButton
} from '@mui/material'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-toastify'
import { GHN_TOKEN_API } from '~/utils/constants'

const AddWarehouseModal = ({ open, onClose, onSave, Add }) => {
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

  const [selectedProvince, setSelectedProvince] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [selectedWard, setSelectedWard] = useState(null)

  // Fetch Provinces
  useEffect(() => {
    axios
      .get(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
        {
          headers: {
            Token: GHN_TOKEN_API
          }
        }
      )
      .then((res) => {
        const data = res.data?.data
        setProvinces(Array.isArray(data) ? data : [])
      })
      .catch((err) => console.error('Lỗi load tỉnh GHN:', err))
  }, [])

  // Fetch Districts theo Province
  const handleProvinceChange = (event, newValue) => {
    if (!newValue) return
    setSelectedProvince(newValue)
    setSelectedDistrict(null)
    setSelectedWard(null)
    setDistricts([])
    setWards([])
    axios
      .post(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
        { province_id: newValue.ProvinceID },
        { headers: { Token: GHN_TOKEN_API } }
      )
      .then((res) => {
        const data = res.data?.data
        setDistricts(Array.isArray(data) ? data : [])
      })
      .catch((err) => console.error('Lỗi load quận GHN:', err))
  }

  // Fetch Wards theo District
  const handleDistrictChange = (event, newValue) => {
    if (!newValue) return
    setSelectedDistrict(newValue)
    setSelectedWard(null)
    setWards([])
    axios
      .post(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
        { district_id: newValue.DistrictID },
        { headers: { Token: GHN_TOKEN_API } }
      )
      .then((res) => {
        const data = res.data?.data
        setWards(Array.isArray(data) ? data : [])
      })
      .catch((err) => console.error('Lỗi load phường GHN:', err))
  }

  const handleWardChange = (event, newValue) => {
    if (!newValue) return
    setSelectedWard(newValue)
  }

  const onSubmit = async (data) => {
    try {
      if (!selectedProvince || !selectedDistrict || !selectedWard) {
        toast.error('Vui lòng chọn đầy đủ thông tin địa chỉ.')
        return
      }

      // Kiểm tra ID có hợp lệ
      if (
        !selectedProvince.ProvinceID ||
        !selectedDistrict.DistrictID ||
        !selectedWard.WardCode
      ) {
        toast.error('Mã địa chỉ không hợp lệ. Vui lòng chọn lại.')
        return
      }
      const payload = {
        name: data.name, // nếu backend yêu cầu là fullName
        phone: data.phone, // nếu có trường phone
        address: data.address,
        ward: selectedWard.WardName,
        district: selectedDistrict.DistrictName,
        city: selectedProvince.ProvinceName,
        cityId: String(selectedProvince.ProvinceID),
        districtId: String(selectedDistrict.DistrictID),
        wardId: String(selectedWard.WardCode)
      }
      console.log('Payload to save:', typeof payload.wardId)

      if (Add) {
        await Add(payload)
      } else {
        await onSave(payload, 'add')
      }
      reset()
      setSelectedProvince(null)
      setSelectedDistrict(null)
      setSelectedWard(null)
      setDistricts([])
      setWards([])
      onClose()
    } catch (error) {
      console.error('Lỗi khi thêm kho:', error)
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
    <Dialog open={open} onClose={handleCancel} maxWidth='sm' fullWidth>
      <DialogTitle>Thêm kho hàng</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item size={12} xs={12}>
              <TextField
                label={
                  <>
                    Tên kho <span style={{ color: 'red' }}>*</span>
                  </>
                }
                fullWidth
                {...register('name', { required: 'Vui lòng nhập tên kho' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item size={12} xs={12}>
              <TextField
                label={
                  <>
                    Địa chỉ (số nhà, tên đường){' '}
                    <span style={{ color: 'red' }}>*</span>
                  </>
                }
                fullWidth
                {...register('address', { required: 'Vui lòng nhập địa chỉ' })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>

            <Grid item size={12} xs={12} sm={4}>
              <Autocomplete
                options={Array.isArray(provinces) ? provinces : []}
                getOptionLabel={(option) => option.ProvinceName}
                value={selectedProvince}
                onChange={handleProvinceChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      <>
                        Tỉnh / Thành phố <span style={{ color: 'red' }}>*</span>
                      </>
                    }
                  />
                )}
              />
            </Grid>

            <Grid item size={12} xs={12} sm={4}>
              <Autocomplete
                options={Array.isArray(districts) ? districts : []}
                getOptionLabel={(option) => option.DistrictName}
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedProvince}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      <>
                        Quận / Huyện <span style={{ color: 'red' }}>*</span>
                      </>
                    }
                  />
                )}
              />
            </Grid>

            <Grid item size={12} xs={12} sm={4}>
              <Autocomplete
                options={Array.isArray(wards) ? wards : []}
                getOptionLabel={(option) => option.WardName}
                value={selectedWard}
                onChange={handleWardChange}
                disabled={!selectedDistrict}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      <>
                        Phường / Xã <span style={{ color: 'red' }}>*</span>
                      </>
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={handleCancel} color='error' variant='outlined'>
            Huỷ
          </Button>
          <Button type='submit' variant='contained'>
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddWarehouseModal
