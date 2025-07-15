import { StatusCodes } from 'http-status-codes'
import ms from 'ms'

import { authService } from '~/services/authService'
import ApiError from '~/utils/ApiError'

const register = async (req, res, next) => {
  try {
    // Điều hướng dữ liệu sang tầng Service
    const register = await authService.register(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(register)
  } catch (err) {
    next(err)
  }
}

const verify = async (req, res, next) => {
  try {
    // Điều hướng dữ liệu sang tầng Service
    const verify = await authService.verify(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(verify)
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    // Điều hướng dữ liệu sang tầng Service
    const result = await authService.login(req.body)

    /**
     * Xử lý trả về http only cookie phía trình duyệt
     * Về cái maxAge - thời gian sống của Cookie thì chúng ta sẽ để tối da 14 ngày, tùy dự án. Lưu ý
     * thời gian sống của cookie khác với thời gian sống của token nhé. Đừng bị nhầm lẫn :D
     */
    // Tạo cookie cho access token
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    // Tạo cookie cho refresh token
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const logout = async (req, res, next) => {
  try {
    //   Xóa cookie - đơn giản là làm ngược lại so với việc gán cookie ở hàm login
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ loggedOut: true })
  } catch (err) {
    next(err)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const result = await authService.refreshToken(req.cookies?.refreshToken)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(
      new ApiError(
        StatusCodes.FORBIDDEN,
        'Vui lòng đăng nhập! (Error: from refresh Token)'
      )
    )
  }
}

export const authController = {
  register,
  verify,
  login,
  logout,
  refreshToken
}
