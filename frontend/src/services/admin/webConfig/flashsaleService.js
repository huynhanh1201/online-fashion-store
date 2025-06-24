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

// Hàm trả về cấu trúc mặc định cho content Flash Sale
export const getDefaultFlashSaleContent = () => ({
  enabled: false,
  title: '',
  startTime: '',
  endTime: '',
  status: 'inactive',
  products: []
})

// Tạo cấu hình Flash Sale mới
export const createFlashSaleConfig = async (flashSaleContent) => {
  try {
    // Log dữ liệu đầu vào để debug
    console.log('Dữ liệu đầu vào flashSaleContent:', flashSaleContent)
    if (typeof flashSaleContent !== 'object' || Array.isArray(flashSaleContent)) {
      console.warn('flashSaleContent không phải object hoặc là mảng!')
    }
    // Đảm bảo content là object đủ trường
    const defaultContent = getDefaultFlashSaleContent()
    const content = { ...defaultContent, ...flashSaleContent }
    const payload = {
      key: 'flashSale',
      title: 'Flash Sale Configuration',
      description: 'Cấu hình Flash Sale của website',
      content: {
        enabled: flashSaleContent.enabled ?? true,
        title: flashSaleContent.title || '',
        startTime: flashSaleContent.startTime || '',
        endTime: flashSaleContent.endTime || '',
        status: flashSaleContent.status || 'inactive',
        products: flashSaleContent.products || []
      },
      status: 'active'
    }
    
    console.log('Payload gửi lên khi tạo Flash Sale:', payload)
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/website-configs`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo cấu hình Flash Sale:', error)
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Không thể tạo cấu hình Flash Sale. Vui lòng thử lại.'
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
        enabled: flashSaleContent.enabled ?? true,
        title: flashSaleContent.title || '',
        startTime: flashSaleContent.startTime || '',
        endTime: flashSaleContent.endTime || '',
        status: flashSaleContent.status || 'inactive',
        products: flashSaleContent.products || []
      },
      status: 'active'
    }
    
    
    if (flashSaleConfig) {
      // Update config hiện tại
      const updateResponse = await AuthorizedAxiosInstance.patch(
        `${API_ROOT}/v1/website-configs/${flashSaleConfig._id}`,
        payload
      )
      console.log('PATCH response:', updateResponse.data)
      return updateResponse.data
    } else {
      // Tạo config mới
      const createResponse = await createFlashSaleConfig(payload.content)
      console.log('POST response:', createResponse)
      return createResponse
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

// Hàm tạo mới flash sale (public API)
export const createFlashSale = async (content) => {
  try {
    // Đảm bảo content đủ trường
    const defaultContent = getDefaultFlashSaleContent()
    let fullContent = { ...defaultContent, ...content }

    // Kiểm tra products phải là mảng và có ít nhất 1 phần tử
    if (!Array.isArray(fullContent.products) || fullContent.products.length === 0) {
      throw new Error('Products phải là mảng và có ít nhất 1 sản phẩm')
    }
    // Kiểm tra từng sản phẩm trong products
    fullContent.products = fullContent.products.map((p, idx) => {
      if (!p.productId || typeof p.productId !== 'string') {
        throw new Error(`Sản phẩm thứ ${idx + 1} thiếu productId hoặc productId không hợp lệ`)
      }
      // Đảm bảo originalPrice và flashPrice là number
      const originalPrice = Number(p.originalPrice)
      const flashPrice = Number(p.flashPrice)
      if (isNaN(originalPrice) || isNaN(flashPrice)) {
        throw new Error(`Sản phẩm thứ ${idx + 1} phải có originalPrice và flashPrice là số`)
      }
      if (flashPrice >= originalPrice) {
        throw new Error(`Sản phẩm thứ ${idx + 1} flashPrice phải nhỏ hơn originalPrice`)
      }
      return {
        productId: p.productId,
        originalPrice,
        flashPrice
      }
    })
    // Đảm bảo các trường khác không bị thiếu
    if (!fullContent.title || !fullContent.startTime || !fullContent.endTime) {
      throw new Error('Vui lòng nhập đầy đủ tiêu đề, thời gian bắt đầu và kết thúc')
    }
    const payload = {
      key: 'flashSale',
      title: 'Flash Sale Configuration',
      description: 'Cấu hình Flash Sale của website',
      content: fullContent,
      status: 'active'
    }
    console.log('Payload gửi lên khi tạo mới flash sale (đã kiểm tra):', payload)
    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/website-configs`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo mới flash sale:', error)
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Không thể tạo mới flash sale. Vui lòng thử lại.'
    )
  }
}
