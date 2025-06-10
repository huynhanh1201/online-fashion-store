import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { GHN_TOKEN_API } from '~/utils/constants.js'

// Service cho dữ liệu địa lý từ GHN
export const addressGHNService = {
  getProvinces: async () => {
    try {
      const response = await AuthorizedAxiosInstance.get(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
        {
          headers: {
            'Content-Type': 'application/json',
            'Token': GHN_TOKEN_API,
          },
        }
      )
      if (response.data.code !== 200 || !response.data.data) {
        throw new Error('Không có dữ liệu tỉnh/thành')
      }
      // Chuẩn hóa dữ liệu: ProvinceID -> code, ProvinceName -> name
      return response.data.data.map((p) => ({
        code: String(p.ProvinceID),
        name: p.ProvinceName,
      }))
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi tải tỉnh/thành')
    }
  },

  getDistricts: async (provinceId) => {
    try {
      const response = await AuthorizedAxiosInstance.post(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
        {
          province_id: parseInt(provinceId),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Token': GHN_TOKEN_API,
          },
        }
      )
      if (response.data.code !== 200 || !response.data.data) {
        throw new Error('Không có dữ liệu quận/huyện')
      }
      // Chuẩn hóa dữ liệu: DistrictID -> code, DistrictName -> name
      return response.data.data.map((d) => ({
        code: String(d.DistrictID),
        name: d.DistrictName,
      }))
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi tải quận/huyện')
    }
  },

  getWards: async (districtId) => {
    try {
      const response = await AuthorizedAxiosInstance.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Token': GHN_TOKEN_API,
          },
        }
      )
      if (response.data.code !== 200 || !response.data.data) {
        throw new Error('Không có dữ liệu phường/xã')
      }
      // Chuẩn hóa dữ liệu: WardCode -> code, WardName -> name
      return response.data.data.map((w) => ({
        code: String(w.WardCode),
        name: w.WardName,
      }))
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi tải phường/xã')
    }
  },
}  