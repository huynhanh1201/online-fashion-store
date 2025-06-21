import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy cấu hình Flash Sale từ website-configs
export const getFlashSaleConfig = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    
    // API trả về cấu trúc { data: [...], meta: {...} }
    const websiteConfigs = response.data.data || response.data
    
    const flashSaleConfig = websiteConfigs.find((item) => item.key === 'flashSale')
    return flashSaleConfig?.content || {
      enabled: false,
      title: '',
      startTime: '',
      endTime: '',
      status: 'inactive',
      products: []
    }
  } catch (error) {
    console.error('Lỗi khi lấy cấu hình Flash Sale:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể tải cấu hình Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Lấy danh sách sản phẩm Flash Sale
export const getFlashSaleProducts = async () => {
  try {
    const flashSaleConfig = await getFlashSaleConfig()
    return flashSaleConfig.products || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm Flash Sale:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể tải danh sách sản phẩm Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Cập nhật cấu hình Flash Sale
export const updateFlashSaleConfig = async (configData) => {
  try {
    // Trước tiên lấy flash sale config hiện tại
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const flashSaleConfig = websiteConfigs.find((item) => item.key === 'flashSale')
    
    const payload = {
      key: 'flashSale',
      title: 'Flash Sale Configuration',
      description: 'Cấu hình Flash Sale của website',
      content: {
        enabled: configData.enabled ?? true,
        title: configData.title || '',
        startTime: configData.startTime || '',
        endTime: configData.endTime || '',
        status: configData.status || 'inactive',
        products: configData.products || []
      },
      status: 'active'
    }
    
    if (flashSaleConfig) {
      // Update config hiện tại
      const updateResponse = await AuthorizedAxiosInstance.patch(
        `${API_ROOT}/v1/website-configs/${flashSaleConfig._id}`,
        payload
      )
      return updateResponse.data
    } else {
      // Tạo config mới
      const createResponse = await AuthorizedAxiosInstance.post(
        `${API_ROOT}/v1/website-configs`,
        payload
      )
      return createResponse.data
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật cấu hình Flash Sale:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể cập nhật cấu hình Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Thêm sản phẩm vào Flash Sale
export const addProductToFlashSale = async (productData) => {
  try {
    const currentConfig = await getFlashSaleConfig()
    const currentProducts = currentConfig.products || []
    
    const newProduct = {
      productId: productData.productId,
      originalPrice: productData.originalPrice,
      flashPrice: productData.flashPrice
    }
    
    const updatedProducts = [...currentProducts, newProduct]
    
    await updateFlashSaleConfig({
      ...currentConfig,
      products: updatedProducts
    })
    
    return newProduct
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào Flash Sale:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể thêm sản phẩm vào Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Cập nhật sản phẩm trong Flash Sale
export const updateProductInFlashSale = async (productId, updatedData) => {
  try {
    const currentConfig = await getFlashSaleConfig()
    const currentProducts = currentConfig.products || []
    
    const updatedProducts = currentProducts.map(product => 
      product.productId === productId 
        ? { ...product, ...updatedData }
        : product
    )
    
    await updateFlashSaleConfig({
      ...currentConfig,
      products: updatedProducts
    })
    
    return updatedProducts.find(p => p.productId === productId)
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm trong Flash Sale:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể cập nhật sản phẩm trong Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Xóa sản phẩm khỏi Flash Sale
export const removeProductFromFlashSale = async (productId) => {
  try {
    const currentConfig = await getFlashSaleConfig()
    const currentProducts = currentConfig.products || []
    
    const updatedProducts = currentProducts.filter(product => 
      product.productId !== productId
    )
    
    await updateFlashSaleConfig({
      ...currentConfig,
      products: updatedProducts
    })
    
    return true
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm khỏi Flash Sale:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể xóa sản phẩm khỏi Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Kích hoạt/Hủy kích hoạt Flash Sale
export const toggleFlashSaleStatus = async (enabled) => {
  try {
    const currentConfig = await getFlashSaleConfig()
    
    await updateFlashSaleConfig({
      ...currentConfig,
      enabled: enabled
    })
    
    return true
  } catch (error) {
    console.error('Lỗi khi thay đổi trạng thái Flash Sale:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể thay đổi trạng thái Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Cập nhật thời gian Flash Sale
export const updateFlashSaleTime = async (startTime, endTime) => {
  try {
    const currentConfig = await getFlashSaleConfig()
    
    await updateFlashSaleConfig({
      ...currentConfig,
      startTime: startTime,
      endTime: endTime
    })
    
    return true
  } catch (error) {
    console.error('Lỗi khi cập nhật thời gian Flash Sale:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể cập nhật thời gian Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Cập nhật tiêu đề Flash Sale
export const updateFlashSaleTitle = async (title) => {
  try {
    const currentConfig = await getFlashSaleConfig()
    
    await updateFlashSaleConfig({
      ...currentConfig,
      title: title
    })
    
    return true
  } catch (error) {
    console.error('Lỗi khi cập nhật tiêu đề Flash Sale:', error)
    throw new Error(
      error.response?.data?.message || 
      'Không thể cập nhật tiêu đề Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Kiểm tra trạng thái Flash Sale
export const getFlashSaleStatus = async () => {
  try {
    const config = await getFlashSaleConfig()
    const now = new Date()
    const startTime = new Date(config.startTime)
    const endTime = new Date(config.endTime)
    
    if (!config.enabled) {
      return 'disabled'
    }
    
    if (now < startTime) {
      return 'upcoming'
    } else if (now >= startTime && now <= endTime) {
      return 'active'
    } else {
      return 'expired'
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra trạng thái Flash Sale:', error)
    return 'error'
  }
}
