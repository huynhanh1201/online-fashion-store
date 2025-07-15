const crypto = require('crypto')
const querystring = require('qs')

/**
 * Xác thực checksum từ VNPAY (phiên bản 2.1.0, HMACSHA512)
 * @param {object} params – object chứa toàn bộ params từ VNPAY (bao gồm vnp_SecureHash)
 * @returns {boolean} – true nếu checksum khớp, false ngược lại
 */
export function verifyChecksum(params) {
  const secretKey = process.env.VNP_HASHSECRET.trim() // Lấy secret key
  const secureHash = params['vnp_SecureHash'] // Lấy chữ ký VNPAY

  if (!secureHash) {
    console.error('Missing vnp_SecureHash')
    return false
  }

  // -----------------------------------
  // 1. Chuẩn bị object để sort & encode
  // -----------------------------------
  // Clone params (để không mutate gốc) và loại bỏ các key không cần thiết
  const data = { ...params }
  delete data['vnp_SecureHash']
  delete data['vnp_SecureHashType'] // Phiên bản 2.1.0 bỏ

  // Hàm encode key, value giống bên tạo URL
  function sortObject(obj) {
    const sorted = {}
    const keys = Object.keys(obj)
      .map((k) => encodeURIComponent(k))
      .sort()
    for (const key of keys) {
      const originalKey = Object.keys(obj).find(
        (k) => encodeURIComponent(k) === key
      )
      // encode value rồi thay space thành '+'
      const value = encodeURIComponent(obj[originalKey]).replace(/%20/g, '+')
      sorted[key] = value
    }
    return sorted
  }

  // Sort & encode
  const sortedParams = sortObject(data)

  // -----------------------------------
  // 2. Tạo chuỗi ký (signData)
  // -----------------------------------
  // stringify với encode: false (param đã được encode ở trên)
  const signData = querystring.stringify(sortedParams, { encode: false })

  // -----------------------------------
  // 3. Tính HMACSHA512
  // -----------------------------------
  const computedHash = crypto
    .createHmac('sha512', secretKey)
    .update(signData, 'utf-8')
    .digest('hex')

  // -----------------------------------
  // 4. So sánh
  // -----------------------------------
  // (có thể thay bằng timingSafeEqual nếu cần bảo mật cao)
  const isMatch = computedHash === secureHash

  return isMatch
}

// Hàm sắp xếp và mã hóa tham số cho tạo URL
export function sortObject(obj) {
  const sorted = {}
  const keys = Object.keys(obj)
    .map((k) => encodeURIComponent(k))
    .sort()
  for (const key of keys) {
    const originalKey = Object.keys(obj).find(
      (k) => encodeURIComponent(k) === key
    )
    const value = encodeURIComponent(obj[originalKey]).replace(/%20/g, '+')
    sorted[key] = value
  }
  return sorted
}
