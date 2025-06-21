import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy danh sách banner từ website-configs
export const getBanners = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    
    // API trả về cấu trúc { data: [...], meta: {...} }
    const websiteConfigs = response.data.data || response.data
    
    const bannerConfig = websiteConfigs.find((item) => item.key === 'banners')
    return bannerConfig?.content || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách banner:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể tải danh sách banner. Vui lòng thử lại.'
    )
  }
}

// Thêm banner mới
export const addBanner = async (banner) => {
  try {
    // Trước tiên lấy banner config hiện tại
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const bannerConfig = websiteConfigs.find((item) => item.key === 'banners')
    
    let banners = []
    let configId = null
    
    if (bannerConfig) {
      // Nếu đã có config, thêm banner vào danh sách hiện tại
      banners = bannerConfig.content || []
      configId = bannerConfig._id
    }
    
    const newBanners = [...banners, banner]
    
    if (bannerConfig) {
      // Update config hiện tại
      const payload = {
        key: 'banners',
        title: 'Banner Configuration',
        description: 'Cấu hình banner của website',
        content: newBanners,
        status: 'active'
      }
      
      const updateResponse = await AuthorizedAxiosInstance.patch(
        `${API_ROOT}/v1/website-configs/${configId}`,
        payload
      )
      return updateResponse.data
    } else {
      // Tạo config mới
      const payload = {
        key: 'banners',
        title: 'Banner Configuration',
        description: 'Cấu hình banner của website',
        content: newBanners,
        status: 'active'
      }
      
      const createResponse = await AuthorizedAxiosInstance.post(
        `${API_ROOT}/v1/website-configs`,
        payload
      )
      return createResponse.data
    }
  } catch (error) {
    console.error('Lỗi khi thêm banner:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể thêm banner. Vui lòng thử lại.'
    )
  }
}

// Sửa banner (theo index)
export const updateBanner = async (index, updatedBanner) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const bannerConfig = websiteConfigs.find((item) => item.key === 'banners')
    
    if (!bannerConfig) {
      throw new Error('Không tìm thấy cấu hình banner')
    }
    
    const banners = bannerConfig.content || []
    if (index < 0 || index >= banners.length) {
      throw new Error('Banner không tồn tại')
    }
    
    const newBanners = banners.map((b, i) => (i === index ? { ...b, ...updatedBanner } : b))
    
    const payload = {
      key: 'banners',
      title: 'Banner Configuration',
      description: 'Cấu hình banner của website',
      content: newBanners,
      status: 'active'
    }
    
    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${bannerConfig._id}`,
      payload
    )
    return updateResponse.data
  } catch (error) {
    console.error('Lỗi khi cập nhật banner:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể cập nhật banner. Vui lòng thử lại.'
    )
  }
}

// Xóa banner (theo index)
export const deleteBanner = async (index) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const bannerConfig = websiteConfigs.find((item) => item.key === 'banners')
    
    if (!bannerConfig) {
      throw new Error('Không tìm thấy cấu hình banner')
    }
    
    const banners = bannerConfig.content || []
    if (index < 0 || index >= banners.length) {
      throw new Error('Banner không tồn tại')
    }
    
    const newBanners = banners.filter((_, i) => i !== index)
    
    const payload = {
      key: 'banners',
      title: 'Banner Configuration',
      description: 'Cấu hình banner của website',
      content: newBanners,
      status: 'active'
    }
    
    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${bannerConfig._id}`,
      payload
    )
    return updateResponse.data
  } catch (error) {
    console.error('Lỗi khi xóa banner:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể xóa banner. Vui lòng thử lại.'
    )
  }
}

// Lấy banner config (toàn bộ object config)
export const getBannerConfig = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    
    const websiteConfigs = response.data.data || response.data
    const bannerConfig = websiteConfigs.find((item) => item.key === 'banners')
    return bannerConfig || null
  } catch (error) {
    console.error('Lỗi khi lấy cấu hình banner:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể tải cấu hình banner. Vui lòng thử lại.'
    )
  }
}
