import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy danh sách service highlights từ website-configs
export const getServiceHighlights = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    
    // API trả về cấu trúc { data: [...], meta: {...} }
    const websiteConfigs = response.data.data || response.data
    
    const serviceHighlightConfig = websiteConfigs.find((item) => item.key === 'serviceHighlights')
    return serviceHighlightConfig?.content || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách service highlights:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể tải danh sách service highlights. Vui lòng thử lại.'
    )
  }
}

// Lấy service highlight config (toàn bộ object config)
export const getServiceHighlightConfig = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    
    const websiteConfigs = response.data.data || response.data
    const serviceHighlightConfig = websiteConfigs.find((item) => item.key === 'serviceHighlights')
    return serviceHighlightConfig || null
  } catch (error) {
    console.error('Lỗi khi lấy cấu hình service highlights:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể tải cấu hình service highlights. Vui lòng thử lại.'
    )
  }
}

// Thêm service highlight mới
export const addServiceHighlight = async (serviceHighlight) => {
  try {
    // Trước tiên lấy service highlight config hiện tại
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const serviceHighlightConfig = websiteConfigs.find((item) => item.key === 'serviceHighlights')
    
    let serviceHighlights = []
    let configId = null
    
    if (serviceHighlightConfig) {
      // Nếu đã có config, thêm service highlight vào danh sách hiện tại
      serviceHighlights = serviceHighlightConfig.content || []
      configId = serviceHighlightConfig._id
    }
    
    const newServiceHighlights = [...serviceHighlights, serviceHighlight]
    
    if (serviceHighlightConfig) {
      // Update config hiện tại
      const payload = {
        key: 'serviceHighlights',
        title: 'Service Highlight Configuration',
        description: 'Cấu hình dịch vụ nổi bật của website',
        content: newServiceHighlights,
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
        key: 'serviceHighlights',
        title: 'Service Highlight Configuration',
        description: 'Cấu hình dịch vụ nổi bật của website',
        content: newServiceHighlights,
        status: 'active'
      }
      
      const createResponse = await AuthorizedAxiosInstance.post(
        `${API_ROOT}/v1/website-configs`,
        payload
      )
      return createResponse.data
    }
  } catch (error) {
    console.error('Lỗi khi thêm service highlight:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể thêm service highlight. Vui lòng thử lại.'
    )
  }
}

// Sửa service highlight (theo index)
export const updateServiceHighlight = async (index, updatedServiceHighlight) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const serviceHighlightConfig = websiteConfigs.find((item) => item.key === 'serviceHighlights')
    
    if (!serviceHighlightConfig) {
      throw new Error('Không tìm thấy cấu hình service highlights')
    }
    
    const serviceHighlights = serviceHighlightConfig.content || []
    if (index < 0 || index >= serviceHighlights.length) {
      throw new Error('Service highlight không tồn tại')
    }
    
    const newServiceHighlights = serviceHighlights.map((sh, i) => 
      (i === index ? { ...sh, ...updatedServiceHighlight } : sh)
    )
    
    const payload = {
      key: 'serviceHighlights',
      title: 'Service Highlight Configuration',
      description: 'Cấu hình dịch vụ nổi bật của website',
      content: newServiceHighlights,
      status: 'active'
    }
    
    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${serviceHighlightConfig._id}`,
      payload
    )
    return updateResponse.data
  } catch (error) {
    console.error('Lỗi khi cập nhật service highlight:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể cập nhật service highlight. Vui lòng thử lại.'
    )
  }
}

// Xóa service highlight (theo index)
export const deleteServiceHighlight = async (index) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const serviceHighlightConfig = websiteConfigs.find((item) => item.key === 'serviceHighlights')
    
    if (!serviceHighlightConfig) {
      throw new Error('Không tìm thấy cấu hình service highlights')
    }
    
    const serviceHighlights = serviceHighlightConfig.content || []
    if (index < 0 || index >= serviceHighlights.length) {
      throw new Error('Service highlight không tồn tại')
    }
    
    const newServiceHighlights = serviceHighlights.filter((_, i) => i !== index)
    
    const payload = {
      key: 'serviceHighlights',
      title: 'Service Highlight Configuration',
      description: 'Cấu hình dịch vụ nổi bật của website',
      content: newServiceHighlights,
      status: 'active'
    }
    
    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${serviceHighlightConfig._id}`,
      payload
    )
    return updateResponse.data
  } catch (error) {
    console.error('Lỗi khi xóa service highlight:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể xóa service highlight. Vui lòng thử lại.'
    )
  }
}

// Cập nhật toàn bộ danh sách service highlights
export const updateServiceHighlights = async (serviceHighlights) => {
  try {
    // Trước tiên lấy service highlight config hiện tại để lấy ID
    const currentConfig = await getServiceHighlightConfig()
    
    if (!currentConfig?._id) {
      throw new Error('Không tìm thấy cấu hình service highlights để cập nhật')
    }

    const payload = {
      key: 'serviceHighlights',
      title: 'Service Highlight Configuration',
      description: 'Cấu hình dịch vụ nổi bật của website',
      content: serviceHighlights,
      status: 'active'
    }
    
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${currentConfig._id}`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật danh sách service highlights:', error)
    throw new Error(
      error.response?.data?.message || 
      error.message ||
      'Không thể cập nhật danh sách service highlights. Vui lòng thử lại.'
    )
  }
}

// Tạo cấu hình service highlights mới
export const createServiceHighlightConfig = async (serviceHighlights) => {
  try {
    const payload = {
      key: 'serviceHighlights',
      title: 'Service Highlight Configuration',
      description: 'Cấu hình dịch vụ nổi bật của website',
      content: serviceHighlights,
      status: 'active'
    }
    
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/website-configs`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo cấu hình service highlights:', error)
    throw new Error(
      error.response?.data?.message || 
      error.message ||
      'Không thể tạo cấu hình service highlights. Vui lòng thử lại.'
    )
  }
}

// Helper function để validate service highlight content
export const validateServiceHighlightContent = (serviceHighlights) => {
  const errors = []

  if (!Array.isArray(serviceHighlights)) {
    errors.push('Service highlights phải là một mảng')
    return errors
  }

  serviceHighlights.forEach((service, index) => {
    if (!service.title?.trim()) {
      errors.push(`Service highlight ${index + 1} thiếu tiêu đề`)
    }
    if (!service.subtitle?.trim()) {
      errors.push(`Service highlight ${index + 1} thiếu mô tả`)
    }
    if (!service.imageUrl?.trim()) {
      errors.push(`Service highlight ${index + 1} thiếu hình ảnh`)
    }
  })

  return errors
}

// Helper function để lấy cấu trúc mặc định
export const getDefaultServiceHighlightStructure = () => {
  return [
    {
      title: "Miễn phí vận chuyển",
      subtitle: "Đơn hàng trên 500K",
      imageUrl: "/uploads/icons/free-delivery.png"
    },
    {
      title: "Ship COD toàn quốc",
      subtitle: "Yên tâm mua sắm",
      imageUrl: "/uploads/icons/cod.png"
    },
    {
      title: "Đổi trả dễ dàng",
      subtitle: "7 ngày đổi trả",
      imageUrl: "/uploads/icons/return.png"
    },
    {
      title: "Hotline: 0123456789",
      subtitle: "Hỗ trợ bạn 24/24",
      imageUrl: "/uploads/icons/support.png"
    }
  ]
}
