import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid
} from '@mui/material'

export default function ViewPermissionModal({ open, permission, onClose }) {
  if (!permission) return null

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thông tin quyền</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>
              <strong>Nhóm quyền:</strong> {permission.group}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Key:</strong> {permission.key}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Tên quyền:</strong> {permission.label}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='contained'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
