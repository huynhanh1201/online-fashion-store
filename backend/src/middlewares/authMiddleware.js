import { StatusCodes } from 'http-status-codes'

import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

//Middleware này sẽ đảm nhiệm việc quan trọng: Xác thực cái JWT accessToken nhận được từ phía FE có hợp lệ hay không
const isAuthorized = async (req, res, next) => {
  //   Lấy accessToken nằm trong request cookies phía client - withCredentials trong file authorizeAxios
  const clientAccessToken = req.cookies?.accessToken

  //   Nếu như cái clientAccessToken không tồn tại thì trả về lỗi luôn
  if (!clientAccessToken) {
    next(
      new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Unathorized! (Không tìm thấy Token)'
      )
    )
    return
  }

  try {
    //   Bước 1: Thực hiện giải mã token xem nó có hợp lệ hay không
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )

    //   Bước 2: Quan trọng: Nếu như cái token hợp lệ, thì sẽ cần phải lưu thông tin giãi mã được vào cái req.jwtDecoded, để sử dụng cho các tầng cần xử lý ở phía sau
    req.jwtDecoded = accessTokenDecoded
    //   Bước 3: Cho phép cái request đi tiếp
    next()
  } catch (err) {
    //   Nếu cái accessToken nó bị hết hạn (expired) thì mình cần trả về một cái mã lỗi GONE - 410 cho phía FE biết để gọi API refreshToken
    if (err?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Cần phải refresh token.'))

      return
    }
    //   Nếu như cái accessToken nó không hợp lệ do bất kỳ điều gì khác vụ hết hạn thì chúng ta cứ thẳng tay trả về mã 401 cho phía FE gọi API sign_out luôn

    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unathorized!'))
  }
}

export const authMiddleware = {
  isAuthorized
}
