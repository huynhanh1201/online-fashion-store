import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import * as cookie from 'cookie'
import apiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const socketAuthMiddleware = async (socket, next) => {
  try {
    // Parse cookie từ request header
    const cookies = cookie.parse(socket.request.headers.cookie || '')

    const accessToken = cookies.accessToken

    if (!accessToken) {
      throw new apiError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized: Không tìm thấy token trong cookie'
      )
    }

    const jwtDecoded = await JwtProvider.verifyToken(
      accessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )

    // Gắn user vào socket để dùng ở các socket event
    socket.user = jwtDecoded

    next()
  } catch (error) {
    return next(error) // Đưa lỗi xuống cho Client
  }
}

export default socketAuthMiddleware
