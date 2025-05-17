import React, { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Radio, RadioGroup, FormControlLabel,
  IconButton, CircularProgress
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useAddress } from '~/hook/useAddress'
import AddAddressModal from './AddAddressModal'

export const ChooseAddressModal = ({ open, onClose, onConfirm }) => {
  const {
    addresses,
    loading,
    fetchAddresses
  } = useAddress()

  const [selectedId, setSelectedId] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)

  // Fetch địa chỉ khi mở modal
  useEffect(() => {
    if (open) {
      fetchAddresses()
    }
  }, [open])

  // Reset khi addresses thay đổi
  useEffect(() => {
    if (addresses.length > 0) {
      if (!addresses.find(a => a._id === selectedId)) {
        setSelectedId(addresses[0]._id)
      }
    } else {
      setSelectedId(null)
    }
  }, [addresses])

  const handleAddNew = () => {
    setEditingAddress(null)
    setIsFormOpen(true)
  }

  const handleEdit = (addr) => {
    setEditingAddress(addr)
    setIsFormOpen(true)
  }

  const handleFormClose = async (shouldReload = false) => {
    setIsFormOpen(false)
    setEditingAddress(null)
    if (shouldReload) {
      await fetchAddresses()
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Chọn địa chỉ giao hàng</DialogTitle>

        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <RadioGroup value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                {addresses.map((addr) => (
                  <Box key={addr._id} sx={{ borderBottom: '1px solid #eee', mb: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <FormControlLabel
                        value={addr._id}
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography fontWeight={700}>
                              {addr.fullName}{' '}
                              <Typography component="span" fontWeight={400}>({addr.phone})</Typography>
                            </Typography>
                            <Typography>{addr.address}</Typography>
                            <Typography>{addr.ward}, {addr.district}, {addr.city}</Typography>
                          </Box>
                        }
                      />
                      <Button size="small" onClick={() => handleEdit(addr)}>Cập nhật</Button>
                    </Box>
                  </Box>
                ))}
              </RadioGroup>

              <Button variant="outlined" fullWidth onClick={handleAddNew} sx={{ mt: 2 }}>
                + Thêm Địa Chỉ Mới
              </Button>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Huỷ</Button>
          <Button variant="contained" onClick={() => onConfirm(selectedId)} disabled={!selectedId}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Gọi modal form riêng */}
      <AddAddressModal
        open={isFormOpen}
        onClose={handleFormClose}
        initialData={editingAddress}
      />
    </>
  )
}
