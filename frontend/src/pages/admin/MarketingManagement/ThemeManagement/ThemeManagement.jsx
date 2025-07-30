import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress
} from '@mui/material'
import {
  Palette,
  ColorLens,
  Brush,
  Save,
  Refresh,
  ExpandMore,
  Visibility,
  VisibilityOff,
  AutoAwesome,
  Settings
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import useTheme from '~/hooks/useTheme'
import { RouteGuard } from '~/components/PermissionGuard'
import usePermissions from '~/hooks/usePermissions'

// Predefined color schemes
const predefinedThemes = {
  modernBlue: {
    name: 'Modern Blue',
    primary: '#1A3C7B',
    secondary: '#2360cf',
    accent: '#093d9c',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0891b2'
  },
  elegantPurple: {
    name: 'Elegant Purple',
    primary: '#7c3aed',
    secondary: '#8b5cf6',
    accent: '#5b21b6',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0891b2'
  },
  warmOrange: {
    name: 'Warm Orange',
    primary: '#f97316',
    secondary: '#fb923c',
    accent: '#ea580c',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0891b2'
  },
  professionalGreen: {
    name: 'Professional Green',
    primary: '#059669',
    secondary: '#10b981',
    accent: '#047857',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0891b2'
  },
  sophisticatedGray: {
    name: 'Sophisticated Gray',
    primary: '#374151',
    secondary: '#6b7280',
    accent: '#1f2937',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0891b2'
  }
}

// Bổ sung map việt hóa cho các nhãn màu
const COLOR_LABELS = {
  primary: 'Màu chính',
  secondary: 'Màu phụ',
  accent: 'Màu nhấn',
  success: 'Thành công',
  warning: 'Cảnh báo',
  error: 'Lỗi',
  info: 'Thông tin',
  background: 'Nền',
  text: 'Chữ'
}

// Styled components
const ColorPreview = styled(Box)(({ color }) => ({
  width: 40,
  height: 40,
  borderRadius: 8,
  backgroundColor: color,
  border: '2px solid #e0e0e0',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    borderColor: '#999'
  }
}))

const ThemeCard = styled(Card)(({ selected, theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: selected
    ? `3px solid ${theme.palette.primary.main}`
    : '2px solid #e0e0e0',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
  }
}))

const ThemeManagement = () => {
  const { currentTheme, updateTheme, resetTheme, isLoading } = useTheme()
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [pendingTheme, setPendingTheme] = useState(currentTheme)
  const [previewMode, setPreviewMode] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [saving, setSaving] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const { hasPermission } = usePermissions()

  // Sync selected preset and pendingTheme with current theme on load or when theme changes
  useEffect(() => {
    if (isLoading) return // Đợi load xong
    
    // Sync preset
    const matchingPresetKey = Object.entries(predefinedThemes).find(
      ([key, preset]) =>
        preset.primary === currentTheme.primary &&
        preset.secondary === currentTheme.secondary &&
        preset.accent === currentTheme.accent
    )?.[0]
  
    if (matchingPresetKey) {
      setSelectedPreset(matchingPresetKey)
      setPendingTheme(predefinedThemes[matchingPresetKey])
    } else {
      setSelectedPreset(null)
      setPendingTheme(currentTheme)
    }
  
    if (currentTheme) {
      setSnackbar({
        open: true,
        message: 'Đã tải chủ đề từ cơ sở dữ liệu thành công!',
        severity: 'success'
      })
    }
  }, [currentTheme, isLoading])

  const handlePresetSelect = (presetKey) => {
    const preset = predefinedThemes[presetKey]
    setPendingTheme(preset)
    setSelectedPreset(presetKey)
    setSnackbar({
      open: true,
      message: `Đã chọn theme ${preset.name}. Nhấn "Lưu chủ đề" để lưu vào cơ sở dữ liệu!`,
      severity: 'info'
    })
  }

  const handleColorChange = (colorKey, value) => {
    setPendingTheme((prev) => ({ ...prev, [colorKey]: value }))
    setSelectedPreset(null) // Deselect preset on custom change
    
    // Show notification for custom color changes
    if (!snackbar.open) {
      setSnackbar({
        open: true,
        message: 'Đã thay đổi màu sắc. Nhấn "Lưu chủ đề" để lưu thay đổi!',
        severity: 'info'
      })
    }
  }

  const handleSaveTheme = async () => {
    try {
      setSaving(true)
      await updateTheme(pendingTheme)
      setSnackbar({
        open: true,
        message: 'Chủ đề đã được lưu thành công!',
        severity: 'success'
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Không thể lưu chủ đề. Vui lòng thử lại!',
        severity: 'error'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleResetTheme = async () => {
    try {
      setSaving(true)
      await resetTheme()
      setSnackbar({
        open: true,
        message: 'Theme đã được reset về mặc định!',
        severity: 'info'
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Không thể reset theme. Vui lòng thử lại!',
        severity: 'error'
      })
    } finally {
      setSaving(false)
    }
  }

  // Show loading state while theme is being loaded
  if (isLoading) {
    return (
      <RouteGuard requiredPermissions={['admin:access', 'theme:use']}>
        <Box sx={{ p: 3, maxWidth: 1200, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </RouteGuard>
    )
  }

  return (
    <RouteGuard requiredPermissions={['admin:access', 'theme:use']}>
      <Box sx={{ p: 3, maxWidth: 1200 }}>
        <Typography
          variant='h4'
          sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}
        >
          <Palette sx={{ mr: 1, verticalAlign: 'middle' }} />
          Quản lý Chủ đề & Màu sắc
        </Typography>

        {/* Theme Status */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Typography variant='h6' sx={{ mb: 1 }}>
                  Trạng thái chủ đề
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Chủ đề sẽ được lưu vào cơ sở dữ liệu và áp dụng cho toàn bộ website
                </Typography>
              </Box>
              <Chip
                label='Đã lưu vào API'
                color='success'
                variant='filled'
                icon={<Visibility />}
              />
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Predefined Themes */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant='h6'
                  sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                >
                  <AutoAwesome sx={{ mr: 1 }} />
                  Chủ đề có sẵn
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(predefinedThemes).map(([key, theme]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <ThemeCard
                        selected={selectedPreset === key}
                        onClick={() => handlePresetSelect(key)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography
                            variant='subtitle2'
                            sx={{ mb: 1, fontWeight: 600 }}
                          >
                            {theme.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <ColorPreview color={theme.primary} />
                            <ColorPreview color={theme.secondary} />
                            <ColorPreview color={theme.accent} />
                          </Box>
                          <Chip
                            label={selectedPreset === key ? 'Đang chọn' : 'Chọn'}
                            size='small'
                            color={selectedPreset === key ? 'primary' : 'default'}
                            variant={
                              selectedPreset === key ? 'filled' : 'outlined'
                            }
                          />
                        </CardContent>
                      </ThemeCard>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Custom Color Editor */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant='h6'
                  sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                >
                  <Brush sx={{ mr: 1 }} />
                  Tùy chỉnh màu sắc
                </Typography>

                <Accordion
                  expanded={showAdvanced}
                  onChange={() => setShowAdvanced(!showAdvanced)}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant='subtitle2'>Màu sắc nâng cao</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {Object.entries(pendingTheme).map(([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}>
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                          >
                            <ColorPreview color={value} />
                            <TextField
                              label={COLOR_LABELS[key] || (key.charAt(0).toUpperCase() + key.slice(1))}
                              value={value}
                              onChange={(e) =>
                                handleColorChange(key, e.target.value)
                              }
                              size='small'
                              fullWidth
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Divider sx={{ my: 2 }} />

                {/* Basic Colors */}
                <Typography variant='subtitle2' sx={{ mb: 2 }}>
                  Màu sắc cơ bản
                </Typography>
                <Grid container spacing={2}>
                  {['primary', 'secondary', 'accent'].map((colorKey) => (
                    <Grid item xs={12} sm={4} key={colorKey}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ColorPreview color={pendingTheme[colorKey]} />
                        <TextField
                          label={COLOR_LABELS[colorKey] || (colorKey.charAt(0).toUpperCase() + colorKey.slice(1))}
                          value={pendingTheme[colorKey]}
                          onChange={(e) =>
                            handleColorChange(colorKey, e.target.value)
                          }
                          size='small'
                          fullWidth
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Buttons */}
          {hasPermission('theme:update') && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                  >
                    <Settings sx={{ mr: 1 }} />
                    Thao tác
                  </Typography>
                  <Stack direction='row' spacing={2} flexWrap='wrap' useFlexGap>

                    <Button
                      variant='contained'
                      startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                      onClick={handleSaveTheme}
                      disabled={saving || isLoading}
                      sx={{
                        minWidth: 120,
                        backgroundColor: 'var(--primary-color)',
                        color: '#fff'
                      }}
                    >
                      {saving ? 'Đang lưu...' : 'Lưu chủ đề'}
                    </Button>

                    <Button
                      variant='outlined'
                      startIcon={saving ? <CircularProgress size={20} /> : <Refresh />}
                      onClick={handleResetTheme}
                      disabled={saving || isLoading}
                      sx={{
                        minWidth: 120,
                        color: 'var(--primary-color)',
                        borderColor: 'var(--primary-color)'
                      }}
                    >
                      {saving ? 'Đang reset...' : 'Khôi phục'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </RouteGuard>
  )
}

export default ThemeManagement
