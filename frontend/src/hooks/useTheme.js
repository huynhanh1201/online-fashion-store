import { useState, useEffect, useCallback } from 'react'
import { getCurrentTheme, saveThemeConfig, resetThemeConfig, getDefaultTheme } from '~/services/admin/webConfig/themeService'

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

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(defaultColors)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load theme from API
  useEffect(() => {
    const loadTheme = async () => {
      try {
        setIsLoading(true)
        const savedTheme = await getCurrentTheme()
        const mergedTheme = { ...defaultColors, ...savedTheme }
        setCurrentTheme(mergedTheme)
      } catch (error) {
        console.error('Error loading theme from API:', error)
        // Fallback to default theme if API fails
        setCurrentTheme(defaultColors)
      } finally {
        setIsLoading(false)
        setIsLoaded(true)
      }
    }

    loadTheme()
  }, [])

  // Apply theme to document
  const applyTheme = useCallback((theme) => {
    const root = document.documentElement
    root.style.setProperty('--primary-color', theme.primary)
    root.style.setProperty('--secondary-color', theme.secondary)
    root.style.setProperty('--accent-color', theme.accent)
    root.style.setProperty('--success-color', theme.success)
    root.style.setProperty('--warning-color', theme.warning)
    root.style.setProperty('--error-color', theme.error)
    root.style.setProperty('--info-color', theme.info)
    root.style.setProperty('--background-color', theme.background)
    root.style.setProperty('--surface-color', theme.surface)
    root.style.setProperty('--text-color', theme.text)
    root.style.setProperty('--text-secondary-color', theme.textSecondary)
  }, [])

  // Update theme
  const updateTheme = useCallback(async (newTheme) => {
    try {
      setIsLoading(true)
      const updatedTheme = { ...currentTheme, ...newTheme }
      
      // Save to API
      await saveThemeConfig(updatedTheme)
      
      // Update local state
      setCurrentTheme(updatedTheme)
      applyTheme(updatedTheme)
    } catch (error) {
      console.error('Error saving theme to API:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [currentTheme, applyTheme])

  // Reset theme to default
  const resetTheme = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Reset in API
      await resetThemeConfig()
      
      // Update local state
      const defaultTheme = getDefaultTheme()
      const mergedTheme = { ...defaultColors, ...defaultTheme }
      setCurrentTheme(mergedTheme)
      applyTheme(mergedTheme)
    } catch (error) {
      console.error('Error resetting theme:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [applyTheme])

  // Apply current theme when it changes
  useEffect(() => {
    if (isLoaded) {
      applyTheme(currentTheme)
    }
  }, [currentTheme, isLoaded, applyTheme])

  return {
    currentTheme,
    updateTheme,
    resetTheme,
    applyTheme,
    isLoaded,
    isLoading
  }
}

export default useTheme 