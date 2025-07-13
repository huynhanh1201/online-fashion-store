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
  CircularProgress,
  IconButton,
  Divider,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Home as HomeIcon
} from '@mui/icons-material'

import { useAddress } from '~/hooks/useAddress'
import AddAddressModal from './AddAddressModal'

export const ChooseAddressModal = ({
  open,
  onClose,
  onConfirm,
  onUpdateAddresses
}) => {
  const { addresses, loading, fetchAddresses } = useAddress()

  const [selectedId, setSelectedId] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)

  // Khi Chart mở thì force fetch dữ liệu mới nhất
  // useEffect(() => {
  //   if (open) {
  //     fetchAddresses(true)
  //   }
  // }, [open, fetchAddresses])

  // Khi addresses thay đổi, cập nhật selectedId nếu cần
  useEffect(() => {
    if (addresses.length > 0) {
      if (!addresses.find((a) => a._id === selectedId)) {
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
    await fetchAddresses(true) // gọi force fetch mới
    if (onUpdateAddresses) await onUpdateAddresses()
    setIsFormOpen(false)
    setEditingAddress(null)
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth='md'
        PaperProps={{
          sx: {
            maxHeight: '60vh',
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 3,
            
            color: 'var(--primary-color)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <LocationIcon sx={{ fontSize: 28 }} />
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1, fontWeight: 600 }}
          >
            Chọn địa chỉ giao hàng
          </Typography>
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            p: 0,
            backgroundColor: '#f8fafc',
            minHeight: '300px'
          }}
        >
          {loading ? (
            <Box
              display='flex'
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
              py={8}
            >
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography color='text.secondary'>
                Đang tải địa chỉ...
              </Typography>
            </Box>
          ) : addresses.length === 0 ? (
            <Box
              display='flex'
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
              py={8}
              px={3}
            >
              <HomeIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant='h6' color='text.secondary' gutterBottom>
                Chưa có địa chỉ nào
              </Typography>
              <Typography color='text.secondary' textAlign='center' mb={3}>
                Bạn chưa có địa chỉ giao hàng nào. Hãy thêm địa chỉ đầu tiên của
                bạn.
              </Typography>
              <Button
                variant='contained'
                startIcon={<AddIcon />}
                onClick={handleAddNew}
                sx={{
                  minHeight: 48,
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
                  }
                }}
              >
                Thêm địa chỉ đầu tiên
              </Button>
            </Box>
          ) : (
            <Box sx={{ p: 2 }}>
              <RadioGroup
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                sx={{ gap: 2 }}
              >
                {addresses.map((addr) => (
                  <Card
                    key={addr._id}
                    sx={{
                      border: selectedId === addr._id,
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'var(--primary-color)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                        transform: 'translateY(-2px)'
                      },
                      backgroundColor:
                        selectedId === addr._id ? '#f8faff' : 'white'
                    }}
                    onClick={() => setSelectedId(addr._id)}
                  >
                    <CardContent sx={{ p: 1 }}>
                      <Box display='flex' alignItems='center' gap={2}>
                        <Radio
                          checked={selectedId === addr._id}
                          value={addr._id}
                          sx={{
                            color: 'var(--primary-color)',
                            '&.Mui-checked': {
                              color: 'var(--primary-color)',
                            },
                            mt: -0.5
                          }}
                        />

                        <Box sx={{ flexGrow: 1 }}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <PersonIcon sx={{ fontSize: 18, color: 'var(--primary-color)' }} />
                            <Typography
                              variant='subtitle1'
                              fontWeight={600}
                              color='text.primary'
                            >
                              {addr.fullName}
                            </Typography>
                            {/* {index === 0 && (
                              <Chip
                                label='Mặc định'
                                size='small'
                                sx={{
                                  backgroundColor: '#e8f5e8',
                                  color: '#2e7d32',
                                  fontWeight: 500,
                                  fontSize: '0.75rem'
                                }}
                              />
                            )} */}
                          </Box>

                          <Box
                            display='flex'
                            alignItems='center'
                            gap={1}
                            mb={1}
                          >
                            <PhoneIcon
                              sx={{ fontSize: 16, color: '#64748b' }}
                            />
                            <Typography variant='body2' color='text.secondary'>
                              {addr.phone}
                            </Typography>
                          </Box>

                          <Box display='flex' alignItems='flex-start' gap={1}>
                            <LocationIcon
                              sx={{ fontSize: 16, color: '#64748b', mt: 0.2 }}
                            />
                            <Box>
                              <Typography
                                variant='body2'
                                color='text.primary'
                                fontWeight={500}
                              >
                                {addr.address}
                              </Typography>
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                {addr.ward}, {addr.district}, {addr.city}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <IconButton
                          size='small'
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(addr)
                          }}
                          sx={{
                            color: '#667eea',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(102, 126, 234, 0.2)'
                            }
                          }}
                        >
                          <EditIcon fontSize='small' />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>

              <Divider sx={{ my: 3 }} />

              <Button
                variant='outlined'
                fullWidth
                startIcon={<AddIcon />}
                onClick={handleAddNew}
                sx={{
                  borderColor: 'var(--primary-color)',
                  color: 'var(--primary-color)',
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'var(--primary-color)',
                    backgroundColor: 'rgba(102, 126, 234, 0.05)',
                    borderWidth: 2
                  }
                }}
              >
                Thêm địa chỉ mới
              </Button>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, backgroundColor: 'white', gap: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              color: '#64748b',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#f1f5f9'
              }
            }}
          >
            Hủy
          </Button>
          <Button
            variant='contained'
            onClick={() => onConfirm(selectedId)}
            disabled={!selectedId}
            sx={{
              background: selectedId ? 'var(--primary-color)' : undefined,
              borderRadius: 2,
              px: 4,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: selectedId
                ? '0 4px 15px rgba(102, 126, 234, 0.4)'
                : undefined,
              '&:hover': {
                boxShadow: selectedId
                  ? '0 6px 20px rgba(102, 126, 234, 0.6)'
                  : undefined
              },
              '&:disabled': {
                backgroundColor: '#e2e8f0',
                color: '#94a3b8'
              }
            }}
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
