/**
 * Utility functions for handling redirect after login/register
 */

const REDIRECT_KEY = 'redirectAfterLogin'


export const saveRedirectPath = (currentPath) => {
  // Không lưu các trang auth và trang chủ
  const excludePaths = ['/login', '/register', '/account/verification', '/']

  if (!excludePaths.includes(currentPath)) {
    localStorage.setItem(REDIRECT_KEY, currentPath)
  }
}

/**
 * Lấy đường dẫn redirect từ localStorage
 * @returns {string|null} - Đường dẫn redirect hoặc null
 */
export const getRedirectPath = () => {
  return localStorage.getItem(REDIRECT_KEY)
}

/**
 * Xóa đường dẫn redirect khỏi localStorage
 */
export const clearRedirectPath = () => {
  localStorage.removeItem(REDIRECT_KEY)
}


export const redirectToSavedPath = (navigate, defaultPath = '/') => {
  const redirectPath = getRedirectPath()

  if (redirectPath) {
    clearRedirectPath()
    navigate(redirectPath)
  } else {
    navigate(defaultPath)
  }
}