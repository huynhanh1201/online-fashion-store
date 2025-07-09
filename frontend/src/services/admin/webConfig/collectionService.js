import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy danh sách collections từ website-configs
export const getCollections = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    
    // API trả về cấu trúc { data: [...], meta: {...} }
    const websiteConfigs = response.data.data || response.data
    
    const collectionConfig = websiteConfigs.find((item) => item.key === 'collections')
    return collectionConfig?.content || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách collections:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể tải danh sách collections. Vui lòng thử lại.'
    )
  }
}

// Lấy collection config (toàn bộ object config)
export const getCollectionConfig = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    
    const websiteConfigs = response.data.data || response.data
    const collectionConfig = websiteConfigs.find((item) => item.key === 'collections')
    return collectionConfig || null
  } catch (error) {
    console.error('Lỗi khi lấy cấu hình collections:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể tải cấu hình collections. Vui lòng thử lại.'
    )
  }
}

// Thêm collection mới
export const addCollection = async (collection) => {
  try {
    // Trước tiên lấy collection config hiện tại
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const collectionConfig = websiteConfigs.find((item) => item.key === 'collections')
    
    let collections = []
    let configId = null
    
    if (collectionConfig) {
      // Nếu đã có config, thêm collection vào danh sách hiện tại
      collections = collectionConfig.content || []
      configId = collectionConfig._id
    }
    
    const newCollections = [...collections, collection]
    
    if (collectionConfig) {
      // Update config hiện tại
      const payload = {
        key: 'collections',
        title: 'Collection Configuration',
        description: 'Cấu hình bộ sưu tập sản phẩm của website',
        content: newCollections,
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
        key: 'collections',
        title: 'Collection Configuration',
        description: 'Cấu hình bộ sưu tập sản phẩm của website',
        content: newCollections,
        status: 'active'
      }
      
      const createResponse = await AuthorizedAxiosInstance.post(
        `${API_ROOT}/v1/website-configs`,
        payload
      )
      return createResponse.data
    }
  } catch (error) {
    console.error('Lỗi khi thêm collection:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể thêm collection. Vui lòng thử lại.'
    )
  }
}

// Sửa collection (theo index)
export const updateCollection = async (index, updatedCollection) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const collectionConfig = websiteConfigs.find((item) => item.key === 'collections')
    
    if (!collectionConfig) {
      throw new Error('Không tìm thấy cấu hình collections')
    }
    
    const collections = collectionConfig.content || []
    if (index < 0 || index >= collections.length) {
      throw new Error('Collection không tồn tại')
    }
    
    const newCollections = collections.map((col, i) => 
      (i === index ? { ...col, ...updatedCollection } : col)
    )
    
    const payload = {
      key: 'collections',
      title: 'Collection Configuration',
      description: 'Cấu hình bộ sưu tập sản phẩm của website',
      content: newCollections,
      status: 'active'
    }
    
    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${collectionConfig._id}`,
      payload
    )
    return updateResponse.data
  } catch (error) {
    console.error('Lỗi khi cập nhật collection:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể cập nhật collection. Vui lòng thử lại.'
    )
  }
}

// Xóa collection (theo index)
export const deleteCollection = async (index) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const collectionConfig = websiteConfigs.find((item) => item.key === 'collections')
    
    if (!collectionConfig) {
      throw new Error('Không tìm thấy cấu hình collections')
    }
    
    const collections = collectionConfig.content || []
    if (index < 0 || index >= collections.length) {
      throw new Error('Collection không tồn tại')
    }
    
    const newCollections = collections.filter((_, i) => i !== index)
    
    const payload = {
      key: 'collections',
      title: 'Collection Configuration',
      description: 'Cấu hình bộ sưu tập sản phẩm của website',
      content: newCollections,
      status: 'active'
    }
    
    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${collectionConfig._id}`,
      payload
    )
    return updateResponse.data
  } catch (error) {
    console.error('Lỗi khi xóa collection:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể xóa collection. Vui lòng thử lại.'
    )
  }
}

// Cập nhật toàn bộ danh sách collections
export const updateCollections = async (collections) => {
  try {
    // Trước tiên lấy collection config hiện tại để lấy ID
    const currentConfig = await getCollectionConfig()
    
    if (!currentConfig?._id) {
      throw new Error('Không tìm thấy cấu hình collections để cập nhật')
    }

    const payload = {
      key: 'collections',
      title: 'Collection Configuration',
      description: 'Cấu hình bộ sưu tập sản phẩm của website',
      content: collections,
      status: 'active'
    }
    
    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${currentConfig._id}`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật danh sách collections:', error)
    throw new Error(
      error.response?.data?.message || 
      error.message ||
      'Không thể cập nhật danh sách collections. Vui lòng thử lại.'
    )
  }
}

// Tạo cấu hình collections mới
export const createCollectionConfig = async (collections) => {
  try {
    const payload = {
      key: 'collections',
      title: 'Collection Configuration',
      description: 'Cấu hình bộ sưu tập sản phẩm của website',
      content: collections,
      status: 'active'
    }
    
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/website-configs`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo cấu hình collections:', error)
    throw new Error(
      error.response?.data?.message || 
      error.message ||
      'Không thể tạo cấu hình collections. Vui lòng thử lại.'
    )
  }
}

// Helper function để validate collection content
export const validateCollectionContent = (collections) => {
  const errors = []

  if (!Array.isArray(collections)) {
    errors.push('Collections phải là một mảng')
    return errors
  }

  collections.forEach((collection, index) => {
    if (!collection.name?.trim()) {
      errors.push(`Collection ${index + 1} thiếu tên`)
    }
    if (!collection.imageUrl?.trim()) {
      errors.push(`Collection ${index + 1} thiếu hình ảnh`)
    }
    if (!collection.description?.trim()) {
      errors.push(`Collection ${index + 1} thiếu mô tả`)
    }
    if (!Array.isArray(collection.products) || collection.products.length === 0) {
      errors.push(`Collection ${index + 1} phải có ít nhất một sản phẩm`)
    }
  })

  return errors
}

// Helper function để lấy cấu trúc mặc định
export const getDefaultCollectionStructure = () => {
  return [
    {
      name: "Bộ sưu tập mùa hè",
      imageUrl: "/uploads/summer-collection.jpg",
      description: "Những sản phẩm thời trang mùa hè mới nhất",
      products: [],
      status: "active"
    },
    {
      name: "Bộ sưu tập công sở",
      imageUrl: "/uploads/office-collection.jpg", 
      description: "Thời trang công sở thanh lịch và chuyên nghiệp",
      products: [],
      status: "active"
    }
  ]
}
