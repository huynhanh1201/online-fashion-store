import JWT from 'jsonwebtoken'

/**
 * Function tạo mới một token - Cần 3 tham số đầu vào
 * @param userInfo: Những thông tin muốn đính kèm vào token
 * @param secretSignature: Chữ ký bí mật (dạng một chuỗi string ngẫu nhiên) trên docs thì để ten là privateKey tùy đều được
 * @param tokenLife: Thời gian sống của token
 * @returns {Promise<*>}
 */

// Tạo token JWT
const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    // Hàm sign() của thư viện Jwt - Thuật toán mặc định là HS256 nhé, cứ cho vào để code dễ nhìn
    return JWT.sign(userInfo, secretSignature, {
      algorithm: 'HS256',
      expiresIn: tokenLife
    })
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * Function kiểm tra một token có hợp lệ hay không
 * Hợp lệ ở đâu hiểu đơn giản là cái token được tạo ra có đúng với cái chữ ký bí mật secretSignature trong dự án hay không
 * @param token
 * @param secretSignature
 * @returns {Promise<*>}
 */
const verifyToken = async (token, secretSignature) => {
  try {
    return JWT.verify(token, secretSignature)
  } catch (err) {
    throw new Error(err)
  }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}
