import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import useTheme from '~/hooks/useTheme'

const ThemeContext = createContext()

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}

export const CustomThemeProvider = ({ children }) => {
  const { currentTheme, isLoaded } = useTheme()
  const [muiTheme, setMuiTheme] = useState(null)

  useEffect(() => {
    if (isLoaded && currentTheme) {
      const theme = createTheme({
        cssVariables: true,
        palette: {
          primary: {
            main: currentTheme.primary,
            light: currentTheme.primary + '20',
            dark: currentTheme.primary + '80'
          },
          secondary: {
            main: currentTheme.secondary,
            light: currentTheme.secondary + '20',
            dark: currentTheme.secondary + '80'
          },
          success: {
            main: currentTheme.success
          },
          warning: {
            main: currentTheme.warning
          },
          error: {
            main: currentTheme.error
          },
          info: {
            main: currentTheme.info
          },
          background: {
            default: currentTheme.background,
            paper: currentTheme.surface
          },
          text: {
            primary: currentTheme.text,
            secondary: currentTheme.textSecondary
          }
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              ':root': {
                '--primary-color': currentTheme.primary,
                '--secondary-color': currentTheme.secondary,
                '--accent-color': currentTheme.accent,
                '--success-color': currentTheme.success,
                '--warning-color': currentTheme.warning,
                '--error-color': currentTheme.error,
                '--info-color': currentTheme.info,
                '--background-color': currentTheme.background,
                '--surface-color': currentTheme.surface,
                '--text-color': currentTheme.text,
                '--text-secondary-color': currentTheme.textSecondary
              }
            }
          }
        }
      })
      setMuiTheme(theme)
    }
  }, [currentTheme, isLoaded])

  if (!muiTheme) {
    return null // or a loading spinner
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, isLoaded }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export default CustomThemeProvider 