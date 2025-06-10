// src/services/addressGHNService.js
import AuthorizedAxiosInstance from '~/utils/authorizedAxios';
import { GHN_TOKEN_API } from '~/utils/constants';

const addressGHNService = {
  // Helper function to handle API errors
  handleApiError(error, defaultMessage) {
    const message =
      error.response?.data?.message ||
      error.message ||
      defaultMessage ||
      'Lỗi không xác định';
    return new Error(message);
  },

  // Fetch provinces
  async getProvinces() {
    try {
      const response = await AuthorizedAxiosInstance.get(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
        {
          headers: {
            'Content-Type': 'application/json',
            'Token': GHN_TOKEN_API,
          },
        }
      );
      if (response.data.code !== 200 || !response.data.data) {
        throw new Error('Không có dữ liệu tỉnh/thành');
      }
      return response.data.data.map((p) => ({
        code: String(p.ProvinceID),
        name: p.ProvinceName,
      }));
    } catch (error) {
      throw this.handleApiError(error, 'Lỗi khi tải tỉnh/thành');
    }
  },

  // Fetch districts by province ID
  async getDistricts(provinceId) {
    try {
      const response = await AuthorizedAxiosInstance.post(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
        { province_id: parseInt(provinceId) },
        {
          headers: {
            'Content-Type': 'application/json',
            'Token': GHN_TOKEN_API,
          },
        }
      );
      if (response.data.code !== 200 || !response.data.data) {
        throw new Error('Không có dữ liệu quận/huyện');
      }
      return response.data.data.map((d) => ({
        code: String(d.DistrictID),
        name: d.DistrictName,
      }));
    } catch (error) {
      throw this.handleApiError(error, 'Lỗi khi tải quận/huyện');
    }
  },

  // Fetch wards by district ID
  async getWards(districtId) {
    try {
      const response = await AuthorizedAxiosInstance.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Token': GHN_TOKEN_API,
          },
        }
      );
      if (response.data.code !== 200 || !response.data.data) {
        throw new Error('Không có dữ liệu phường/xã');
      }
      return response.data.data.map((w) => ({
        code: String(w.WardCode),
        name: w.WardName,
      }));
    } catch (error) {
      throw this.handleApiError(error, 'Lỗi khi tải phường/xã');
    }
  },
};

export default addressGHNService;