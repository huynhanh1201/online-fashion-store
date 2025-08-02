import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Divider,
  Alert,
  Snackbar,
  Chip,
  Stack,
  CircularProgress
} from '@mui/material'
import {
  Palette,
  Brush,
  Save,
  Refresh,
  AutoAwesome,
  Settings
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import useTheme from '~/hooks/useTheme'
import { RouteGuard } from '~/components/PermissionGuard'
import usePermissions from '~/hooks/usePermissions'

// Predefined color schemes (thêm màu mới)
const predefinedThemes = {
  modernBlue: {
    name: 'Modern Blue',
    primary: '#1A3C7B',
    secondary: '#2360cf',
    accent: '#093d9c'
  },
  elegantBeige: {
    name: 'Elegant Beige',
    primary: '#C8B6A6',
    secondary: '#EDE0D4',
    accent: '#A68A64'
  },
  blushPink: {
    name: 'Blush Pink',
    primary: '#FFC1CC',
    secondary: '#FFDDE1',
    accent: '#FF8FA3'
  },
  oliveGreen: {
    name: 'Olive Green',
    primary: '#6B705C',
    secondary: '#A5A58D',
    accent: '#B7B7A4'
  },
  warmSand: {
    name: 'Warm Sand',
    primary: '#E6B17E',
    secondary: '#F5DEB3',
    accent: '#D4A373'
  },
  charcoalGray: {
    name: 'Charcoal Gray',
    primary: '#333333',
    secondary: '#555555',
    accent: '#777777'
  },
  lavenderMist: {
    name: 'Lavender Mist',
    primary: '#CDB4DB',
    secondary: '#E8DFF5',
    accent: '#B5838D'
  },
  terracottaClay: {
    name: 'Terracotta Clay',
    primary: '#9C6644',
    secondary: '#CC7351',
    accent: '#B5651D'
  }
}

// Map tiếng Việt cho label màu
const COLOR_LABELS = {
  primary: 'Màu chính',
  secondary: 'Màu phụ',
  accent: 'Màu nhấn'
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
  const [saving, setSaving] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const { hasPermission } = usePermissions()

  useEffect(() => {
    if (isLoading) return
    const matchingPresetKey = Object.entries(predefinedThemes).find(
      ([, preset]) =>
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
    setSelectedPreset(null)
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
    } catch {
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
    } catch {
      setSnackbar({
        open: true,
        message: 'Không thể reset theme. Vui lòng thử lại!',
        severity: 'error'
      })
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <RouteGuard requiredPermissions={['admin:access', 'theme:use']}>
        <Box
          sx={{
            p: 3,
            maxWidth: 1200,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh'
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </RouteGuard>
    )
  }

  return (
    <RouteGuard requiredPermissions={['admin:access', 'theme:use']}>
      <Box sx={{ p: 3, maxWidth: '100%' }}>
        <Typography
          variant='h4'
          sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}
        >
          <Palette sx={{ mr: 1, verticalAlign: 'middle' }} />
          Quản lý Chủ đề & Màu sắc
        </Typography>

        <Grid>
          {/* Predefined Themes */}
          <Grid item xs={12}>
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
                    <Grid item xs={12} sm={6} md={4} key={key}>
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
                            label={
                              selectedPreset === key ? 'Đang chọn' : 'Chọn'
                            }
                            size='small'
                            color={
                              selectedPreset === key ? 'primary' : 'default'
                            }
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

          {/* Basic Colors */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography
                  variant='h6'
                  sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                >
                  <Brush sx={{ mr: 1 }} />
                  Tùy chỉnh màu sắc
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  {['primary', 'secondary', 'accent'].map((colorKey) => (
                    <Grid item xs={12} sm={4} key={colorKey}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <ColorPreview color={pendingTheme[colorKey]} />
                        <TextField
                          label={COLOR_LABELS[colorKey]}
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

          {/* Action Buttons (dời xuống cuối) */}
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
                      startIcon={
                        saving ? <CircularProgress size={20} /> : <Save />
                      }
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
                      startIcon={
                        saving ? <CircularProgress size={20} /> : <Refresh />
                      }
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
