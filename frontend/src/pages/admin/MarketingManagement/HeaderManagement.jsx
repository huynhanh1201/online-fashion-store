import React from 'react'
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  useTheme,
  alpha
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Announcement as BannerIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material'

const mockHeaders = [
  {
    id: 'header001',
    logo: '/Uploads/logo.png',
    textBanners: [
      'Miễn phí vận chuyển cho đơn hàng từ 500.000đ',
      'Giảm giá 10% cho khách hàng mới'
    ],
    status: 'Đang sử dụng'
  }
]

const HeaderManagement = () => {
  const theme = useTheme()

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang sử dụng':
        return 'success'
      case 'Ngừng sử dụng':
        return 'error'
      default:
        return 'default'
    }
  }

  const summaryData = [
    {
      title: 'Tổng header',
      value: mockHeaders.length,
      icon: <ImageIcon />,
      color: '#1976d2'
    },
    {
      title: 'Đang sử dụng',
      value: mockHeaders.filter((h) => h.status === 'Đang sử dụng').length,
      icon: <TrendingUpIcon />,
      color: '#2e7d32'
    },
    {
      title: 'Banner hiển thị',
      value: mockHeaders.reduce((sum, h) => sum + h.textBanners.length, 0),
      icon: <BannerIcon />,
      color: '#ed6c02'
    }
  ]

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
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
          <ImageIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
          Quản lý Header
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Cấu hình và quản lý nội dung header cho website
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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

      {/* Action Button */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
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
          Cấu hình Header mới
        </Button>
      </Box>

      {/* Table */}
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
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Logo
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Top Banner
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockHeaders.map((header) => (
                <TableRow
                  key={header.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04)
                    },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <img
                        src={header.logo}
                        alt='logo'
                        style={{
                          width: 80,
                          height: 'auto',
                          borderRadius: 4,
                          border: '1px solid #e2e8f0'
                        }}
                      />
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{ fontFamily: 'monospace' }}
                      >
                        {header.id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <List dense>
                      {header.textBanners.map((text, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={
                              <Typography
                                variant='body2'
                                sx={{ fontWeight: 600, color: '#1e293b' }}
                              >
                                {text}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={header.status}
                      color={getStatusColor(header.status)}
                      size='small'
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Stack direction='row' spacing={1}>
                      <Tooltip title='Chỉnh sửa'>
                        <IconButton
                          size='small'
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}

export default HeaderManagement
