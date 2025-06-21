import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem
} from '@mui/material'

const AddBanner = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({
    imageUrl: '',
    title: '',
    subtitle: '',
    link: '',
    position: 'hero',
    visible: true,
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    if (initialData) {
      setForm({ ...form, ...initialData })
    }
  }, [initialData])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(form)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        {initialData ? 'Chỉnh sửa Banner' : 'Thêm Banner'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label='Đường dẫn ảnh'
              value={form.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label='Tiêu đề'
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label='Phụ đề'
              value={form.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label='Link điều hướng'
              value={form.link}
              onChange={(e) => handleChange('link', e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label='Vị trí hiển thị'
              value={form.position}
              onChange={(e) => handleChange('position', e.target.value)}
              fullWidth
            >
              <MenuItem value='hero'>Hero</MenuItem>
              <MenuItem value='sidebar'>Sidebar</MenuItem>
              <MenuItem value='popup'>Popup</MenuItem>
              {/* thêm tùy chọn khác nếu bạn cần */}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.visible}
                  onChange={(e) => handleChange('visible', e.target.checked)}
                />
              }
              label='Hiển thị banner'
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type='date'
              label='Ngày bắt đầu'
              value={form.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type='date'
              label='Ngày kết thúc'
              value={form.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant='contained' onClick={handleSave}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddBanner
