import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress
} from '@mui/material'

import { useAddress } from '~/hooks/useAddress'
import AddAddressModal from './AddAddressModal'

export const ChooseAddressModal = ({ open, onClose, onConfirm, onUpdateAddresses }) => {
  const {
    addresses,
    loading,
    fetchAddresses
  } = useAddress()

  const [selectedId, setSelectedId] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)

  // Khi modal mở thì force fetch dữ liệu mới nhất
  // useEffect(() => {
  //   if (open) {
  //     fetchAddresses(true)
  //   }
  // }, [open, fetchAddresses])

  // Khi addresses thay đổi, cập nhật selectedId nếu cần
  useEffect(() => {
    if (addresses.length > 0) {
      if (!addresses.find(a => a._id === selectedId)) {
        setSelectedId(addresses[0]._id)
      }
    } else {
      setSelectedId(null)
    }
  }, [addresses, selectedId])

  // Mở form thêm mới
  const handleAddNew = () => {
    setEditingAddress(null)
    setIsFormOpen(true)
  }

  // Mở form chỉnh sửa
  const handleEdit = (addr) => {
    setEditingAddress(addr)
    setIsFormOpen(true)
  }

  // Đóng form và reload danh sách nếu cần
  const handleSuccess = async () => {
    await fetchAddresses(true)  // gọi force fetch mới
    if (onUpdateAddresses) await onUpdateAddresses()
    setIsFormOpen(false)
    setEditingAddress(null)
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md"
        PaperProps={{
          sx: {
            maxHeight: '70vh',
          },
        }}>
        <DialogTitle>Chọn địa chỉ giao hàng</DialogTitle>

        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <RadioGroup
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {addresses.map((addr) => (
                  <Box
                    key={addr._id}
                    sx={{ borderBottom: '1px solid #eee', mb: 2, pb: 1 }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormControlLabel
                        value={addr._id}
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography fontWeight={700}>
                              {addr.fullName}{' '}
                              <Typography component="span" fontWeight={400}>
                                ({addr.phone})
                              </Typography>
                            </Typography>
                            <Typography>{addr.address}</Typography>
                            <Typography>
                              {addr.ward}, {addr.district}, {addr.city}
                            </Typography>
                          </Box>
                        }
                      />
                      <Button size="small" onClick={() => handleEdit(addr)}>
                        Cập nhật
                      </Button>
                    </Box>
                  </Box>
                ))}
              </RadioGroup>

              <Button
                variant="outlined"
                fullWidth
                onClick={handleAddNew}
                sx={{ mt: 2 }}
              >
                + Thêm Địa Chỉ Mới
              </Button>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Huỷ</Button>
          <Button
            variant="contained"
            onClick={() => onConfirm(selectedId)}
            disabled={!selectedId}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal thêm/sửa địa chỉ */}
      <AddAddressModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleSuccess}
        addressToEdit={editingAddress}
      />
    </>
  )
}
