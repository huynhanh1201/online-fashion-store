import React, { useState, useEffect } from 'react'
import { Box, Button, Divider, Paper, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import {
  getShippingAddresses,
  addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress
} from '~/services/addressService'
import AddressTable from './AddressTable'
import AddressDialog from './AddressDialog'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import { GHN_TOKEN_API } from '~/utils/constants'

// Regex kiểm tra số điện thoại Việt Nam (di động và bàn)
const VN_PHONE_REGEX =
  /^(0(3[2-9]|5[2-9]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}|0(2[0-9]{8,9}))$/

function ShippingAddress({ showSnackbar }) {
  const [addresses, setAddresses] = useState([])
  const [openAddressDialog, setOpenAddressDialog] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState(null)
  const [editAddressId, setEditAddressId] = useState(null)
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
  const [duplicateError, setDuplicateError] = useState('')

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provinceRes = await fetch(
          'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Token: GHN_TOKEN_API
            }
          }
        )
        if (!provinceRes.ok) {
          throw new Error(
            `Lỗi tải tỉnh/thành: ${provinceRes.status} ${provinceRes.statusText}`
          )
        }
        const provinceData = await provinceRes.json()
        if (provinceData.code !== 200 || !provinceData.data) {
          throw new Error('Không có dữ liệu tỉnh/thành')
        }
        const provinces = provinceData.data.map((p) => ({
          code: String(p.ProvinceID),
          name: p.ProvinceName
        }))
        setProvinces(provinces)
      } catch (error) {
        showSnackbar?.(
          `Không thể tải danh sách tỉnh/thành: ${error.message}`,
          'error'
        )
      }
    }
    fetchProvinces()
  }, [showSnackbar])

  // Fetch districts when city changes
  useEffect(() => {
    if (formData.city) {
      const fetchDistricts = async () => {
        try {
          const districtRes = await fetch(
            'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
            {
              method: 'POST',
              headers: {
                Token: GHN_TOKEN_API,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ province_id: parseInt(formData.city) })
            }
          )
          if (!districtRes.ok) {
            throw new Error(
              `Lỗi tải quận/huyện: ${districtRes.status} ${districtRes.statusText}`
            )
          }
          const districtData = await districtRes.json()
          if (districtData.code !== 200 || !districtData.data) {
            throw new Error('Không có dữ liệu quận/huyện')
          }
          const districts = districtData.data.map((d) => ({
            code: String(d.DistrictID),
            name: d.DistrictName
          }))
          setDistricts(districts)
          if (!editAddressId) {
            setFormData((prev) => ({ ...prev, district: '', ward: '' }))
          }
          setWards([])
        } catch (error) {
          showSnackbar?.(
            `Không thể tải danh sách quận/huyện: ${error.message}`,
            'error'
          )
        }
      }
      fetchDistricts()
    } else {
      setDistricts([])
      setWards([])
    }
  }, [formData.city, editAddressId, showSnackbar])

  // Fetch wards when district changes
  useEffect(() => {
    if (formData.district) {
      const fetchWards = async () => {
        try {
          const wardRes = await fetch(
            `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${formData.district}`,
            {
              method: 'GET',
              headers: {
                Token: GHN_TOKEN_API,
                'Content-Type': 'application/json'
              }
            }
          )
          if (!wardRes.ok) {
            throw new Error(
              `Lỗi tải phường/xã: ${wardRes.status} ${wardRes.statusText}`
            )
          }
          const wardData = await wardRes.json()
          if (wardData.code !== 200 || !wardData.data) {
            throw new Error('Không có dữ liệu phường/xã')
          }
          const wards = wardData.data.map((w) => ({
            code: String(w.WardCode),
            name: w.WardName
          }))
          setWards(wards)
          if (!editAddressId) {
            setFormData((prev) => ({ ...prev, ward: '' }))
          }
        } catch (error) {
          showSnackbar?.(
            `Không thể tải danh sách phường/xã: ${error.message}`,
            'error'
          )
        }
      }
      fetchWards()
    } else {
      setWards([])
    }
  }, [formData.district, editAddressId, showSnackbar])

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { addresses } = await getShippingAddresses()
        const validAddresses = (addresses || []).filter(
          (addr) =>
            addr._id && typeof addr._id === 'string' && addr._id.trim() !== ''
        )
        setAddresses(validAddresses)
      } catch (error) {
        showSnackbar?.(
          `Lỗi khi tải danh sách địa chỉ: ${error.message}`,
          'error'
        )
      }
    }
    fetchAddresses()
  }, [showSnackbar])

  const handleAddOrUpdateAddress = async () => {
    const { fullName, phone, address, city, district, ward } = formData
    const errors = {
      fullName: !fullName.trim() || fullName.trim().length < 3,
      phone: !phone.trim() || !VN_PHONE_REGEX.test(phone.trim()),
      address: !address.trim() || address.trim().length < 5,
      city: !city,
      district: !district,
      ward: !ward
    }
    setFormErrors(errors)

    if (Object.values(errors).some((error) => error)) {
      showSnackbar?.('Vui lòng điền đầy đủ và đúng thông tin địa chỉ!', 'error')
      return
    }

    const cityName = provinces.find((p) => p.code === formData.city)?.name || ''
    const districtName =
      districts.find((d) => d.code === formData.district)?.name || ''
    const wardName = wards.find((w) => w.code === formData.ward)?.name || ''
    const addressData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: cityName,
      cityId: city,
      district: districtName,
      districtId: district,
      ward: wardName,
      wardId: ward
    }
    const fullAddress = `${address}, ${wardName}, ${districtName}, ${cityName}`

    const isDuplicate = addresses.some((addr) => {
      if (addr._id === editAddressId) return false
      return Object.keys(addressData).every(
        (key) => addr[key] === addressData[key]
      )
    })
    if (isDuplicate) {
      setDuplicateError('Địa chỉ này đã tồn tại!')
      return
    } else {
      setDuplicateError('')
    }

    try {
      if (editAddressId) {
        const updatedAddress = await updateShippingAddress(
          editAddressId,
          addressData
        )
        if (updatedAddress && updatedAddress._id) {
          setAddresses(
            addresses.map((addr) =>
              addr._id === editAddressId
                ? { ...updatedAddress, fullAddress }
                : addr
            )
          )
          showSnackbar?.('Sửa địa chỉ thành công!')
        } else {
          showSnackbar?.('Không thể sửa địa chỉ!', 'error')
          return
        }
      } else {
        const newAddress = await addShippingAddress(addressData)
        if (newAddress && newAddress._id) {
          setAddresses([...addresses, { ...newAddress, fullAddress }])
          showSnackbar?.('Thêm địa chỉ thành công!')
        } else {
          showSnackbar?.('Không thể thêm địa chỉ!', 'error')
          return
        }
      }
      setFormData({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: ''
      })
      setFormErrors({
        fullName: false,
        phone: false,
        address: false,
        city: false,
        district: false,
        ward: false
      })
      setOpenAddressDialog(false)
      setEditAddressId(null)
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Không thể xử lý địa chỉ!'
      showSnackbar?.(`Lỗi: ${errorMessage}`, 'error')
    }
  }

  const handleDeleteAddress = (id) => {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      showSnackbar?.('ID địa chỉ không hợp lệ!', 'error')
      return
    }
    setAddressToDelete(id)
    setOpenConfirmDialog(true)
  }

  const confirmDeleteAddress = async () => {
    try {
      const response = await deleteShippingAddress(addressToDelete)
      if (response) {
        setAddresses(addresses.filter((addr) => addr._id !== addressToDelete))
        showSnackbar?.('Xóa địa chỉ thành công!')
      } else {
        showSnackbar?.('Không thể xóa địa chỉ!', 'error')
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Lỗi khi xóa địa chỉ!'
      showSnackbar?.(`Lỗi: ${errorMessage}`, 'error')
    } finally {
      setOpenConfirmDialog(false)
      setAddressToDelete(null)
    }
  }

  const handleEditAddress = async (address) => {
    if (
      !address._id ||
      typeof address._id !== 'string' ||
      address._id.trim() === ''
    ) {
      showSnackbar?.('ID địa chỉ không hợp lệ!', 'error')
      return
    }

    setEditAddressId(address._id)
    let cityCode = ''
    let districtCode = ''
    let wardCode = ''

    try {
      // Find ProvinceID from city name or ID
      const city = provinces.find(
        (p) =>
          p.name === address.city || String(p.code) === String(address.cityId)
      )
      cityCode = city?.code || ''
      if (!cityCode) {
        showSnackbar?.('Không tìm thấy tỉnh/thành!', 'error')
        return
      }

      // Fetch districts
      const districtRes = await fetch(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
        {
          method: 'POST',
          headers: {
            Token: GHN_TOKEN_API,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ province_id: parseInt(cityCode) })
        }
      )
      if (!districtRes.ok) {
        throw new Error('Lỗi tải quận/huyện')
      }
      const districtData = await districtRes.json()
      if (districtData.code !== 200 || !districtData.data) {
        throw new Error('Không có dữ liệu quận/huyện')
      }
      const districts = districtData.data.map((d) => ({
        code: String(d.DistrictID),
        name: d.DistrictName
      }))
      setDistricts(districts)

      // Find DistrictID from district name or ID
      const district = districts.find(
        (d) =>
          d.name === address.district ||
          String(d.code) === String(address.districtId)
      )
      districtCode = district?.code || ''
      if (!districtCode) {
        throw new Error('Không tìm thấy quận/huyện')
      }

      // Fetch wards
      const wardRes = await fetch(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtCode}`,
        {
          method: 'GET',
          headers: {
            Token: GHN_TOKEN_API,
            'Content-Type': 'application/json'
          }
        }
      )
      if (!wardRes.ok) {
        throw new Error('Lỗi tải phường/xã')
      }
      const wardData = await wardRes.json()
      if (wardData.code !== 200 || !wardData.data) {
        throw new Error('Không có dữ liệu phường/xã')
      }
      const wards = wardData.data.map((w) => ({
        code: String(w.WardCode),
        name: w.WardName
      }))
      setWards(wards)

      // Find WardCode from ward name or ID
      const ward = wards.find(
        (w) =>
          w.name === address.ward || String(w.code) === String(address.wardId)
      )
      wardCode = ward?.code || ''

      setFormData({
        fullName: address.fullName || '',
        phone: address.phone || '',
        address: address.address || '',
        city: cityCode,
        district: districtCode,
        ward: wardCode
      })
      setOpenAddressDialog(true)
    } catch (error) {
      showSnackbar?.(
        `Không thể tải thông tin địa chỉ: ${error.message}`,
        'error'
      )
    }
  }

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({
      ...prev,
      [field]:
        field === 'fullName'
          ? !value.trim() || value.trim().length < 3
          : field === 'phone'
            ? !value.trim() || !VN_PHONE_REGEX.test(value.trim())
            : field === 'address'
              ? !value.trim() || value.trim().length < 5
              : !value
    }))
  }

  return (
    <div>
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          p: 5,
          borderRadius: 2,
          bgcolor: '#ffffff',
          width: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Typography
            variant='h6'
            sx={{
              display: {
                xs: 'none',
                sm: 'inline-block'
              }
            }}
          >
            Danh sách địa chỉ giao hàng
          </Typography>
          <Typography
            variant='h6'
            sx={{
              display: {
                xs: 'inline-block',
                sm: 'none'
              }
            }}
          >
            Địa chỉ giao hàng
          </Typography>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none', borderRadius: 2 }}
            onClick={() => {
              setEditAddressId(null)
              setFormData({
                fullName: '',
                phone: '',
                address: '',
                city: '',
                district: '',
                ward: ''
              })
              setOpenAddressDialog(true)
            }}
          >
            Thêm
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <AddressTable
          addresses={addresses}
          onEdit={handleEditAddress}
          onDelete={handleDeleteAddress}
        />
      </Paper>

      <AddressDialog
        open={openAddressDialog}
        onClose={() => {
          setOpenAddressDialog(false)
          setEditAddressId(null)
          setFormData({
            fullName: '',
            phone: '',
            address: '',
            city: '',
            district: '',
            ward: ''
          })
          setDuplicateError('')
        }}
        editAddressId={editAddressId}
        formData={formData}
        formErrors={formErrors}
        provinces={provinces}
        districts={districts}
        wards={wards}
        onFormChange={handleFormChange}
        onSave={handleAddOrUpdateAddress}
        showSnackbar={showSnackbar}
        duplicateError={duplicateError}
      />

      <ConfirmDeleteDialog
        open={openConfirmDialog}
        onClose={() => {
          setOpenConfirmDialog(false)
          setAddressToDelete(null)
        }}
        onConfirm={confirmDeleteAddress}
      />
    </div>
  )
}

export default ShippingAddress
