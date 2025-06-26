import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

export const getFooterConfig = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`,
      {
        params: {
          // Add a cache-busting parameter to prevent stale data
          _t: new Date().getTime()
        }
      }
    )
    const websiteConfigs = response.data.data || response.data
    const footer = websiteConfigs.find((item) => item.key === 'footer')
    return footer || null
  } catch (error) {
    console.error('Lỗi khi lấy cấu hình footer:', error)
    if (error.response?.status === 404) {
      return null // Return null if not found, it's not a critical error
    }
    throw new Error(
      error.response?.data?.message ||
      'Không thể tải cấu hình footer. Vui lòng thử lại.'
    )
  }
}

export const updateFooterConfig = async (content) => {
  try {
    const currentFooter = await getFooterConfig()
    if (!currentFooter?._id) {
      throw new Error('Không tìm thấy cấu hình footer để cập nhật')
    }
    const payload = {
      key: 'footer',
      title: 'Footer Configuration',
      description: 'Cấu hình footer của website',
      content,
      status: 'active'
    }
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${currentFooter._id}`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật cấu hình footer:', error)
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Không thể cập nhật cấu hình footer. Vui lòng thử lại.'
    )
  }
}

export const createFooterConfig = async (content) => {
  try {
    const payload = {
      key: 'footer',
      title: 'Footer Configuration',
      description: 'Cấu hình footer của website',
      content,
      status: 'active'
    }
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/website-configs`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo cấu hình footer:', error)
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Không thể tạo cấu hình footer. Vui lòng thử lại.'
    )
  }
}
