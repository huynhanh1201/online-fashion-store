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
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  addShippingAddress,
  updateShippingAddress,
  getShippingAddresses,
} from '~/services/addressService';
import addressGHNService from '~/services/addressGHNService';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function AddAddressModal({
  open,
  onClose,
  onSuccess,
  addressToEdit = null,
  viewOnly = false,
  showSnackbar,
}) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
  });
  const [formErrors, setFormErrors] = useState({
    fullName: false,
    phone: false,
    address: false,
    city: false,
    district: false,
    ward: false,
  });
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  const isEditMode = !!addressToEdit;

  // Hàm kiểm tra trùng lặp địa chỉ
  const checkAddressDuplicate = async (addressData) => {
    try {
      const { addresses } = await getShippingAddresses();
      const addressesToCheck = isEditMode
        ? addresses.filter((addr) => addr._id !== addressToEdit._id)
        : addresses;

      const isDuplicate = addressesToCheck.some((addr) => {
        if (!addr || !addressData) return false;

        const isSameFullName =
          (addr.fullName || '').toLowerCase().trim() ===
          (addressData.fullName || '').toLowerCase().trim();
        const isSamePhone = (addr.phone || '').trim() === (addressData.phone || '').trim();
        const isSameAddress =
          (addr.address || '').toLowerCase().trim() ===
          (addressData.address || '').toLowerCase().trim();
        const isSameWard =
          (addr.ward || '').toLowerCase().trim() === (addressData.ward || '').toLowerCase().trim();
        const isSameDistrict =
          (addr.district || '').toLowerCase().trim() ===
          (addressData.district || '').toLowerCase().trim();
        const isSameCity =
          (addr.city || '').toLowerCase().trim() === (addressData.city || '').toLowerCase().trim();

        return (
          (isSameFullName && isSamePhone && isSameAddress && isSameWard && isSameDistrict && isSameCity) ||
          (isSamePhone && isSameAddress && isSameWard && isSameDistrict && isSameCity)
        );
      });

      return isDuplicate;
    } catch (error) {
      console.error('Lỗi khi kiểm tra trùng lặp địa chỉ:', error);
      return false;
    }
  };

  // Hàm xử lý thay đổi input
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'city') {
      setFormData((prev) => ({ ...prev, district: '', ward: '' }));
      setDistricts([]);
      setWards([]);
    }
    if (field === 'district') {
      setFormData((prev) => ({ ...prev, ward: '' }));
      setWards([]);
    }

    setFormErrors((prev) => ({
      ...prev,
      [field]:
        field === 'fullName'
          ? !value.trim() || value.trim().length < 3
          : field === 'phone'
          ? !value.trim() || !/^(0[3|5|7|8|9])[0-9]{8}$/.test(value.trim())
          : field === 'address'
          ? !value.trim() || value.trim().length < 5
          : !value,
    }));
  };

  // Reset form khi mở Modal
  useEffect(() => {
    if (open) {
      setFormData({
        fullName: addressToEdit?.fullName || '',
        phone: addressToEdit?.phone || '',
        address: addressToEdit?.address || '',
        city: '',
        district: '',
        ward: '',
      });
      setFormErrors({
        fullName: false,
        phone: false,
        address: false,
        city: false,
        district: false,
        ward: false,
      });
      setProvinces([]);
      setDistricts([]);
      setWards([]);
      setIsCheckingDuplicate(false);
    }
  }, [open, addressToEdit]);

  // Gọi API tỉnh/thành khi Modal mở
  useEffect(() => {
    if (!open) return;

    const fetchProvinces = async () => {
      try {
        const provinces = await addressGHNService.getProvinces();
        setProvinces(provinces);
      } catch (error) {
        console.error('Lỗi khi tải tỉnh/thành:', error);
        showSnackbar?.(error.message, 'error');
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
        const districts = await addressGHNService.getDistricts(formData.city);
        setDistricts(districts); // Sửa lỗi từ setDistrict thành setDistricts
        if (!isEditMode) {
          setFormData((prev) => ({ ...prev, district: '', ward: '' }));
        }
      } catch (error) {
        console.error('Lỗi khi tải quận/huyện:', error);
        showSnackbar?.(error.message, 'error');
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
        const wards = await addressGHNService.getWards(formData.district);
        setWards(wards);
        if (!isEditMode) {
          setFormData((prev) => ({ ...prev, ward: '' }));
        }
      } catch (error) {
        console.error('Lỗi khi tải phường/xã:', error);
        showSnackbar?.(error.message, 'error');
      }
    };

    fetchWards();
  }, [formData.district, isEditMode, showSnackbar]);

  // Load dữ liệu khi chỉnh sửa
  useEffect(() => {
    if (!open || !isEditMode || !addressToEdit || provinces.length === 0) return;

    const loadLocationCodes = async () => {
      try {
        // Tìm ProvinceID từ city name hoặc code
        const city = provinces.find(
          (p) =>
            p.name === addressToEdit.city ||
            String(p.code) === String(addressToEdit.city)
        );
        const cityCode = city?.code ? String(city.code) : '';
        if (!cityCode) {
          throw new Error('Không tìm thấy tỉnh/thành');
        }
        setFormData((prev) => ({ ...prev, city: cityCode }));

        // Gọi API quận/huyện
        const districts = await addressGHNService.getDistricts(cityCode);
        setDistricts(districts);

        // Tìm DistrictID từ district name hoặc code
        const district = districts.find(
          (d) =>
            d.name === addressToEdit.district ||
            String(d.code) === String(addressToEdit.district)
        );
        const districtCode = district?.code ? String(district.code) : '';
        if (!districtCode) {
          console.error('District not found:', addressToEdit.district, districts);
          throw new Error('Không tìm thấy quận/huyện');
        }
        setFormData((prev) => ({ ...prev, district: districtCode }));

        // Gọi API phường/xã
        const wards = await addressGHNService.getWards(districtCode);
        setWards(wards);

        // Tìm WardCode từ ward name hoặc code
        if (addressToEdit.ward) {
          const ward = wards.find(
            (w) =>
              w.name === addressToEdit.ward ||
              String(w.code) === String(addressToEdit.ward)
          );
          const wardCode = ward?.code ? String(ward.code) : '';
          if (!wardCode) {
            console.error('Ward not found:', addressToEdit.ward, wards);
          }
          setFormData((prev) => ({
            ...prev,
            fullName: addressToEdit.fullName || '',
            phone: addressToEdit.phone || '',
            address: addressToEdit.address || '',
            city: cityCode,
            district: districtCode,
            ward: wardCode,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            fullName: addressToEdit.fullName || '',
            phone: addressToEdit.phone || '',
            address: addressToEdit.address || '',
            city: cityCode,
            district: districtCode,
            ward: '',
          }));
        }

        setFormErrors({
          fullName: false,
          phone: false,
          address: false,
          city: false,
          district: false,
          ward: false,
        });
      } catch (error) {
        console.error('Lỗi khi tải thông tin địa chỉ:', error);
        showSnackbar?.(error.message, 'error');
      }
    };

    loadLocationCodes();
  }, [open, isEditMode, addressToEdit, provinces, showSnackbar]);

  // Xử lý submit
  const handleSubmit = async () => {
    const errors = {
      fullName: !formData.fullName.trim() || formData.fullName.trim().length < 3,
      phone:
        !formData.phone.trim() || !/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.phone.trim()),
      address: !formData.address.trim() || formData.address.trim().length < 5,
      city: !formData.city,
      district: !formData.district,
      ward: !formData.ward,
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
      city: cityName,
      cityId: parseInt(formData.city, 10),
      district: districtName,
      districtId: parseInt(formData.district, 10),
      ward: wardName,
      wardId: parseInt(formData.ward, 10),
    };

    // Kiểm tra ID hợp lệ
    if (isNaN(addressData.cityId) || isNaN(addressData.districtId) || isNaN(addressData.wardId)) {
      showSnackbar?.('Mã tỉnh/thành, quận/huyện hoặc phường/xã không hợp lệ!', 'error');
      return;
    }

    console.log('Submitting addressData:', addressData);

    setIsCheckingDuplicate(true);
    const isDuplicate = await checkAddressDuplicate(addressData);
    setIsCheckingDuplicate(false);

    if (isDuplicate) {
      showSnackbar?.(
        'Địa chỉ đã tồn tại! Vui lòng kiểm tra lại thông tin hoặc chọn địa chỉ khác.',
        'error'
      );
      return;
    }

    try {
      if (isEditMode) {
        const updated = await updateShippingAddress(addressToEdit._id, addressData);
        console.log('Update response:', updated);
        if (updated && updated._id) {
          showSnackbar?.('Sửa địa chỉ thành công!');
          onSuccess?.({ ...addressData, _id: addressToEdit._id });
          onClose();
        } else {
          showSnackbar?.('Không thể sửa địa chỉ!', 'error');
        }
      } else {
        const added = await addShippingAddress(addressData);
        console.log('Add response:', added);
        if (added && added._id) {
          showSnackbar?.('Thêm địa chỉ thành công!');
          onSuccess?.(added);
          onClose();
        } else {
          showSnackbar?.('Không thể thêm địa chỉ!', 'error');
        }
      }
    } catch (error) {
      console.error('API error:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || error.message || 'Không thể xử lý địa chỉ!';
      showSnackbar?.(`Lỗi: ${errorMessage}`, 'error');
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--primary-color)' }}>
          <LocationOnIcon sx={{ color: 'var(--primary-color)' }} />
          <Typography variant="h6">
            {viewOnly ? 'Xem địa chỉ' : isEditMode ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
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
          <Box component="form" noValidate autoComplete="off" sx={{ display: 'grid', gap: 2 }}>
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
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, '');
                if (onlyDigits.length <= 11) {
                  handleChange('phone')({ target: { value: onlyDigits } });
                }
              }}
              error={formErrors.phone}
              helperText={
                formErrors.phone ? 'Số điện thoại phải đúng định dạng Việt Nam (VD: 0912345678)' : ''
              }
              disabled={viewOnly}
            />
            <Autocomplete
              options={provinces}
              getOptionLabel={(option) => option.name}
              value={provinces.find((p) => p.code === formData.city) || null}
              onChange={(event, newValue) => {
                handleChange('city')({
                  target: { value: newValue?.code || '' },
                });
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
                handleChange('district')({
                  target: { value: newValue?.code || '' },
                });
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
                handleChange('ward')({
                  target: { value: newValue?.code || '' },
                });
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
              label="Địa chỉ chi tiết"
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
        <DialogActions sx={{ p: 3, backgroundColor: 'white', gap: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              color: '#64748b',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#f1f5f9',
              },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isCheckingDuplicate}
            sx={{
              background: 'var(--primary-color)',
              borderRadius: 2,
              px: 4,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(26, 60, 123, 0.4)',
              '&:hover': {
                background: '#153056',
                boxShadow: '0 6px 20px rgba(26, 60, 123, 0.6)',
              },
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666',
              },
            }}
          >
            {isCheckingDuplicate ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Đang kiểm tra...
              </>
            ) : isEditMode ? (
              'Lưu'
            ) : (
              'Thêm'
            )}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}