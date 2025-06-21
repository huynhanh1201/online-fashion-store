import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Tooltip,
  Stack,
  Avatar,
  Switch,
  FormControlLabel
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Link as LinkIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material'
import AddBanner from './Modal/AddBanner.jsx'

const DisplayManagement = () => {
  const theme = useTheme()

  const [open, setOpen] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState(null)

  const [banners, setBanners] = useState([
    {
      id: 'bnr001',
      title: 'Banner Sale Hè',
      imageUrl: '/uploads/summer.jpg',
      link: '/khuyen-mai/summer',
      position: 'Trang chủ',
      startDate: '2025-06-01',
      endDate: '2025-06-10',
      visible: true,
      clicks: 1250,
      impressions: 15000
    },
    {
      id: 'bnr002',
      title: 'Back to School Banner',
      imageUrl: '/uploads/back2school.jpg',
      link: '/khuyen-mai/back2school',
      position: 'Trang sản phẩm',
      startDate: '2025-07-15',
      endDate: '2025-07-31',
      visible: false,
      clicks: 850,
      impressions: 12000
    },
    {
      id: 'bnr003',
      title: 'Flash Sale Weekend',
      imageUrl: '/uploads/flash-weekend.jpg',
      link: '/flash-sale/weekend',
      position: 'Header',
      startDate: '2025-06-20',
      endDate: '2025-06-22',
      visible: true,
      clicks: 2100,
      impressions: 25000
    }
  ])

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('vi-VN')

  const getPositionColor = (position) => {
    switch (position) {
      case 'Trang chủ':
        return { bg: '#e3f2fd', color: '#1976d2' }
      case 'Trang sản phẩm':
        return { bg: '#f3e5f5', color: '#7b1fa2' }
      case 'Header':
        return { bg: '#e8f5e8', color: '#2e7d32' }
      default:
        return { bg: '#f5f5f5', color: '#757575' }
    }
  }

  const toggleVisibility = (id) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === id ? { ...banner, visible: !banner.visible } : banner
      )
    )
  }

  const calculateCTR = (clicks, impressions) =>
    impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00'

  const handleSaveBanner = (data) => {
    setBanners((prev) => {
      const index = prev.findIndex((b) => b.id === data.id)
      if (index !== -1) {
        // update
        const updated = [...prev]
        updated[index] = { ...data }
        return updated
      } else {
        // add new
        return [
          ...prev,
          { ...data, id: `bnr${Date.now()}`, clicks: 0, impressions: 0 }
        ]
      }
    })
  }

  const summaryData = [
    {
      title: 'Tổng Banner',
      value: banners.length,
      icon: <ImageIcon />,
      color: '#1976d2'
    },
    {
      title: 'Đang hiển thị',
      value: banners.filter((banner) => banner.visible).length,
      icon: <VisibilityIcon />,
      color: '#2e7d32'
    },
    {
      title: 'Tổng lượt click',
      value: banners
        .reduce((sum, banner) => sum + banner.clicks, 0)
        .toLocaleString(),
      icon: <LinkIcon />,
      color: '#ed6c02'
    },
    {
      title: 'Tổng lượt xem',
      value: banners
        .reduce((sum, banner) => sum + banner.impressions, 0)
        .toLocaleString(),
      icon: <VisibilityIcon />,
      color: '#9c27b0'
    }
  ]

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant='h4'
          sx={{
            fontWeight: 700,
            color: '#1e293b',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <DashboardIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
          Quản lý Banner & Hiển thị
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Quản lý và theo dõi hiệu suất các banner quảng cáo trên website
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}25 100%)`,
                border: `1px solid ${item.color}30`,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 32px ${item.color}30`
                }
              }}
            >
              <CardContent>
                <Stack
                  direction='row'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Box>
                    <Typography
                      variant='h4'
                      sx={{ fontWeight: 700, color: item.color }}
                    >
                      {item.value}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ mt: 0.5 }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: `${item.color}20`,
                      color: item.color
                    }}
                  >
                    {item.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedBanner(null)
            setOpen(true)
          }}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Thêm banner mới
        </Button>
      </Box>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0'
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                {[
                  'Banner',
                  'Vị trí',
                  'Liên kết',
                  'Thời gian',
                  'Hiệu suất',
                  'Trạng thái',
                  'Thao tác'
                ].map((text, idx) => (
                  <TableCell
                    key={idx}
                    sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                  >
                    {text}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {banners.map((banner) => {
                const positionStyle = getPositionColor(banner.position)
                const ctr = calculateCTR(banner.clicks, banner.impressions)

                return (
                  <TableRow key={banner.id}>
                    <TableCell sx={{ py: 2 }}>
                      <Stack direction='row' spacing={2} alignItems='center'>
                        <Avatar
                          src={banner.imageUrl}
                          sx={{
                            width: 60,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: '#f1f5f9'
                          }}
                          variant='rounded'
                        >
                          <ImageIcon sx={{ color: '#64748b' }} />
                        </Avatar>
                        <Box>
                          <Typography
                            variant='body1'
                            sx={{ fontWeight: 600, color: '#1e293b' }}
                          >
                            {banner.title}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            ID: {banner.id}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={banner.position}
                        size='small'
                        icon={<LocationIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          backgroundColor: positionStyle.bg,
                          color: positionStyle.color,
                          fontWeight: 600,
                          borderRadius: 2,
                          '& .MuiChip-icon': { color: positionStyle.color }
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Stack direction='row' spacing={1} alignItems='center'>
                        <LinkIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant='body2' sx={{ color: '#3b82f6' }}>
                          {banner.link}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <CalendarIcon
                            sx={{ fontSize: 14, color: '#059669' }}
                          />
                          <Typography
                            variant='caption'
                            sx={{ color: '#059669', fontWeight: 600 }}
                          >
                            Bắt đầu: {formatDate(banner.startDate)}
                          </Typography>
                        </Stack>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <CalendarIcon
                            sx={{ fontSize: 14, color: '#dc2626' }}
                          />
                          <Typography
                            variant='caption'
                            sx={{ color: '#dc2626', fontWeight: 600 }}
                          >
                            Kết thúc: {formatDate(banner.endDate)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography variant='caption' color='text.secondary'>
                            Click:
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{ fontWeight: 600, color: '#3b82f6' }}
                          >
                            {banner.clicks.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography variant='caption' color='text.secondary'>
                            CTR:
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{ fontWeight: 600, color: '#059669' }}
                          >
                            {ctr}%
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={banner.visible}
                            onChange={() => toggleVisibility(banner.id)}
                            size='small'
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#10b981'
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                { backgroundColor: '#10b981' }
                            }}
                          />
                        }
                        label={
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {banner.visible ? 'Hiển thị' : 'Ẩn'}
                          </Typography>
                        }
                        sx={{ margin: 0 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Stack direction='row' spacing={1}>
                        <Tooltip title='Chỉnh sửa'>
                          <IconButton
                            size='small'
                            onClick={() => {
                              setSelectedBanner(banner)
                              setOpen(true)
                            }}
                            sx={{
                              color: '#3b82f6',
                              '&:hover': { backgroundColor: '#dbeafe' }
                            }}
                          >
                            <EditIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Xóa'>
                          <IconButton
                            size='small'
                            sx={{
                              color: '#ef4444',
                              '&:hover': { backgroundColor: '#fee2e2' }
                            }}
                          >
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Modal thêm/sửa */}
      <AddBanner
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSaveBanner}
        initialData={selectedBanner}
      />
    </Box>
  )
}

export default DisplayManagement
