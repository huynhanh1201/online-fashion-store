import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box
} from '@mui/material'

const partnerTypes = [
  { value: 'supplier', label: 'Nhà cung cấp' },
  { value: 'customer', label: 'Khách hàng' },
  { value: 'both', label: 'Khách hàng & NCC' }
]

export default function EditPartnerModal({
  open,
  onClose,
  partner,
  updatePartner,
  fetchPartners
}) {
  const [form, setForm] = useState({
    name: '',
    type: '',
    phone: '',
    email: ''
  })

  useEffect(() => {
    if (partner) {
      setForm({
        name: partner.name || '',
        type: partner.type || '',
        phone: partner.contact?.phone || '',
        email: partner.contact?.email || ''
      })
    }
  }, [partner])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    if (!form.name || !form.type) {
      alert('Vui lòng nhập tên và loại đối tác')
      return
    }
    const updated = {
      name: form.name,
      type: form.type,
      contact: {
        phone: form.phone,
        email: form.email
      }
    }
    updatePartner(partner._id, updated)
    onClose()
    fetchPartners() // Refresh partners after update
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth='sm'>
      <DialogTitle>Sửa thông tin đối tác</DialogTitle>
      <DialogContent>
        <Box
          component='form'
          noValidate
          autoComplete='off'
          sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label='Tên đối tác'
            name='name'
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            select
            label='Loại đối tác'
            name='type'
            value={form.type}
            onChange={handleChange}
            fullWidth
            required
          >
            {partnerTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label='Điện thoại'
            name='phone'
            value={form.phone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label='Email'
            name='email'
            type='email'
            value={form.email}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color='inherit'>
          Hủy
        </Button>
        <Button onClick={handleSave} variant='contained'>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}
