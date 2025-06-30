import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Lấy danh sách policies cho user (sử dụng API blog với filter type=policy)
export const getPolicies = async (params = {}) => {
  try {
    const { page = 1, limit = 10, type } = params
    const queryString = new URLSearchParams({
      page,
      limit,
      type: 'policy' // Chỉ lấy blogs có type=policy
    }).toString()

    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/blogs?${queryString}`
    )
    
    const policies = response.data.data || []
    
    return {
      policies,
      total: policies.length,
      totalPages: Math.ceil(policies.length / limit)
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách policies:', error)
    return { policies: [], total: 0, totalPages: 1 }
  }
}

// Lấy policy theo loại cụ thể (terms_of_service, privacy_policy, etc.)
export const getPolicyByType = async (policyType) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/blogs?type=policy&category=${policyType}&limit=1`
    )
    
    const policies = response.data.data || []
    
    return policies[0] || null
  } catch (error) {
    console.error(`Lỗi khi lấy policy ${policyType}:`, error)
    return null
  }
}

// Lấy thông tin chi tiết một policy (sử dụng API blog)
export const getPolicyById = async (policyId) => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/blogs/${policyId}`
    )
    
    const policy = response.data || {}
    
    // Chỉ kiểm tra type=policy
    if (policy.type !== 'policy') {
      return null
    }
    
    return policy
  } catch (error) {
    console.error('Lỗi khi lấy thông tin policy:', error)
    return null
  }
}

// Lấy tất cả policies cho trang Policy
export const getAllPolicies = async () => {
  try {
    const response = await AuthorizedAxiosInstance.get(
      `${API_ROOT}/v1/blogs?type=policy&limit=100`
    )
    
    const policies = response.data.data || []
    
    return policies
  } catch (error) {
    console.error('Lỗi khi lấy tất cả policies:', error)
    return []
  }
} 