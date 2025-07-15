import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert
} from '@mui/material'
import {
  Warning as WarningIcon
} from '@mui/icons-material'

const DeletePolicyModal = ({
  open,
  onClose,
  onConfirm,
  policy
}) => {
  if (!policy) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        gap: 1,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <WarningIcon color="warning" />
        <Typography variant="h6" component="div">
          Xác nhận xóa chính sách
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Hành động này không thể hoàn tác!
        </Alert>
        
        <Typography variant="body1" paragraph>
          Bạn có chắc chắn muốn xóa chính sách <strong>"{policy.title}"</strong>?
        </Typography>
        
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#f5f5f5', 
          borderRadius: 1,
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Tiêu đề:</strong> {policy.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Loại:</strong> {policy.type}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Trạng thái:</strong> {policy.status}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Tất cả dữ liệu liên quan đến chính sách này sẽ bị xóa vĩnh viễn.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
        <Button
          onClick={onClose}
          variant="outlined"
        >
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
        >
          Xóa chính sách
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeletePolicyModal 