import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import { WarningAmber } from '@mui/icons-material'
import { updateFooterConfig } from '~/services/admin/webConfig/footerService'

const DeleteFooterModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      // Update the footer with empty content instead of deleting it
      await updateFooterConfig([])
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Failed to clear footer content:', error)
      // Optionally, show an error to the user
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmber color="error" />
        Xác nhận xóa
      </DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xóa nội dung chân trang này không? Hành động này không thể hoàn tác.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Hủy</Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={loading}>
          {loading ? 'Đang xóa...' : 'Xác nhận xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteFooterModal
