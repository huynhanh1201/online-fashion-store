// services/headerService.js
import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getHeaderConfig = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    
    // API trả về cấu trúc { data: [...], meta: {...} }
    const websiteConfigs = response.data.data || response.data
    
    const header = websiteConfigs.find((item) => item.key === 'header')
    return header || null
  } catch (error) {
    console.error('Lỗi khi lấy cấu hình header:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể tải cấu hình header. Vui lòng thử lại.'
    )
  }
}

export const updateHeaderConfig = async (content) => {
  try {
    // Trước tiên lấy header config hiện tại để lấy ID
    const currentHeader = await getHeaderConfig()
    
    if (!currentHeader?._id) {
      throw new Error('Không tìm thấy cấu hình header để cập nhật')
    }

    const payload = {
      key: 'header',
      title: 'Header Configuration',
      description: 'Cấu hình header của website',
      content,
      status: 'active'
    }
    
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${currentHeader._id}`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật cấu hình header:', error)
    throw new Error(
      error.response?.data?.message || 
      error.message ||
      'Không thể cập nhật cấu hình header. Vui lòng thử lại.'
    )
  }
}

// Helper function to validate header content
export const validateHeaderContent = (content) => {
  const errors = []

  if (!content.logo?.imageUrl?.trim()) {
    errors.push('Logo URL không được để trống')
  }

  if (!content.logo?.alt?.trim()) {
    errors.push('Logo alt text không được để trống')
  }

  // Validate banners
  content.topBanner?.forEach((banner, index) => {
    if (banner.visible && !banner.text?.trim()) {
      errors.push(`Banner ${index + 1} đang hiển thị nhưng không có nội dung`)
    }
  })

  return errors
}
