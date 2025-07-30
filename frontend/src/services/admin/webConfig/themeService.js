import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy cấu hình theme từ website-configs
export const getThemeConfig = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    
    // API trả về cấu trúc { data: [...], meta: {...} }
    const websiteConfigs = response.data.data || response.data
    
    const themeConfig = websiteConfigs.find((item) => item.key === 'theme')
    return themeConfig || null
  } catch (error) {
    console.error('Lỗi khi lấy cấu hình theme:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể tải cấu hình theme. Vui lòng thử lại.'
    )
  }
}

// Lấy theme hiện tại (chỉ trả về content)
export const getCurrentTheme = async () => {
  try {
    const themeConfig = await getThemeConfig()
    return themeConfig?.content || getDefaultTheme()
  } catch (error) {
    console.error('Lỗi khi lấy theme hiện tại:', error)
    return getDefaultTheme()
  }
}

// Cập nhật theme configuration
export const updateThemeConfig = async (themeContent) => {
  try {
    // Trước tiên lấy theme config hiện tại để lấy ID
    const currentTheme = await getThemeConfig()
    
    if (!currentTheme?._id) {
      throw new Error('Không tìm thấy cấu hình theme để cập nhật')
    }

    const payload = {
      key: 'theme',
      title: 'Theme Configuration',
      description: 'Cấu hình theme và màu sắc của website',
      content: themeContent,
      status: 'active'
    }
    
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${currentTheme._id}`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật cấu hình theme:', error)
    throw new Error(
      error.response?.data?.message || 
      error.message ||
      'Không thể cập nhật cấu hình theme. Vui lòng thử lại.'
    )
  }
}

// Tạo theme configuration mới
export const createThemeConfig = async (themeContent) => {
  try {
    const payload = {
      key: 'theme',
      title: 'Theme Configuration',
      description: 'Cấu hình theme và màu sắc của website',
      content: themeContent,
      status: 'active'
    }
    
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/website-configs`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo cấu hình theme:', error)
    throw new Error(
      error.response?.data?.message || 
      error.message ||
      'Không thể tạo cấu hình theme. Vui lòng thử lại.'
    )
  }
}

// Helper function to save or update theme config
export const saveThemeConfig = async (themeContent) => {
  try {
    const existingTheme = await getThemeConfig()
    
    if (existingTheme) {
      return await updateThemeConfig(themeContent)
    } else {
      return await createThemeConfig(themeContent)
    }
  } catch (error) {
    console.error('Lỗi khi lưu cấu hình theme:', error)
    throw error
  }
}

// Theme mặc định
export const getDefaultTheme = () => ({
  primary: '#1A3C7B',
  secondary: '#2360cf',
  accent: '#093d9c',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  info: '#0891b2'
})

// Reset theme về mặc định
export const resetThemeConfig = async () => {
  try {
    const defaultTheme = getDefaultTheme()
    return await saveThemeConfig(defaultTheme)
  } catch (error) {
    console.error('Lỗi khi reset theme:', error)
    throw error
  }
} 