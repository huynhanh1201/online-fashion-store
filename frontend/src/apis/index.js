import { toast } from 'react-toastify'

import authorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Users
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/auth/register`,
    data
  )
  toast.success('Tạo tài khoản thành công! Vui lòng xác thực tài khoản.')

  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/auth/verify`,
    data
  )
  toast.success('Xác thực tài khoản thành công.')

  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/auth/refresh_token`
  )

  return response.data
}
