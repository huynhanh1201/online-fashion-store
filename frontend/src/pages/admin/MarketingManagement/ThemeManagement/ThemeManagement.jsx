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
  AccordionDetails
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
  const { currentTheme, updateTheme, resetTheme } = useTheme()
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  // Sync selected preset with current theme on load or when theme changes
  useEffect(() => {
    const matchingPresetKey = Object.entries(predefinedThemes).find(
      ([key, preset]) =>
        preset.primary === currentTheme.primary &&
        preset.secondary === currentTheme.secondary &&
        preset.accent === currentTheme.accent
    )?.[0]

    if (matchingPresetKey) {
      setSelectedPreset(matchingPresetKey)
    } else {
      setSelectedPreset(null) // It's a custom theme
    }
  }, [currentTheme])


  const handlePresetSelect = (presetKey) => {
    const preset = predefinedThemes[presetKey]
    updateTheme(preset)
    setSelectedPreset(presetKey)
    setSnackbar({
      open: true,
      message: `Đã áp dụng theme ${preset.name}!`,
      severity: 'success'
    })
  }

  const handleColorChange = (colorKey, value) => {
    updateTheme({ [colorKey]: value })
    setSelectedPreset(null) // Deselect preset on custom change
  }

  const handleSaveTheme = () => {
    setSnackbar({
      open: true,
      message: 'Theme đã được lưu thành công!',
      severity: 'success'
    })
  }

  const handleResetTheme = () => {
    resetTheme()
    // handlePresetSelect('modernBlue'); // Let useEffect handle selection
    setSnackbar({
      open: true,
      message: 'Theme đã được reset về mặc định!',
      severity: 'info'
    })
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200 }}>
      <Typography
        variant='h4'
        sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}
      >
        <Palette sx={{ mr: 1, verticalAlign: 'middle' }} />
        Quản lý Theme & Màu sắc
      </Typography>

      {/* Preview Mode Toggle */}
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
                Chế độ xem trước
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Theme sẽ được áp dụng ngay lập tức khi bạn thay đổi màu sắc
              </Typography>
            </Box>
            <Chip
              label='Đang hoạt động'
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
                Theme có sẵn
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
                    {Object.entries(currentTheme).map(([key, value]) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <ColorPreview color={value} />
                          <TextField
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
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
                      <ColorPreview color={currentTheme[colorKey]} />
                      <TextField
                        label={
                          colorKey.charAt(0).toUpperCase() + colorKey.slice(1)
                        }
                        value={currentTheme[colorKey]}
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
                  startIcon={<Save />}
                  onClick={handleSaveTheme}
                  sx={{
                    minWidth: 120,
                    backgroundColor: 'var(--primary-color)',
                    color: '#fff'
                  }}
                >
                  Lưu Theme
                </Button>
                <Button
                  variant='outlined'
                  startIcon={<Refresh />}
                  onClick={handleResetTheme}
                  sx={{
                    minWidth: 120,
                    color: 'var(--primary-color)',
                    borderColor: 'var(--primary-color)'
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Theme Preview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography
                variant='h6'
                sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
              >
                <ColorLens sx={{ mr: 1 }} />
                Xem trước Theme
              </Typography>
              <Paper sx={{ p: 3, background: currentTheme.background }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          backgroundColor: currentTheme.primary,
                          mx: 'auto',
                          mb: 1
                        }}
                      />
                      <Typography
                        variant='body2'
                        sx={{ color: currentTheme.text }}
                      >
                        Primary
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          backgroundColor: currentTheme.secondary,
                          mx: 'auto',
                          mb: 1
                        }}
                      />
                      <Typography
                        variant='body2'
                        sx={{ color: currentTheme.text }}
                      >
                        Secondary
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          backgroundColor: currentTheme.accent,
                          mx: 'auto',
                          mb: 1
                        }}
                      />
                      <Typography
                        variant='body2'
                        sx={{ color: currentTheme.text }}
                      >
                        Accent
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          backgroundColor: currentTheme.success,
                          mx: 'auto',
                          mb: 1
                        }}
                      />
                      <Typography
                        variant='body2'
                        sx={{ color: currentTheme.text }}
                      >
                        Success
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
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
  )
}

export default ThemeManagement
