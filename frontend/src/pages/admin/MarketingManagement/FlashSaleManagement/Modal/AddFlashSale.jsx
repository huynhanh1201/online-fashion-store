import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Grid,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Tooltip,
  Card,
  Box,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  InputAdornment,
  Portal,
} from '@mui/material';
import { Delete as DeleteIcon, AddCircleOutline as AddCircleOutlineIcon, Search as SearchIcon } from '@mui/icons-material';
import { getProducts } from '~/services/productService';
import { createFlashSale, getFlashSaleConfig, updateFlashSaleConfig } from '~/services/admin/webConfig/flashsaleService';

const AddFlashSale = ({ open, onClose, onSave, initialData }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    enabled: true,
    title: '',
    startTime: '',
    endTime: '',
    products: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState({});
  const [dropdownPosition, setDropdownPosition] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const suggestionRefs = useRef({});
  const inputRefs = useRef({});

  // Khởi tạo form khi dialog mở
  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm(initialData);
      } else {
        setForm({
          enabled: true,
          title: '',
          startTime: '',
          endTime: '',
          products: [],
        });
      }
      setError('');
      setSuccess('');
    }
  }, [open, initialData]);

  // Lấy danh sách sản phẩm khi component mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { products } = await getProducts({ page: 1, limit: 1000 });
        console.log('Danh sách sản phẩm:', products);
        setAllProducts(products);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', err);
      }
    };
    fetchAllProducts();
  }, []);

  // Xử lý click ngoài để đóng danh sách gợi ý
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(showSuggestions).forEach((index) => {
        if (showSuggestions[index] && suggestionRefs.current[index]) {
          if (!suggestionRefs.current[index].contains(event.target)) {
            setShowSuggestions((prev) => ({ ...prev, [index]: false }));
            setProductSuggestions([]);
          }
        }
      });
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSuggestions]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearMessages();
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...form.products];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, products: updated }));
    clearMessages();
  };

  const handleAddProduct = () => {
    setForm((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { _id: '', productName: '', originalPrice: '', flashPrice: '', image: [] },
      ],
    }));
    clearMessages();
  };

  const handleRemoveProduct = (index) => {
    const updated = [...form.products];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, products: updated }));
    clearMessages();
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Lấy gợi ý sản phẩm dựa trên tìm kiếm
  const fetchProductSuggestions = async (searchText, index) => {
    if (!searchText.trim()) {
      setProductSuggestions([]);
      setShowSuggestions((prev) => ({ ...prev, [index]: false }));
      return;
    }

    setSuggestionLoading(true);
    try {
      const filtered = allProducts
        .filter((product) => product.name.toLowerCase().includes(searchText.toLowerCase()))
        .slice(0, 5);
      setProductSuggestions(filtered);
      setShowSuggestions((prev) => ({ ...prev, [index]: true }));
    } catch (error) {
      console.error('Lỗi khi tìm kiếm sản phẩm:', error);
      setProductSuggestions([]);
    } finally {
      setSuggestionLoading(false);
    }
  };

  // Cập nhật vị trí dropdown gợi ý
  const updateDropdownPosition = (index) => {
    if (inputRefs.current[index]) {
      const rect = inputRefs.current[index].getBoundingClientRect();
      setDropdownPosition((prev) => ({
        ...prev,
        [index]: {
          top: rect.bottom,
          left: rect.left,
          width: rect.width,
        },
      }));
    }
  };

  // Xử lý thay đổi tên sản phẩm với debounce
  const handleProductNameChange = (index, value) => {
    handleProductChange(index, 'productName', value);
    handleProductChange(index, '_id', '');

    if (!value.trim()) {
      setShowSuggestions((prev) => ({ ...prev, [index]: false }));
      setProductSuggestions([]);
      return;
    }

    updateDropdownPosition(index);

    const timeoutId = setTimeout(() => {
      fetchProductSuggestions(value, index);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Xử lý chọn sản phẩm từ gợi ý
  const handleProductSelect = (index, product) => {
    const prod = allProducts.find((p) => p._id === product._id);
    if (prod) {
      const newProduct = {
        _id: prod._id,
        productName: prod.name,
        exportPrice: prod.exportPrice || prod.price || 0,
        flashPrice: form.products[index]?.flashPrice || '',
        image: prod.image || [],
      };
      const updatedProducts = [...form.products];
      updatedProducts[index] = newProduct;
      setForm((prev) => ({ ...prev, products: updatedProducts }));
    }
    setShowSuggestions((prev) => ({ ...prev, [index]: false }));
    setProductSuggestions([]);
  };

  // Kiểm tra dữ liệu form
  const validateForm = () => {
    const errors = [];

    if (!form.title?.trim()) {
      errors.push('Tiêu đề không được để trống');
    }

    if (!form.startTime) {
      errors.push('Thời gian bắt đầu không được để trống');
    }

    if (!form.endTime) {
      errors.push('Thời gian kết thúc không được để trống');
    }

    if (form.startTime && form.endTime && new Date(form.startTime) >= new Date(form.endTime)) {
      errors.push('Thời gian bắt đầu phải trước thời gian kết thúc');
    }

    if (form.products.length === 0) {
      errors.push('Vui lòng thêm ít nhất một sản phẩm');
    }

    form.products.forEach((product, index) => {
      if (!product._id?.trim()) {
        errors.push(`Sản phẩm ${index + 1} chưa được chọn`);
      }
      if (!product.exportPrice || isNaN(product.exportPrice) || product.exportPrice <= 0) {
        errors.push(`Giá bán hiện tại của sản phẩm ${index + 1} phải là số dương`);
      }
      if (!product.flashPrice || isNaN(product.flashPrice) || product.flashPrice <= 0) {
        errors.push(`Giá Flash Sale của sản phẩm ${index + 1} phải là số dương`);
      }
      if (
        product.exportPrice &&
        product.flashPrice &&
        parseFloat(product.flashPrice) >= parseFloat(product.exportPrice)
      ) {
        errors.push(`Giá Flash Sale của sản phẩm ${index + 1} phải thấp hơn giá bán hiện tại`);
      }
    });

    return errors;
  };

  // Xử lý lưu Flash Sale
  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const cleanedProducts = form.products
        .filter((p) => p._id && p._id.trim() !== '' && p.flashPrice && !isNaN(p.flashPrice))
        .map((p) => ({
          productId: p._id,
          name: p.productName,
          originalPrice: Number(p.exportPrice),
          flashPrice: Number(p.flashPrice),
        }));
    
      if (!Array.isArray(cleanedProducts) || cleanedProducts.length === 0) {
        setError('Bạn phải chọn ít nhất 1 sản phẩm hợp lệ cho Flash Sale!');
        setLoading(false);
        return;
      }
      const cleanedForm = {
        enabled: form.enabled,
        title: form.title,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        products: cleanedProducts
      };
      const errors = validateForm();
      if (errors.length > 0) {
        setError(errors.join(', '));
        setLoading(false);
        return;
      }
      let hasConfig = false;
      let configId = null;
      try {
        const config = await getFlashSaleConfig();
        if (config && config.products !== undefined) {
          hasConfig = true;
          configId = config._id;
        }
      } catch (e) {
        console.log('Chưa có cấu hình Flash Sale, sẽ tạo mới.');
      }
      if (hasConfig && configId) {
        const result = await updateFlashSaleConfig({
          ...cleanedForm,
          _id: configId,
        });
        setSuccess('Cập nhật Flash Sale thành công!');
      } else {
        const result = await createFlashSale(cleanedForm);
        setSuccess('Tạo Flash Sale thành công!');
      }
      onSave(cleanedForm);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Chi tiết lỗi:', err);
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi lưu Flash Sale.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          py: 2,
          fontWeight: 700,
          fontSize: '1.5rem',
          color: '#1e293b',
        }}
      >
        {initialData ? 'Chỉnh sửa Flash Sale' : 'Thêm Flash Sale'}
      </DialogTitle>
      <DialogContent dividers sx={{ backgroundColor: '#f8fafc', py: 3 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.error.main, 0.08),
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.success.main, 0.08),
              border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
            }}
          >
            {success}
          </Alert>
        )}

        <Stack spacing={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.enabled}
                onChange={(e) => handleChange('enabled', e.target.checked)}
                sx={{
                  color: '#3b82f6',
                  '&.Mui-checked': {
                    color: '#3b82f6',
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 500 }}>
                Kích hoạt Flash Sale
              </Typography>
            }
          />

          <TextField
            fullWidth
            label="Tiêu đề *"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#fff',
              },
            }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Thời gian bắt đầu *"
                value={form.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#fff',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Thời gian kết thúc *"
                value={form.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#fff',
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <AddCircleOutlineIcon sx={{ color: '#3b82f6' }} />
              Sản phẩm Flash Sale
            </Typography>
            <Box
              sx={{
                maxHeight: 300,
                overflowY: 'auto',
                pr: 1,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f5f9',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#cbd5e1',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#94a3b8',
                  },
                },
              }}
            >
              {form.products.map((product, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#fff',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ position: 'relative' }} ref={(el) => (suggestionRefs.current[index] = el)}>
                        <TextField
                          ref={(el) => (inputRefs.current[index] = el)}
                          fullWidth
                          label="Tên sản phẩm *"
                          value={product.productName || ''}
                          onChange={(e) => handleProductNameChange(index, e.target.value)}
                          onFocus={() => {
                            updateDropdownPosition(index);
                            if (product.productName && productSuggestions.length > 0) {
                              setShowSuggestions((prev) => ({ ...prev, [index]: true }));
                            }
                          }}
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {suggestionLoading && showSuggestions[index] && <CircularProgress size={20} />}
                                <SearchIcon sx={{ color: '#64748b' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#fff',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Giá bán hiện tại (exportPrice) *"
                        type="number"
                        value={product.exportPrice ?? ''}
                        InputProps={{ readOnly: true }}
                        required
                        inputProps={{ min: 0 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#fff',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Giá Flash Sale *"
                        type="number"
                        value={product.flashPrice}
                        onChange={(e) => handleProductChange(index, 'flashPrice', e.target.value)}
                        required
                        inputProps={{ min: 0 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#fff',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      {product.image && product.image.length > 0 && (
                        <img
                          src={product.image[0] || '/fallback.jpg'}
                          alt={product.productName}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/fallback.jpg';
                          }}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={1} sx={{ textAlign: { sm: 'right' } }}>
                      <Tooltip title="Xóa sản phẩm">
                        <IconButton
                          onClick={() => handleRemoveProduct(index)}
                          sx={{
                            color: '#ef4444',
                            '&:hover': { backgroundColor: '#fee2e2' },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Box>
            <Button
              onClick={handleAddProduct}
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                mt: 2,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                color: '#3b82f6',
                borderColor: '#3b82f6',
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: '#2563eb',
                },
              }}
            >
              Thêm sản phẩm mới
            </Button>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            color: '#64748b',
            px: 3,
            py: 1,
            '&:hover': {
              backgroundColor: alpha(theme.palette.grey[500], 0.08),
            },
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || form.products.length === 0 || form.products.some((p) => !p._id)}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            px: 3,
            py: 1,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              background: 'linear-gradient(135deg, #93c5fd 0%, #a5b4fc 100%)',
              color: '#fff',
            },
          }}
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>

      {/* Render dropdowns using Portal */}
      {Object.keys(showSuggestions).map((index) => {
        if (showSuggestions[index] && productSuggestions.length > 0 && dropdownPosition[index]) {
          return (
            <Portal key={index}>
              <Paper
                sx={{
                  position: 'fixed',
                  top: dropdownPosition[index].top + 4,
                  left: dropdownPosition[index].left,
                  width: dropdownPosition[index].width,
                  zIndex: 99999,
                  maxHeight: 200,
                  overflowY: 'auto',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  backgroundColor: '#fff',
                }}
              >
                <List sx={{ padding: 0 }}>
                  {productSuggestions.map((suggestion) => (
                    <ListItem key={suggestion._id} disablePadding sx={{ borderBottom: '1px solid #f1f5f9' }}>
                      <ListItemButton
                        onClick={() => handleProductSelect(parseInt(index), suggestion)}
                        sx={{
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <img
                            src={suggestion.image?.[0] || '/fallback.jpg'}
                            alt={suggestion.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/fallback.jpg';
                            }}
                            style={{
                              width: 40,
                              height: 40,
                              objectFit: 'cover',
                              borderRadius: 4,
                              flexShrink: 0,
                            }}
                          />
                          <Box sx={{ flex: 1, overflow: 'hidden' }}>
                            <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ maxWidth: '200px' }}>
                              {suggestion.name}
                            </Typography>
                            <Typography variant="body2" color="primary" fontWeight={500}>
                              {(suggestion.exportPrice || 0).toLocaleString()} VND
                            </Typography>
                          </Box>
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Portal>
          );
        }
        return null;
      })}
    </Dialog>
  );
};

export default AddFlashSale;