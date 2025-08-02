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

export const createHeaderConfig = async (content) => {
  try {
    const payload = {
      key: 'header',
      title: 'Header Configuration',
      description: 'Cấu hình header của website',
      content,
      status: 'active'
    }

    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/website-configs`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo cấu hình header:', error)
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Không thể tạo cấu hình header. Vui lòng thử lại.'
    )
  }
}

// Helper function to save or update header config
export const saveHeaderConfig = async (content) => {
  try {
    const existingHeader = await getHeaderConfig()

    if (existingHeader) {
      return await updateHeaderConfig(content)
    } else {
      return await createHeaderConfig(content)
    }
  } catch (error) {
    console.error('Lỗi khi lưu cấu hình header:', error)
    throw error
  }
}

// Menu Management Functions
export const getMenuConfig = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/website-configs`
    )

    const websiteConfigs = response.data.data || response.data
    const menu = websiteConfigs.find((item) => item.key === 'menu')
    return menu || null
  } catch (error) {
    console.error('Lỗi khi lấy cấu hình menu:', error)
    throw new Error(
      error.response?.data?.message ||
        'Không thể tải cấu hình menu. Vui lòng thử lại.'
    )
  }
}

export const updateMenuConfig = async (content) => {
  try {
    // Trước tiên lấy menu config hiện tại để lấy ID
    const currentMenu = await getMenuConfig()

    if (!currentMenu?._id) {
      throw new Error('Không tìm thấy cấu hình menu để cập nhật')
    }

    const payload = {
      key: 'menu',
      title: 'Menu Configuration',
      description: 'Cấu hình menu của website',
      content,
      status: 'active'
    }

    const response = await AuthorizedAxiosInstance.patch(
      `${API_ROOT}/v1/website-configs/${currentMenu._id}`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật cấu hình menu:', error)
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Không thể cập nhật cấu hình menu. Vui lòng thử lại.'
    )
  }
}

export const createMenuConfig = async (content) => {
  try {
    const payload = {
      key: 'menu',
      title: 'Menu Configuration',
      description: 'Cấu hình menu của website',
      content,
      status: 'active'
    }

    const response = await AuthorizedAxiosInstance.post(
      `${API_ROOT}/v1/website-configs`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo cấu hình menu:', error)
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Không thể tạo cấu hình menu. Vui lòng thử lại.'
    )
  }
}

// Helper function to validate header content
export const validateHeaderContent = (content) => {
  const errors = []

  // Logo validation - optional for initial creation
  if (content.logo?.imageUrl && !content.logo?.alt?.trim()) {
    errors.push('Logo alt text không được để trống khi có logo')
  }

  // Validate banners
  content.topBanner?.forEach((banner, index) => {
    if (banner.visible && !banner.text?.trim()) {
      errors.push(`Banner ${index + 1} đang hiển thị nhưng không có nội dung`)
    }
  })

  return errors
}

// Helper function to validate menu content
export const validateMenuContent = (content) => {
  const errors = []

  // Validate main menu
  if (content.mainMenu) {
    if (!Array.isArray(content.mainMenu)) {
      errors.push('Main menu phải là một mảng')
    } else {
      content.mainMenu.forEach((item, index) => {
        if (!item.label?.trim()) {
          errors.push(`cột  ${index + 1} thiếu thành phần`)
        }
        // URL is optional for main menu items (they can be just titles)
        // if (!item.url?.trim()) {
        //   errors.push(`Menu item ${index + 1} thiếu URL`)
        // }
        if (item.children && !Array.isArray(item.children)) {
          errors.push(`Submenu của item ${index + 1} phải là một mảng`)
        }
        // Validate submenu items
        if (item.children) {
          item.children.forEach((subItem, subIndex) => {
            if (!subItem.label?.trim()) {
              errors.push(
                `Submenu item ${subIndex + 1} của menu ${index + 1} thiếu label`
              )
            }
            if (!subItem.url?.trim()) {
              errors.push(
                `Submenu item ${subIndex + 1} của menu ${index + 1} thiếu URL`
              )
            }
          })
        }
      })
    }
  }

  return errors
}

// Helper function to get default menu structure
export const getDefaultMenuStructure = () => {
  return {
    mainMenu: [
      {
        label: 'Sản phẩm',
        url: '/product',
        visible: true,
        order: 1,
        children: [
          {
            label: 'Tất cả sản phẩm',
            url: '/product',
            visible: true,
            order: 1
          },
          {
            label: 'Sản phẩm mới',
            url: '/productnews',
            visible: true,
            order: 2
          }
        ]
      }
    ],
    mobileMenu: [],
    footerMenu: [],
    settings: {
      showSearch: true,
      showCart: true,
      showUserMenu: true,
      stickyHeader: true,
      mobileBreakpoint: 768,
      megamenuSettings: {
        maxColumns: 4,
        columnWidth: 'auto',
        showIcons: false,
        animationDuration: 350,
        showCategoryImages: false,
        enableHoverEffects: true
      }
    }
  }
}

// Helper function to save or update menu config
export const saveMenuConfig = async (content) => {
  try {
    const existingMenu = await getMenuConfig()

    if (existingMenu) {
      return await updateMenuConfig(content)
    } else {
      return await createMenuConfig(content)
    }
  } catch (error) {
    console.error('Lỗi khi lưu cấu hình menu:', error)
    throw error
  }
}
