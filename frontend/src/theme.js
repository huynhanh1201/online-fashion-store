import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// Default theme colors
const defaultColors = {
  primary: '#2563eb',
  secondary: '#64748b',
  accent: '#1e40af',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  info: '#0891b2',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#1f2937',
  textSecondary: '#6b7280'
}

// Function to get current theme colors from localStorage or use defaults
const getCurrentThemeColors = () => {
  try {
    const savedTheme = localStorage.getItem('customTheme')
    if (savedTheme) {
      return { ...defaultColors, ...JSON.parse(savedTheme) }
    }
  } catch (error) {
    console.error('Error loading theme:', error)
  }
  return defaultColors
}

// Get current colors
const colors = getCurrentThemeColors()

// Create a theme instance with CSS variables support
const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: colors.primary,
      light: colors.primary + '20',
      dark: colors.primary + '80'
    },
    secondary: {
      main: colors.secondary,
      light: colors.secondary + '20',
      dark: colors.secondary + '80'
    },
    success: {
      main: colors.success
    },
    warning: {
      main: colors.warning
    },
    error: {
      main: colors.error
    },
    info: {
      main: colors.info
    },
    background: {
      default: colors.background,
      paper: colors.surface
    },
    text: {
      primary: colors.text,
      secondary: colors.textSecondary
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--primary-color': colors.primary,
          '--secondary-color': colors.secondary,
          '--accent-color': colors.accent,
          '--success-color': colors.success,
          '--warning-color': colors.warning,
          '--error-color': colors.error,
          '--info-color': colors.info,
          '--background-color': colors.background,
          '--surface-color': colors.surface,
          '--text-color': colors.text,
          '--text-secondary-color': colors.textSecondary
        }
      }
    }
  }
})

export default theme
