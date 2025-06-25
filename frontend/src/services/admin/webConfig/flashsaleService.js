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

    const flashSaleConfig = websiteConfigs.find(
      (item) => item.key === 'flashSale'
    )
    return (
      flashSaleConfig?.content || {
        campaigns: []
      }
    )
  } catch (error) {
    console.error('Lỗi khi lấy cấu hình Flash Sale:', error)
    throw new Error(
      error.response?.data?.message ||
        'Không thể tải cấu hình Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Lấy danh sách tất cả campaigns Flash Sale
export const getFlashSaleCampaigns = async () => {
  try {
    const flashSaleConfig = await getFlashSaleConfig()
    return flashSaleConfig.campaigns || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách campaigns Flash Sale:', error)
    throw new Error(
      error.response?.data?.message ||
        'Không thể tải danh sách campaigns Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Lấy thông tin một campaign cụ thể
export const getFlashSaleCampaign = async (campaignId) => {
  try {
    const flashSaleConfig = await getFlashSaleConfig()
    const campaign = flashSaleConfig.campaigns.find((c) => c.id === campaignId)
    if (!campaign) {
      throw new Error('Không tìm thấy campaign Flash Sale')
    }
    return campaign
  } catch (error) {
    console.error('Lỗi khi lấy campaign Flash Sale:', error)
    throw new Error(
      error.response?.data?.message ||
        'Không thể tải campaign Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Hàm trả về cấu trúc mặc định cho campaign Flash Sale
export const getDefaultCampaignContent = () => ({
  id: '',
  title: '',
  enabled: false,
  startTime: '',
  endTime: '',
  status: 'inactive',
  products: []
})

// Hàm trả về cấu trúc mặc định cho content Flash Sale
export const getDefaultFlashSaleContent = () => ({
  campaigns: []
})

// Tạo campaign Flash Sale mới
export const createFlashSaleCampaign = async (campaignContent) => {
  try {
    console.log('Dữ liệu đầu vào campaignContent:', campaignContent)

    // Validate input
    if (typeof campaignContent !== 'object' || Array.isArray(campaignContent)) {
      throw new Error('campaignContent không phải object hoặc là mảng!')
    }

    // Đảm bảo campaign content đủ trường
    const defaultCampaign = getDefaultCampaignContent()
    const content = {
      ...defaultCampaign,
      ...campaignContent,
      id:
        campaignContent.id ||
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
      enabled: campaignContent.enabled ?? true,
      status: campaignContent.status || 'inactive',
      products: campaignContent.products || []
    }

    // Lấy config hiện tại
    const currentConfig = await getFlashSaleConfig()
    const currentCampaigns = currentConfig.campaigns || []

    // Kiểm tra campaign id đã tồn tại
    if (currentCampaigns.some((c) => c.id === content.id)) {
      throw new Error('Campaign ID đã tồn tại')
    }

    const payload = {
      key: 'flashSale',
      title: 'Flash Sale Configuration',
      description: 'Cấu hình Flash Sale của website',
      content: {
        campaigns: [...currentCampaigns, content]
      },
      status: 'active'
    }

    console.log('Payload gửi lên khi tạo campaign:', payload)

    // Kiểm tra xem đã có flash sale config chưa
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const flashSaleConfig = websiteConfigs.find(
      (item) => item.key === 'flashSale'
    )

    let finalResponse
    if (flashSaleConfig) {
      finalResponse = await AuthorizedAxiosInstance.patch(
        `${API_ROOT}/v1/website-configs/${flashSaleConfig._id}`,
        payload
      )
    } else {
      finalResponse = await AuthorizedAxiosInstance.post(
        `${API_ROOT}/v1/website-configs`,
        payload
      )
    }

    return finalResponse.data
  } catch (error) {
    console.error('Lỗi khi tạo campaign Flash Sale:', error)
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Không thể tạo campaign Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Cập nhật campaign Flash Sale
export const updateFlashSaleCampaign = async (campaignId, campaignData) => {
  try {
    const currentConfig = await getFlashSaleConfig()
    const currentCampaigns = currentConfig.campaigns || []

    const campaignIndex = currentCampaigns.findIndex((c) => c.id === campaignId)
    if (campaignIndex === -1) {
      throw new Error('Không tìm thấy campaign Flash Sale')
    }

    const updatedCampaign = {
      ...currentCampaigns[campaignIndex],
      ...campaignData
    }

    currentCampaigns[campaignIndex] = updatedCampaign

    const payload = {
      key: 'flashSale',
      title: 'Flash Sale Configuration',
      description: 'Cấu hình Flash Sale của website',
      content: {
        campaigns: currentCampaigns
      },
      status: 'active'
    }

    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const flashSaleConfig = websiteConfigs.find(
      (item) => item.key === 'flashSale'
    )

    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${flashSaleConfig._id}`,
      payload
    )

    return updateResponse.data
  } catch (error) {
    console.error('Lỗi khi cập nhật campaign Flash Sale:', error)
    throw new Error(
      error.response?.data?.message ||
        'Không thể cập nhật campaign Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Thêm sản phẩm vào campaign Flash Sale
export const addProductToFlashSaleCampaign = async (
  campaignId,
  productData
) => {
  try {
    const currentConfig = await getFlashSaleConfig()
    const currentCampaigns = currentConfig.campaigns || []

    const campaignIndex = currentCampaigns.findIndex((c) => c.id === campaignId)
    if (campaignIndex === -1) {
      throw new Error('Không tìm thấy campaign Flash Sale')
    }

    const newProduct = {
      productId: productData.productId,
      originalPrice: productData.originalPrice,
      flashPrice: productData.flashPrice
    }

    currentCampaigns[campaignIndex].products = [
      ...(currentCampaigns[campaignIndex].products || []),
      newProduct
    ]

    const payload = {
      key: 'flashSale',
      title: 'Flash Sale Configuration',
      description: 'Cấu hình Flash Sale của website',
      content: {
        campaigns: currentCampaigns
      },
      status: 'active'
    }

    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const flashSaleConfig = websiteConfigs.find(
      (item) => item.key === 'flashSale'
    )

    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${flashSaleConfig._id}`,
      payload
    )

    return newProduct
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào campaign:', error)
    throw new Error(
      error.response?.data?.message ||
        'Không thể thêm sản phẩm vào campaign Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Cập nhật sản phẩm trong campaign Flash Sale
export const updateProductInFlashSaleCampaign = async (
  campaignId,
  productId,
  updatedData
) => {
  try {
    const currentConfig = await getFlashSaleConfig()
    const currentCampaigns = currentConfig.campaigns || []

    const campaignIndex = currentCampaigns.findIndex((c) => c.id === campaignId)
    if (campaignIndex === -1) {
      throw new Error('Không tìm thấy campaign Flash Sale')
    }

    const updatedProducts = currentCampaigns[campaignIndex].products.map(
      (product) =>
        product.productId === productId
          ? { ...product, ...updatedData }
          : product
    )

    currentCampaigns[campaignIndex].products = updatedProducts

    const payload = {
      key: 'flashSale',
      title: 'Flash Sale Configuration',
      description: 'Cấu hình Flash Sale của website',
      content: {
        campaigns: currentCampaigns
      },
      status: 'active'
    }

    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const flashSaleConfig = websiteConfigs.find(
      (item) => item.key === 'flashSale'
    )

    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${flashSaleConfig._id}`,
      payload
    )

    return updatedProducts.find((p) => p.productId === productId)
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm trong campaign:', error)
    throw new Error(
      error.response?.data?.message ||
        'Không thể cập nhật sản phẩm trong campaign Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Xóa sản phẩm khỏi campaign Flash Sale
export const removeProductFromFlashSaleCampaign = async (
  campaignId,
  productId
) => {
  try {
    const currentConfig = await getFlashSaleConfig()
    const currentCampaigns = currentConfig.campaigns || []

    const campaignIndex = currentCampaigns.findIndex((c) => c.id === campaignId)
    if (campaignIndex === -1) {
      throw new Error('Không tìm thấy campaign Flash Sale')
    }

    const updatedProducts = currentCampaigns[campaignIndex].products.filter(
      (product) => product.productId !== productId
    )

    currentCampaigns[campaignIndex].products = updatedProducts

    const payload = {
      key: 'flashSale',
      title: 'Flash Sale Configuration',
      description: 'Cấu hình Flash Sale của website',
      content: {
        campaigns: currentCampaigns
      },
      status: 'active'
    }

    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const flashSaleConfig = websiteConfigs.find(
      (item) => item.key === 'flashSale'
    )

    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${flashSaleConfig._id}`,
      payload
    )

    return true
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm khỏi campaign:', error)
    throw new Error(
      error.response?.data?.message ||
        'Không thể xóa sản phẩm khỏi campaign Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Xóa campaign Flash Sale
export const deleteFlashSaleCampaign = async (campaignId) => {
  try {
    // Lấy cấu hình Flash Sale hiện tại
    const currentConfig = await getFlashSaleConfig()
    const currentCampaigns = currentConfig.campaigns || []

    // Kiểm tra xem campaign có tồn tại không
    const campaignIndex = currentCampaigns.findIndex((c) => c.id === campaignId)
    if (campaignIndex === -1) {
      throw new Error('Không tìm thấy campaign Flash Sale')
    }

    // Xóa campaign khỏi danh sách
    const updatedCampaigns = currentCampaigns.filter((c) => c.id !== campaignId)

    // Tạo payload để cập nhật cấu hình
    const payload = {
      key: 'flashSale',
      title: 'Flash Sale Configuration',
      description: 'Cấu hình Flash Sale của website',
      content: {
        campaigns: updatedCampaigns
      },
      status: 'active'
    }

    // Lấy danh sách website-configs để tìm _id của flashSale config
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const flashSaleConfig = websiteConfigs.find(
      (item) => item.key === 'flashSale'
    )

    if (!flashSaleConfig) {
      throw new Error('Không tìm thấy cấu hình Flash Sale')
    }

    // Cập nhật cấu hình với danh sách campaigns mới
    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${flashSaleConfig._id}`,
      payload
    )

    return updateResponse.data
  } catch (error) {
    console.error('Lỗi khi xóa campaign Flash Sale:', error)
    throw new Error(
      error.response?.data?.message ||
        'Không thể xóa campaign Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Kích hoạt/Hủy kích hoạt campaign Flash Sale
export const toggleFlashSaleCampaignStatus = async (campaignId, enabled) => {
  try {
    const currentConfig = await getFlashSaleConfig()
    const currentCampaigns = currentConfig.campaigns || []

    const campaignIndex = currentCampaigns.findIndex((c) => c.id === campaignId)
    if (campaignIndex === -1) {
      throw new Error('Không tìm thấy campaign Flash Sale')
    }

    currentCampaigns[campaignIndex].enabled = enabled

    const payload = {
      key: 'flashSale',
      title: 'Flash Sale Configuration',
      description: 'Cấu hình Flash Sale của website',
      content: {
        campaigns: currentCampaigns
      },
      status: 'active'
    }

    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const flashSaleConfig = websiteConfigs.find(
      (item) => item.key === 'flashSale'
    )

    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${flashSaleConfig._id}`,
      payload
    )

    return true
  } catch (error) {
    console.error('Lỗi khi thay đổi trạng thái campaign:', error)
    throw new Error(
      error.response?.data?.message ||
        'Không thể thay đổi trạng thái campaign Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Cập nhật thời gian campaign Flash Sale
export const updateFlashSaleCampaignTime = async (
  campaignId,
  startTime,
  endTime
) => {
  try {
    const currentConfig = await getFlashSaleConfig()
    const currentCampaigns = currentConfig.campaigns || []

    const campaignIndex = currentCampaigns.findIndex((c) => c.id === campaignId)
    if (campaignIndex === -1) {
      throw new Error('Không tìm thấy campaign Flash Sale')
    }

    currentCampaigns[campaignIndex] = {
      ...currentCampaigns[campaignIndex],
      startTime,
      endTime
    }

    const payload = {
      key: 'flashSale',
      title: 'Flash Sale Configuration',
      description: 'Cấu hình Flash Sale của website',
      content: {
        campaigns: currentCampaigns
      },
      status: 'active'
    }

    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const flashSaleConfig = websiteConfigs.find(
      (item) => item.key === 'flashSale'
    )

    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${flashSaleConfig._id}`,
      payload
    )

    return true
  } catch (error) {
    console.error('Lỗi khi cập nhật thời gian campaign:', error)
    throw new Error(
      error.response?.data?.message ||
        'Không thể cập nhật thời gian campaign Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Cập nhật tiêu đề campaign Flash Sale
export const updateFlashSaleCampaignTitle = async (campaignId, title) => {
  try {
    const currentConfig = await getFlashSaleConfig()
    const currentCampaigns = currentConfig.campaigns || []

    const campaignIndex = currentCampaigns.findIndex((c) => c.id === campaignId)
    if (campaignIndex === -1) {
      throw new Error('Không tìm thấy campaign Flash Sale')
    }

    currentCampaigns[campaignIndex].title = title

    const payload = {
      key: 'flashSale',
      title: 'Flash Sale Configuration',
      description: 'Cấu hình Flash Sale của website',
      content: {
        campaigns: currentCampaigns
      },
      status: 'active'
    }

    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const flashSaleConfig = websiteConfigs.find(
      (item) => item.key === 'flashSale'
    )

    const updateResponse = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${flashSaleConfig._id}`,
      payload
    )

    return true
  } catch (error) {
    console.error('Lỗi khi cập nhật tiêu đề campaign:', error)
    throw new Error(
      error.response?.data?.message ||
        'Không thể cập nhật tiêu đề campaign Flash Sale. Vui lòng thử lại.'
    )
  }
}

// Kiểm tra trạng thái campaign Flash Sale
export const getFlashSaleCampaignStatus = async (campaignId) => {
  try {
    const campaign = await getFlashSaleCampaign(campaignId)
    const now = new Date()
    const startTime = new Date(campaign.startTime)
    const endTime = new Date(campaign.endTime)

    if (!campaign.enabled) {
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
    console.error('Lỗi khi kiểm tra trạng thái campaign:', error)
    return 'error'
  }
}

// Tạo mới flash sale campaign (public API)
export const createFlashSale = async (campaignContent) => {
  try {
    // Đảm bảo content đủ trường
    const defaultCampaign = getDefaultCampaignContent()
    let fullContent = { ...defaultCampaign, ...campaignContent }

    // Kiểm tra products phải là mảng và có ít nhất 1 phần tử
    if (
      !Array.isArray(fullContent.products) ||
      fullContent.products.length === 0
    ) {
      throw new Error('Products phải là mảng và có ít nhất 1 sản phẩm')
    }

    // Kiểm tra từng sản phẩm trong products
    fullContent.products = fullContent.products.map((p, idx) => {
      if (!p.productId || typeof p.productId !== 'string') {
        throw new Error(
          `Sản phẩm thứ ${idx + 1} thiếu productId hoặc productId không hợp lệ`
        )
      }
      // Đảm bảo originalPrice và flashPrice là number
      const originalPrice = Number(p.originalPrice)
      const flashPrice = Number(p.flashPrice)
      if (isNaN(originalPrice) || isNaN(flashPrice)) {
        throw new Error(
          `Sản phẩm thứ ${idx + 1} phải có originalPrice và flashPrice là số`
        )
      }
      if (flashPrice >= originalPrice) {
        throw new Error(
          `Sản phẩm thứ ${idx + 1} flashPrice phải nhỏ hơn originalPrice`
        )
      }
      return {
        productId: p.productId,
        originalPrice,
        flashPrice
      }
    })

    // Đảm bảo các trường khác không bị thiếu
    if (
      !fullContent.id ||
      !fullContent.title ||
      !fullContent.startTime ||
      !fullContent.endTime
    ) {
      throw new Error(
        'Vui lòng nhập đầy đủ ID, tiêu đề, thời gian bắt đầu và kết thúc'
      )
    }

    // Lấy config hiện tại
    const currentConfig = await getFlashSaleConfig()
    const currentCampaigns = currentConfig.campaigns || []

    // Kiểm tra campaign id đã tồn tại
    if (currentCampaigns.some((c) => c.id === fullContent.id)) {
      throw new Error('Campaign ID đã tồn tại')
    }

    const payload = {
      key: 'flashSale',
      title: 'Flash Sale Configuration',
      description: 'Cấu hình Flash Sale của website',
      content: {
        campaigns: [...currentCampaigns, fullContent]
      },
      status: 'active'
    }

    console.log('Payload gửi lên khi tạo mới campaign (đã kiểm tra):', payload)

    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )
    const websiteConfigs = response.data.data || response.data
    const flashSaleConfig = websiteConfigs.find(
      (item) => item.key === 'flashSale'
    )

    let finalResponse
    if (flashSaleConfig) {
      finalResponse = await AuthorizedAxiosInstance.patch(
        `${API_ROOT}/v1/website-configs/${flashSaleConfig._id}`,
        payload
      )
    } else {
      finalResponse = await AuthorizedAxiosInstance.post(
        `${API_ROOT}/v1/website-configs`,
        payload
      )
    }

    return finalResponse.data
  } catch (error) {
    console.error('Lỗi khi tạo mới campaign:', error)
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Không thể tạo mới campaign Flash Sale. Vui lòng thử lại.'
    )
  }
}
