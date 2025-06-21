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
  Info as InfoIcon,
  Menu as MenuIcon,
  Link as LinkIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material'

const mockFooters = [
  {
    id: 'footer001',
    logo: '/Uploads/logo-footer.png',
    about: [
      {
        text: 'Cửa hàng thời trang hiện đại, uy tín, phục vụ bạn từ năm 2020.',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        phone: '0123 456 789',
        email: 'support@example.com'
      }
    ],
    menuColumns: [
      {
        title: 'Chính sách',
        subtitle: 'Chính sách của FashionStore',
        text: 'abcxyz'
      },
      {
        title: 'Hỗ trợ',
        items: [
          { label: 'Hướng dẫn mua hàng', link: '/help' },
          { label: 'Chính sách đổi trả', link: '/policy/return' }
        ]
      }
    ],
    socialLinks: [
      { image: 'facebook', link: 'https://facebook.com/example' },
      { image: 'instagram', link: 'https://instagram.com/example' }
    ],
    status: 'Đang sử dụng'
  }
]

const FooterManagement = () => {
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
      title: 'Tổng footer',
      value: mockFooters.length,
      icon: <ImageIcon />,
      color: '#1976d2'
    },
    {
      title: 'Đang sử dụng',
      value: mockFooters.filter((f) => f.status === 'Đang sử dụng').length,
      icon: <TrendingUpIcon />,
      color: '#2e7d32'
    },
    {
      title: 'Menu liên kết',
      value: mockFooters.reduce((sum, f) => sum + f.menuColumns.length, 0),
      icon: <MenuIcon />,
      color: '#ed6c02'
    },
    {
      title: 'Mạng xã hội',
      value: mockFooters.reduce((sum, f) => sum + f.socialLinks.length, 0),
      icon: <LinkIcon />,
      color: '#9c27b0'
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
          Quản lý Footer
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Cấu hình và quản lý nội dung footer cho website
        </Typography>
      </Box>

      {/* Summary Cards */}
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
          Cấu hình Footer mới
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
                  Giới thiệu
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Menu
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Mạng xã hội
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
              {mockFooters.map((footer) => (
                <TableRow
                  key={footer.id}
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
                        src={footer.logo}
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
                        {footer.id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <List dense>
                      {footer.about.map((item, index) => (
                        <ListItem key={index} sx={{ py: 0 }}>
                          <ListItemText
                            primary={
                              <Typography
                                variant='body2'
                                sx={{ fontWeight: 600, color: '#1e293b' }}
                              >
                                {item.text}
                              </Typography>
                            }
                            secondary={
                              <Stack spacing={0.5}>
                                <Typography
                                  variant='caption'
                                  color='text.secondary'
                                >
                                  {item.address}
                                </Typography>
                                <Typography
                                  variant='caption'
                                  color='text.secondary'
                                >
                                  {item.phone} | {item.email}
                                </Typography>
                              </Stack>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <List dense>
                      {footer.menuColumns.map((col, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={
                              <Typography
                                variant='body2'
                                sx={{ fontWeight: 600, color: '#1e293b' }}
                              >
                                {col.title}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant='caption'
                                color='text.secondary'
                              >
                                {col.subtitle ||
                                  (col.items
                                    ? col.items.map((i) => i.label).join(', ')
                                    : col.text)}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <List dense>
                      {footer.socialLinks.map((s, i) => (
                        <ListItem key={i} sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={
                              <Typography
                                variant='body2'
                                sx={{
                                  fontWeight: 600,
                                  textTransform: 'capitalize',
                                  color: '#1e293b'
                                }}
                              >
                                {s.image}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant='caption'
                                color='text.secondary'
                                sx={{ wordBreak: 'break-all' }}
                              >
                                {s.link}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={footer.status}
                      color={getStatusColor(footer.status)}
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

export default FooterManagement
