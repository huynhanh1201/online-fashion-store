import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

const POLICY_LABELS = {
  terms_of_service: 'Điều khoản sử dụng',
  privacy_policy: 'Chính sách bảo mật',
  return_policy: 'Chính sách đổi trả',
  shipping_policy: 'Chính sách vận chuyển',
  warranty_policy: 'Chính sách bảo hành'
}

const POLICY_COLORS = {
  terms_of_service: 'primary',
  privacy_policy: 'secondary',
  return_policy: 'success',
  shipping_policy: 'info',
  warranty_policy: 'warning'
}

const STATUS_LABELS = {
  active: 'Hoạt động',
  inactive: 'Không hoạt động',
  draft: 'Bản nháp'
}

const STATUS_COLORS = {
  active: 'success',
  inactive: 'error',
  draft: 'warning'
}

const ViewPolicyModal = ({ open, onClose, policy }) => {
  if (!policy) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '80vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Typography variant='h6' component='div'>
          Chi tiết chính sách
        </Typography>
        <Button
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
            minWidth: 'auto'
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Header Info */}
          <Box>
            <Typography variant='h5' component='h1' gutterBottom>
              {policy.title}
            </Typography>

            <Box display='flex' gap={2} flexWrap='wrap' mb={2}>
              <Chip
                label={POLICY_LABELS[policy.type] || policy.type}
                color={POLICY_COLORS[policy.type] || 'default'}
                size='small'
              />
              <Chip
                label={STATUS_LABELS[policy.status] || policy.status}
                color={STATUS_COLORS[policy.status] || 'default'}
                size='small'
              />
            </Box>

            {policy.description && (
              <Typography variant='body1' color='text.secondary' paragraph>
                {policy.description}
              </Typography>
            )}
          </Box>

          <Divider />

          {/* Content */}
          <Box>
            <Typography variant='h6' gutterBottom>
              Nội dung chính sách
            </Typography>
            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                p: 2,
                backgroundColor: '#fafafa',
                minHeight: '300px',
                maxHeight: '500px',
                overflow: 'auto',
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto'
                },
                '& table': {
                  width: '100%',
                  borderCollapse: 'collapse',
                  wordBreak: 'break-word'
                },
                '& table td, & table th': {
                  border: '1px solid #ccc',
                  padding: '4px'
                }
              }}
              dangerouslySetInnerHTML={{ __html: policy.content }}
            />
          </Box>

          {/* Metadata */}
          <Divider />

          <Box>
            <Typography variant='subtitle2' color='text.secondary' gutterBottom>
              Thông tin chi tiết
            </Typography>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography variant='body2'>
                <strong>Ngày tạo:</strong>{' '}
                {new Date(policy.createdAt).toLocaleDateString('vi-VN')}
              </Typography>
              <Typography variant='body2'>
                <strong>Cập nhật lần cuối:</strong>{' '}
                {new Date(policy.updatedAt).toLocaleDateString('vi-VN')}
              </Typography>
              {policy.createdBy && (
                <Typography variant='body2'>
                  <strong>Người tạo:</strong> {policy.createdBy}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onClose} variant='outlined'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewPolicyModal
