import { useState, useEffect, useCallback } from 'react'

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

  // Load theme from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('customTheme')
      if (savedTheme) {
        const parsedTheme = JSON.parse(savedTheme)
        setCurrentTheme({ ...defaultColors, ...parsedTheme })
      }
    } catch (error) {
      console.error('Error loading theme:', error)
    }
    setIsLoaded(true)
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
  const updateTheme = useCallback((newTheme) => {
    const updatedTheme = { ...currentTheme, ...newTheme }
    setCurrentTheme(updatedTheme)
    applyTheme(updatedTheme)
    
    // Save to localStorage
    try {
      localStorage.setItem('customTheme', JSON.stringify(updatedTheme))
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  }, [currentTheme, applyTheme])

  // Reset theme to default
  const resetTheme = useCallback(() => {
    setCurrentTheme(defaultColors)
    applyTheme(defaultColors)
    localStorage.removeItem('customTheme')
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
    isLoaded
  }
}

export default useTheme 