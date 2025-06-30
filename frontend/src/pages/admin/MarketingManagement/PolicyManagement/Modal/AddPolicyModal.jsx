import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material'
import {
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import DescriptionEditor from '~/components/EditContent/DescriptionEditor.jsx'

const POLICY_TYPES = [
  { value: 'terms_of_service', label: 'Điều khoản sử dụng' },
  { value: 'privacy_policy', label: 'Chính sách bảo mật' },
  { value: 'member_policy', label: 'Chính sách member' },
  { value: 'return_policy', label: 'Chính sách đổi trả' },
  { value: 'shipping_policy', label: 'Chính sách vận chuyển' },
  { value: 'warranty_policy', label: 'Chính sách bảo hành' }
]

const PolicyModal = ({
  open,
  onClose,
  onSave,
  policyData = null,
  mode = 'add'
}) => {
  const isEditMode = mode === 'edit' && policyData
  const [saving, setSaving] = useState(false)
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      type: '',
      description: '',
      content: '',
      status: 'active'
    }
  })

  // Effect to populate form when editing
  useEffect(() => {
    if (isEditMode && policyData) {
      reset({
        title: policyData.title || '',
        type: policyData.type || '',
        description: policyData.description || '',
        content: policyData.content || '',
        status: policyData.status || 'active'
      })
    } else {
      reset({
        title: '',
        type: '',
        description: '',
        content: '',
        status: 'active'
      })
    }
  }, [isEditMode, policyData, reset])

  const onSubmit = async (data) => {
    try {
      setSaving(true)
      
      // Validate required fields
      if (!data.title.trim()) {
        toast.error('Vui lòng nhập tiêu đề chính sách')
        return
      }
      
      if (!data.type) {
        toast.error('Vui lòng chọn loại chính sách')
        return
      }
      
      if (!data.content.trim()) {
        toast.error('Vui lòng nhập nội dung chính sách')
        return
      }

      await onSave(data, isEditMode)
    } catch (error) {
      console.error('Lỗi khi lưu chính sách:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Typography variant="h6" component="div">
          {isEditMode ? 'Chỉnh sửa chính sách' : 'Thêm chính sách mới'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Title */}
            <TextField
              {...register('title', { required: 'Tiêu đề là bắt buộc' })}
              label="Tiêu đề chính sách"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white'
                }
              }}
            />

            {/* Type */}
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Loại chính sách</InputLabel>
              <Controller
                name="type"
                control={control}
                rules={{ required: 'Loại chính sách là bắt buộc' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Loại chính sách"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'white'
                    }}
                  >
                    {POLICY_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.type && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.type.message}
                </Typography>
              )}
            </FormControl>

            {/* Description */}
            <TextField
              {...register('description')}
              label="Mô tả ngắn"
              fullWidth
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message || 'Mô tả ngắn về chính sách (không bắt buộc)'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white'
                }
              }}
            />

            {/* Status */}
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Trạng thái"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'white'
                    }}
                  >
                    <MenuItem value="active">Hoạt động</MenuItem>
                    <MenuItem value="draft">Bản nháp</MenuItem>
                    <MenuItem value="archived">Lưu trữ</MenuItem>
                  </Select>
                )}
              />
            </FormControl>

            {/* Content */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Nội dung chính sách *
              </Typography>
              <Controller
                name="content"
                control={control}
                rules={{ required: 'Nội dung là bắt buộc' }}
                render={({ field }) => (
                  <DescriptionEditor
                    control={control}
                    name="content"
                    setValue={setValue}
                    initialHtml={field.value}
                    sx={{
                      border: errors.content ? '1px solid #d32f2f' : '1px solid #e0e0e0',
                      borderRadius: 2,
                      minHeight: '300px'
                    }}
                  />
                )}
              />
              {errors.content && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.content.message}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={saving}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={saving}
          >
            {saving ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default PolicyModal 