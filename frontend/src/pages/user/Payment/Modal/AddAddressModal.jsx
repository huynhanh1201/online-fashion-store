import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Divider,
  Box,
  IconButton,
  Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { addShippingAddress, updateShippingAddress } from '~/services/addressService';
import { GHN_TOKEN_API } from '~/utils/constants';

export default function AddAddressModal({
  open,
  onClose,
  onSuccess,
  addressToEdit = null,
  viewOnly = false,
  showSnackbar
}) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [formData, setFormData] = useState({
    fullName: addressToEdit?.fullName || '',
    phone: addressToEdit?.phone || '',
    address: addressToEdit?.address || '',
    city: addressToEdit?.city || '', // Lưu ProvinceID
    district: addressToEdit?.district || '', // Lưu DistrictID
    ward: addressToEdit?.ward || '' // Lưu WardCode
  });
  const [formErrors, setFormErrors] = useState({
    fullName: false,
    phone: false,
    address: false,
    city: false,
    district: false,
    ward: false
  });

  const isEditMode = !!addressToEdit;

  // Hàm xử lý thay đổi input
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Reset quận/huyện và phường/xã khi tỉnh/thành thay đổi
    if (field === 'city') {
      setFormData((prev) => ({ ...prev, district: '', ward: '' }));
      setDistricts([]);
      setWards([]);
    }
    // Reset phường/xã khi quận/huyện thay đổi
    if (field === 'district') {
      setFormData((prev) => ({ ...prev, ward: '' }));
      setWards([]);
    }

    // Xác thực
    setFormErrors((prev) => ({
      ...prev,
      [field]:
        field === 'fullName' ? !value.trim() || value.trim().length < 3 :
          field === 'phone' ? !value.trim() || !/^\d{10}$/.test(value.trim()) :
            field === 'address' ? !value.trim() || value.trim().length < 5 :
              !value
    }));
  };

  // Reset form khi mở modal
  useEffect(() => {
    if (open) {
      setFormData({
        fullName: addressToEdit?.fullName || '',
        phone: addressToEdit?.phone || '',
        address: addressToEdit?.address || '',
        city: addressToEdit?.city || '',
        district: addressToEdit?.district || '',
        ward: addressToEdit?.ward || ''
      });
      setFormErrors({
        fullName: false,
        phone: false,
        address: false,
        city: false,
        district: false,
        ward: false
      });
    }
  }, [open, addressToEdit]);

  // Gọi API tỉnh/thành khi modal mở
  useEffect(() => {
    if (!open) return;

    const fetchProvinces = async () => {
      try {
        const provinceRes = await fetch(
          'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Token': GHN_TOKEN_API
            }
          }
        );
        if (!provinceRes.ok) {
          throw new Error(`Lỗi tải tỉnh/thành: ${provinceRes.status} ${provinceRes.statusText}`);
        }
        const provinceData = await provinceRes.json();
        if (provinceData.code !== 200 || !provinceData.data) {
          throw new Error('Không có dữ liệu tỉnh/thành');
        }
        const provinces = provinceData.data.map((p) => ({
          code: String(p.ProvinceID),
          name: p.ProvinceName
        }));
        setProvinces(provinces);
      } catch (error) {
        console.error('Lỗi khi tải tỉnh/thành:', error);
        showSnackbar?.(`Không thể tải dữ liệu tỉnh/thành: ${error.message}`, 'error');
      }
    };

    fetchProvinces();
  }, [open, showSnackbar]);

  // Gọi API quận/huyện khi tỉnh/thành thay đổi
  useEffect(() => {
    if (!formData.city) {
      setDistricts([]);
      setWards([]);
      setFormData((prev) => ({ ...prev, district: '', ward: '' }));
      return;
    }

    const fetchDistricts = async () => {
      try {
        const districtRes = await fetch(
          'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
          {
            method: 'POST',
            headers: {
              'Token': GHN_TOKEN_API,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ province_id: parseInt(formData.city) })
          }
        );
        if (!districtRes.ok) {
          throw new Error(`Lỗi tải quận/huyện: ${districtRes.status} ${districtRes.statusText}`);
        }
        const districtData = await districtRes.json();
        if (districtData.code !== 200 || !districtData.data) {
          throw new Error('Không có dữ liệu quận/huyện');
        }
        const districts = districtData.data.map((d) => ({
          code: String(d.DistrictID),
          name: d.DistrictName
        }));
        setDistricts(districts);
        if (!isEditMode) {
          setFormData((prev) => ({ ...prev, district: '', ward: '' }));
        }
      } catch (error) {
        console.error('Lỗi khi tải quận/huyện:', error);
        showSnackbar?.(`Không thể tải dữ liệu quận/huyện: ${error.message}`, 'error');
      }
    };

    fetchDistricts();
  }, [formData.city, isEditMode, showSnackbar]);

  // Gọi API phường/xã khi quận/huyện thay đổi
  useEffect(() => {
    if (!formData.district) {
      setWards([]);
      setFormData((prev) => ({ ...prev, ward: '' }));
      return;
    }

    const fetchWards = async () => {
      try {
        const wardRes = await fetch(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${formData.district}`,
          {
            method: 'GET',
            headers: {
              'Token': GHN_TOKEN_API,
              'Content-Type': 'application/json'
            }
          }
        );
        if (!wardRes.ok) {
          throw new Error(`Lỗi tải phường/xã: ${wardRes.status} ${wardRes.statusText}`);
        }
        const wardData = await wardRes.json();
        if (wardData.code !== 200 || !wardData.data) {
          throw new Error('Không có dữ liệu phường/xã');
        }
        const wards = wardData.data.map((w) => ({
          code: String(w.WardCode),
          name: w.WardName
        }));
        setWards(wards);
        if (!isEditMode) {
          setFormData((prev) => ({ ...prev, ward: '' }));
        }
      } catch (error) {
        console.error('Lỗi khi tải phường/xã:', error);
        showSnackbar?.(`Không thể tải dữ liệu phường/xã: ${error.message}`, 'error');
      }
    };

    fetchWards();
  }, [formData.district, isEditMode, showSnackbar]);

  // Load dữ liệu khi chỉnh sửa
  useEffect(() => {
    if (!open || !isEditMode || !addressToEdit || provinces.length === 0) return;

    const loadLocationCodes = async () => {
      try {
        // Tìm ProvinceID từ city name
        const city = provinces.find((p) => p.name === addressToEdit.city || String(p.code) === String(addressToEdit.city));
        const cityCode = city?.code || '';
        if (!cityCode) throw new Error('Không tìm thấy tỉnh/thành');
        setFormData((prev) => ({ ...prev, city: cityCode }));

        // Gọi API quận/huyện
        const districtRes = await fetch(
          'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
          {
            method: 'POST',
            headers: {
              'Token': GHN_TOKEN_API,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ province_id: parseInt(cityCode) })
          }
        );
        if (!districtRes.ok) throw new Error('Lỗi tải quận/huyện');
        const districtData = await districtRes.json();
        if (districtData.code !== 200 || !districtData.data) throw new Error('Không có dữ liệu quận/huyện');
        const districts = districtData.data.map((d) => ({
          code: String(d.DistrictID),
          name: d.DistrictName
        }));
        setDistricts(districts);

        // Tìm DistrictID từ district name
        const district = districts.find((d) => d.name === addressToEdit.district || String(d.code) === String(addressToEdit.district));
        const districtCode = district?.code || '';
        if (!districtCode) throw new Error('Không tìm thấy quận/huyện');
        setFormData((prev) => ({ ...prev, district: districtCode }));

        // Gọi API phường/xã
        const wardRes = await fetch(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtCode}`,
          {
            method: 'GET',
            headers: {
              'Token': GHN_TOKEN_API,
              'Content-Type': 'application/json'
            }
          }
        );
        if (!wardRes.ok) throw new Error('Lỗi tải phường/xã');
        const wardData = await wardRes.json();
        if (wardData.code !== 200 || !wardData.data) throw new Error('Không có dữ liệu phường/xã');
        const wards = wardData.data.map((w) => ({
          code: String(w.WardCode),
          name: w.WardName
        }));
        setWards(wards);

        // Tìm WardCode từ ward name
        const ward = wards.find((w) => w.name === addressToEdit.ward || String(w.code) === String(addressToEdit.ward));
        const wardCode = ward?.code || '';

        // Cập nhật formData
        setFormData({
          fullName: addressToEdit.fullName || '',
          phone: addressToEdit.phone || '',
          address: addressToEdit.address || '',
          city: cityCode,
          district: districtCode,
          ward: wardCode
        });
        setFormErrors({
          fullName: false,
          phone: false,
          address: false,
          city: false,
          district: false,
          ward: false
        });
      } catch (error) {
        console.error('Lỗi khi tải thông tin địa chỉ:', error);
        showSnackbar?.(`Không thể tải thông tin địa chỉ: ${error.message}`, 'error');
      }
    };

    loadLocationCodes();
  }, [open, isEditMode, addressToEdit, provinces, showSnackbar]);

  // Xử lý submit
  const handleSubmit = async () => {
    const errors = {
      fullName: !formData.fullName.trim() || formData.fullName.trim().length < 3,
      phone: !formData.phone.trim() || !/^\d{10}$/.test(formData.phone.trim()),
      address: !formData.address.trim() || formData.address.trim().length < 5,
      city: !formData.city,
      district: !formData.district,
      ward: !formData.ward
    };
    setFormErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      showSnackbar?.('Vui lòng điền đầy đủ và đúng thông tin địa chỉ!', 'error');
      return;
    }

    // Lấy tên và mã định danh từ các danh sách
    const cityName = provinces.find((p) => p.code === formData.city)?.name || '';
    const districtName = districts.find((d) => d.code === formData.district)?.name || '';
    const wardName = wards.find((w) => w.code === formData.ward)?.name || '';

    const addressData = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: cityName, // Tên thành phố/tỉnh
      cityId: formData.city, // Mã định danh thành phố/tỉnh
      district: districtName, // Tên quận/huyện
      districtId: formData.district, // Mã định danh quận/huyện
      ward: wardName, // Tên phường/xã
      wardId: formData.ward // Mã định danh phường/xã
    };

    try {
      if (isEditMode) {
        const updated = await updateShippingAddress(addressToEdit._id, addressData);
        if (updated && updated._id) {
          showSnackbar?.('Sửa địa chỉ thành công!');
          onSuccess?.({ ...addressData, _id: addressToEdit._id });
          onClose();
        } else {
          showSnackbar?.('Không thể sửa địa chỉ!', 'error');
        }
      } else {
        const added = await addShippingAddress(addressData);
        if (added && added._id) {
          showSnackbar?.('Thêm địa chỉ thành công!');
          onSuccess?.(added);
          onClose();
        } else {
          showSnackbar?.('Không thể thêm địa chỉ!', 'error');
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Không thể xử lý địa chỉ!';
      showSnackbar?.(`Lỗi: ${errorMessage}`, 'error');
    }
  };

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
            <Autocomplete
              options={provinces}
              getOptionLabel={(option) => option.name}
              value={provinces.find((p) => p.code === formData.city) || null}
              onChange={(event, newValue) => {
                handleChange('city')({ target: { value: newValue?.code || '' } });
              }}
              noOptionsText="Không có kết quả"
              disabled={viewOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tỉnh/Thành"
                  error={!!formErrors.city}
                  helperText={formErrors.city && 'Vui lòng chọn tỉnh/thành'}
                />
              )}
            />
            <Autocomplete
              options={districts}
              getOptionLabel={(option) => option.name}
              value={districts.find((d) => d.code === formData.district) || null}
              onChange={(event, newValue) => {
                handleChange('district')({ target: { value: newValue?.code || '' } });
              }}
              noOptionsText="Không có kết quả"
              disabled={viewOnly || !formData.city || districts.length === 0}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Quận/Huyện"
                  error={!!formErrors.district}
                  helperText={formErrors.district && 'Vui lòng chọn quận/huyện'}
                />
              )}
            />
            <Autocomplete
              options={wards}
              getOptionLabel={(option) => option.name}
              value={wards.find((w) => w.code === formData.ward) || null}
              onChange={(event, newValue) => {
                handleChange('ward')({ target: { value: newValue?.code || '' } });
              }}
              noOptionsText="Không có kết quả"
              disabled={viewOnly || !formData.district || wards.length === 0}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Phường/Xã"
                  error={!!formErrors.ward}
                  helperText={formErrors.ward && 'Vui lòng chọn phường/xã'}
                />
              )}
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
  );
}