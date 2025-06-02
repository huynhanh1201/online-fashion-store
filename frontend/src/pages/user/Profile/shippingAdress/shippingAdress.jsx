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
import ViewAddressDialog from './ViewAddressDialog'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'

function ShippingAddress({ showSnackbar }) {
  const [addresses, setAddresses] = useState([])
  const [openAddressDialog, setOpenAddressDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState(null)
  const [editAddressId, setEditAddressId] = useState(null)
  const [viewAddress, setViewAddress] = useState(null)
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

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/p/')
        const data = await response.json()
        setProvinces(data)
      } catch (error) {
        showSnackbar?.('Không thể tải danh sách tỉnh/thành!', 'error')
      }
    }
    fetchProvinces()
  }, [])

  // Fetch districts when city changes
  useEffect(() => {
    if (formData.city) {
      const fetchDistricts = async () => {
        try {
          const response = await fetch(
            `https://provinces.open-api.vn/api/p/${formData.city}?depth=2`
          )
          const data = await response.json()
          setDistricts(data.districts || [])
          if (!editAddressId) {
            setFormData((prev) => ({ ...prev, district: '', ward: '' }))
          }
          setWards([])
        } catch (error) {
          showSnackbar?.('Không thể tải danh sách quận/huyện!', 'error')
        }
      }
      fetchDistricts()
    } else {
      setDistricts([])
      setWards([])
    }
  }, [formData.city, editAddressId])

  // Fetch wards when district changes
  useEffect(() => {
    if (formData.district) {
      const fetchWards = async () => {
        try {
          const response = await fetch(
            `https://provinces.open-api.vn/api/d/${formData.district}?depth=2`
          )
          const data = await response.json()
          setWards(data.wards || [])
          if (!editAddressId) {
            setFormData((prev) => ({ ...prev, ward: '' }))
          }
        } catch (error) {
          showSnackbar?.('Không thể tải danh sách phường/xã!', 'error')
        }
      }
      fetchWards()
    } else {
      setWards([])
    }
  }, [formData.district, editAddressId])

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { addresses } = await getShippingAddresses()
        const validAddresses = (addresses || []).filter(
          (addr) =>
            addr._id && typeof addr._id === 'string' && addr._id.trim() !== ''
        )
        console.log('Fetched addresses:', validAddresses)
        setAddresses(validAddresses)
      } catch (error) {
        showSnackbar?.(
          `Lỗi khi tải danh sách địa chỉ: ${error.message}`,
          'error'
        )
        console.error('Fetch addresses error:', error)
      }
    }
    fetchAddresses()
  }, [])

  const handleAddOrUpdateAddress = async () => {
    const { fullName, phone, address, city, district, ward } = formData
    const errors = {
      fullName: !fullName.trim() || fullName.trim().length < 3,
      phone: !phone.trim() || !/^\d{10}$/.test(phone.trim()),
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

    const cityName = provinces.find((p) => p.code === city)?.name || ''
    const districtName = districts.find((d) => d.code === district)?.name || ''
    const wardName = wards.find((w) => w.code === ward)?.name || ''
    const addressData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      ward: wardName,
      district: districtName,
      city: cityName
    }
    const fullAddress = `${address}, ${wardName}, ${districtName}, ${cityName}`

    const isDuplicate = addresses.some(
      (addr) =>
        addr.fullName === addressData.fullName &&
        addr.phone === addressData.phone &&
        addr.address === addressData.address &&
        addr.ward === addressData.ward &&
        addr.district === addressData.district &&
        addr.city === addressData.city
    )
    if (isDuplicate && !editAddressId) {
      showSnackbar?.('Địa chỉ này đã tồn tại!', 'error')
      return
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
      console.error('Add/Update error:', errorMessage)
    }
  }

  const handleDeleteAddress = (id) => {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      showSnackbar?.('ID địa chỉ không hợp lệ!', 'error')
      console.error('Invalid address ID:', id)
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
      console.error('Delete error:', errorMessage)
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
      console.error('Invalid address _id:', address._id)
      return
    }

    setEditAddressId(address._id)
    const cityCode = provinces.find((p) => p.name === address.city)?.code || ''
    let districtCode = ''
    let wardCode = ''

    if (cityCode) {
      try {
        const districtResponse = await fetch(
          `https://provinces.open-api.vn/api/p/${cityCode}?depth=2`
        )
        const districtData = await districtResponse.json()
        setDistricts(districtData.districts || [])
        districtCode =
          districtData.districts.find((d) => d.name === address.district)
            ?.code || ''

        if (districtCode) {
          const wardResponse = await fetch(
            `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
          )
          const wardData = await wardResponse.json()
          setWards(wardData.wards || [])
          wardCode =
            wardData.wards.find((w) => w.name === address.ward)?.code || ''
        }
      } catch (error) {
        showSnackbar?.('Không thể tải thông tin địa chỉ!', 'error')
        console.error('Fetch districts/wards error:', error)
      }
    }

    setFormData({
      fullName: address.fullName || '',
      phone: address.phone || '',
      address: address.address || '',
      city: cityCode,
      district: districtCode,
      ward: wardCode
    })
    setOpenAddressDialog(true)
  }

  const handleViewAddress = (address) => {
    if (
      !address._id ||
      typeof address._id !== 'string' ||
      address._id.trim() === ''
    ) {
      showSnackbar?.('ID địa chỉ không hợp lệ!', 'error')
      console.error('Invalid address _id:', address._id)
      return
    }
    setViewAddress(address)
    setOpenViewDialog(true)
  }

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({
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
          <Typography variant='h6'>Danh sách địa chỉ giao hàng</Typography>
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
            Thêm địa chỉ
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <AddressTable
          addresses={addresses}
          onView={handleViewAddress}
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
        }}
        editAddressId={editAddressId}
        formData={formData}
        formErrors={formErrors}
        provinces={provinces}
        districts={districts}
        wards={wards}
        onFormChange={handleFormChange}
        onSave={handleAddOrUpdateAddress}
      />

      <ViewAddressDialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        address={viewAddress}
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
