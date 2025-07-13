import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy danh sách featured categories từ website-configs
export const getFeaturedCategories = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    
    // API trả về cấu trúc { data: [...], meta: {...} }
    const websiteConfigs = response.data.data || response.data
    
    const featuredCategoryConfig = websiteConfigs.find((item) => item.key === 'featuredCategories')
    return featuredCategoryConfig?.content || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách featured categories:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể tải danh sách featured categories. Vui lòng thử lại.'
    )
  }
}

// Lấy featured category config (toàn bộ object config)
export const getFeaturedCategoryConfig = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    
    const websiteConfigs = response.data.data || response.data
    const featuredCategoryConfig = websiteConfigs.find((item) => item.key === 'featuredCategories')
    return featuredCategoryConfig || null
  } catch (error) {
    console.error('Lỗi khi lấy cấu hình featured categories:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể tải cấu hình featured categories. Vui lòng thử lại.'
    )
  }
}

// Thêm featured category mới
export const addFeaturedCategory = async (featuredCategory) => {
  try {
    // Trước tiên lấy featured category config hiện tại
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const featuredCategoryConfig = websiteConfigs.find((item) => item.key === 'featuredCategories')
    
    let featuredCategories = []
    let configId = null
    
    if (featuredCategoryConfig) {
      // Nếu đã có config, thêm featured category vào danh sách hiện tại
      featuredCategories = featuredCategoryConfig.content || []
      configId = featuredCategoryConfig._id
    }
    
    const newFeaturedCategories = [...featuredCategories, featuredCategory]
    
    if (featuredCategoryConfig) {
      // Update config hiện tại
      const payload = {
        key: 'featuredCategories',
        title: 'Featured Category Configuration',
        description: 'Cấu hình danh mục nổi bật của website',
        content: newFeaturedCategories,
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
        key: 'featuredCategories',
        title: 'Featured Category Configuration',
        description: 'Cấu hình danh mục nổi bật của website',
        content: newFeaturedCategories,
        status: 'active'
      }
      
      const createResponse = await AuthorizedAxiosInstance.post(
        `${API_ROOT}/v1/website-configs`,
        payload
      )
      return createResponse.data
    }
  } catch (error) {
    console.error('Lỗi khi thêm featured category:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể thêm featured category. Vui lòng thử lại.'
    )
  }
}

// Sửa featured category (theo index)
export const updateFeaturedCategory = async (index, updatedFeaturedCategory) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const featuredCategoryConfig = websiteConfigs.find((item) => item.key === 'featuredCategories')
    
    if (!featuredCategoryConfig) {
      throw new Error('Không tìm thấy cấu hình featured categories')
    }
    
    const featuredCategories = featuredCategoryConfig.content || []
    if (index < 0 || index >= featuredCategories.length) {
      throw new Error('Featured category không tồn tại')
    }
    
    const newFeaturedCategories = featuredCategories.map((fc, i) => 
      (i === index ? { ...fc, ...updatedFeaturedCategory } : fc)
    )
    
    const payload = {
      key: 'featuredCategories',
      title: 'Featured Category Configuration',
      description: 'Cấu hình danh mục nổi bật của website',
      content: newFeaturedCategories,
      status: 'active'
    }
    
    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${featuredCategoryConfig._id}`,
      payload
    )
    return updateResponse.data
  } catch (error) {
    console.error('Lỗi khi cập nhật featured category:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể cập nhật featured category. Vui lòng thử lại.'
    )
  }
}

// Xóa featured category (theo index)
export const deleteFeaturedCategory = async (index) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const featuredCategoryConfig = websiteConfigs.find((item) => item.key === 'featuredCategories')
    
    if (!featuredCategoryConfig) {
      throw new Error('Không tìm thấy cấu hình featured categories')
    }
    
    const featuredCategories = featuredCategoryConfig.content || []
    if (index < 0 || index >= featuredCategories.length) {
      throw new Error('Featured category không tồn tại')
    }
    
    const newFeaturedCategories = featuredCategories.filter((_, i) => i !== index)
    
    const payload = {
      key: 'featuredCategories',
      title: 'Featured Category Configuration',
      description: 'Cấu hình danh mục nổi bật của website',
      content: newFeaturedCategories,
      status: 'active'
    }
    
    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${featuredCategoryConfig._id}`,
      payload
    )
    return updateResponse.data
  } catch (error) {
    console.error('Lỗi khi xóa featured category:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể xóa featured category. Vui lòng thử lại.'
    )
  }
}

// Cập nhật toàn bộ danh sách featured categories
export const updateFeaturedCategories = async (featuredCategories) => {
  try {
    // Trước tiên lấy featured category config hiện tại để lấy ID
    const currentConfig = await getFeaturedCategoryConfig()
    
    if (!currentConfig?._id) {
      throw new Error('Không tìm thấy cấu hình featured categories để cập nhật')
    }

    const payload = {
      key: 'featuredCategories',
      title: 'Featured Category Configuration',
      description: 'Cấu hình danh mục nổi bật của website',
      content: featuredCategories,
      status: 'active'
    }
    
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${currentConfig._id}`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật danh sách featured categories:', error)
    throw new Error(
      error.response?.data?.message || 
      error.message ||
      'Không thể cập nhật danh sách featured categories. Vui lòng thử lại.'
    )
  }
}

// Tạo cấu hình featured categories mới
export const createFeaturedCategoryConfig = async (featuredCategories) => {
  try {
    const payload = {
      key: 'featuredCategories',
      title: 'Featured Category Configuration',
      description: 'Cấu hình danh mục nổi bật của website',
      content: featuredCategories,
      status: 'active'
    }
    
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/website-configs`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo cấu hình featured categories:', error)
    throw new Error(
      error.response?.data?.message || 
      error.message ||
      'Không thể tạo cấu hình featured categories. Vui lòng thử lại.'
    )
  }
}

// Helper function để validate featured category content
export const validateFeaturedCategoryContent = (featuredCategories) => {
  const errors = []

  if (!Array.isArray(featuredCategories)) {
    errors.push('Featured categories phải là một mảng')
    return errors
  }

  featuredCategories.forEach((category, index) => {
    if (!category.name?.trim()) {
      errors.push(`Featured category ${index + 1} thiếu tên`)
    }
    if (!category.imageUrl?.trim()) {
      errors.push(`Featured category ${index + 1} thiếu hình ảnh`)
    }
    if (!category.link?.trim()) {
      errors.push(`Featured category ${index + 1} thiếu link`)
    }
  })

  return errors
}

// Helper function để lấy cấu trúc mặc định
export const getDefaultFeaturedCategoryStructure = () => {
  return [
    {
      name: "Áo đi làm",
      imageUrl: "/uploads/ao-di-lam.jpg",
      link: "/categories/ao-di-lam"
    },
    {
      name: "Đồ mặc hằng ngày",
      imageUrl: "/uploads/do-mac-hang-ngay.jpg",
      link: "/categories/do-mac-hang-ngay"
    }
  ]
}
