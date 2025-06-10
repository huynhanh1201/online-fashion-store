// src/services/addressGHNService.js
import AuthorizedAxiosInstance from '~/utils/authorizedAxios';
import { GHN_TOKEN_API } from '~/utils/constants';

const addressGHNService = {
  // Fetch provinces
  async getProvinces() {
    try {
      const response = await fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Token': GHN_TOKEN_API,
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi tải tỉnh/thành: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.code !== 200 || !data.data) {
        throw new Error('Không có dữ liệu tỉnh/thành');
      }

      return data.data.map((p) => ({
        code: String(p.ProvinceID),
        name: p.ProvinceName,
      }));
    } catch (error) {
      throw new Error(`Không thể tải dữ liệu tỉnh/thành: ${error.message}`);
    }
  },

  // Fetch districts by province ID
  async getDistricts(provinceId) {
    if (!provinceId) return [];

    try {
      const response = await fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Token': GHN_TOKEN_API,
        },
        body: JSON.stringify({ province_id: parseInt(provinceId) }),
      });

      if (!response.ok) {
        throw new Error(`Lỗi tải quận/huyện: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.code !== 200 || !data.data) {
        throw new Error('Không có dữ liệu quận/huyện');
      }

      return data.data.map((d) => ({
        code: String(d.DistrictID),
        name: d.DistrictName,
      }));
    } catch (error) {
      throw new Error(`Không thể tải dữ liệu quận/huyện: ${error.message}`);
    }
  },

  // Fetch wards by district ID
  async getWards(districtId) {
    if (!districtId) return [];

    try {
      const response = await fetch(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Token': GHN_TOKEN_API,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Lỗi tải phường/xã: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.code !== 200 || !data.data) {
        throw new Error('Không có dữ liệu phường/xã');
      }

      return data.data.map((w) => ({
        code: String(w.WardCode),
        name: w.WardName,
      }));
    } catch (error) {
      throw new Error(`Không thể tải dữ liệu phường/xã: ${error.message}`);
    }
  },
};

export default addressGHNService;