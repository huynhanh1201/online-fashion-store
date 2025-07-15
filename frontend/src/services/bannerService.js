import axios from 'axios'
import { API_ROOT } from '~/utils/constants.js'

// Lấy danh sách banner cho user (không cần authorization)
export const getUserBanners = async () => {
  try {
    const response = await axios.get(`${API_ROOT}/v1/website-configs`)
    
    const websiteConfigs = response.data.data || response.data
    const bannerConfig = websiteConfigs.find((item) => item.key === 'banners')
    
    if (!bannerConfig || !bannerConfig.content) {
      return []
    }
    
    // Lọc chỉ những banner đang hoạt động và trong thời gian hiển thị
    const now = new Date()
    const activeBanners = bannerConfig.content.filter(banner => {
      if (!banner.visible) return false
      
      const startDate = banner.startDate ? new Date(banner.startDate) : null
      const endDate = banner.endDate ? new Date(banner.endDate) : null
      
      if (startDate && now < startDate) return false
      if (endDate && now > endDate) return false
      
      return true
    })
    
    return activeBanners
  } catch (error) {
    console.error('Lỗi khi lấy banner cho user:', error)
    return []
  }
}

// Lấy banner theo vị trí cụ thể
export const getBannersByPosition = async (position) => {
  try {
    const banners = await getUserBanners()
    return banners.filter(banner => banner.position === position)
  } catch (error) {
    console.error('Lỗi khi lấy banner theo vị trí:', error)
    return []
  }
} 