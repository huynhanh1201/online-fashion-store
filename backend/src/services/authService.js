import { StatusCodes } from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'

import { slugify } from '~/utils/formatters'
import { UserModel } from '~/models/UserModel'
import { password } from '~/utils/password'
import ApiError from '~/utils/ApiError'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { RoleModel } from '~/models/RoleModel'

const register = async (reqBody) => {
  let { name, email, password: rawPassword, avatarUrl, role, roleId } = reqBody

  // Chuẩn hóa email và tên
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedName = name.trim()

  // Kiểm tra email đã tồn tại
  const exists = await UserModel.exists({ email: normalizedEmail })
  if (exists) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email đã tồn tại!')
  }

  // Băm mật khẩu
  const hashedPassword = await password.hash(rawPassword)

  if (!roleId) {
    const getRole = await RoleModel.findOne({ name: 'customer' })
    roleId = getRole._id
  }

  // Tạo user mới
  const newUser = {
    name: normalizedName,
    email: normalizedEmail,
    password: hashedPassword,
    avatarUrl,
    role: role || 'customer',
    roleId: roleId,
    slug: slugify(normalizedName, { lower: true }),
    destroy: false,
    verifyToken: uuidv4()
  }

  // Lưu user vào DB
  const user = await UserModel.create(newUser)

  // Gửi email xác thực
  const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${normalizedEmail}&token=${newUser.verifyToken}`
  const subject = 'Online Shop Store: Vui lòng xác thực tài khoản của bạn.'
  const htmlContent = `
  <h3>Đây là liên kết xác thực tài khoản của bạn. Vui lòng click vào liên kiết bên dưới:</h3>
  <a href="${verificationLink}">${verificationLink}</a>
  <p>Trân trọng,<br/>- Online Shop Store -</p>
`

  if (role) {
    return pickUser(user)
  }

  await BrevoProvider.sendEmail(
    normalizedName,
    normalizedEmail,
    subject,
    htmlContent
  )

  return pickUser(user)
}

const verify = async (reqBody) => {
  try {
    // Kiểm tra user đã tồn tại?
    const existsUser = await UserModel.findOne({ email: reqBody.email })

    // Các bước kiểm tra cần thiết
    if (!existsUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Tài khoản không tồn tại!')
    }

    if (existsUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Tài khoản của bạn đã xác thực!'
      )
    }

    if (reqBody.token !== existsUser.verifyToken) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token không hợp lệ!')
    }

    // Nếu như mọi thứ OK thì chúng ta bắt đầu update lại thông tin của thằng user để verify account
    // Cập nhật dữ liệu user
    existsUser.isActive = true
    existsUser.verifyToken = null

    // Lưu dữ liệu thay đổi
    const updatedUser = await existsUser.save()
    return pickUser(updatedUser)
  } catch (err) {
    new ApiError(
      StatusCodes.UNAUTHORIZED,
      'Xác thực tài khoản không thành công!'
    )
  }
}

const login = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Kiểm tra user đã tồn tại?
    const existsUser = await UserModel.findOne({ email: reqBody.email })

    // Các bước kiểm tra cần thiết
    if (!existsUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Tài khoản không tồn tại!')
    }

    if (!existsUser.isActive && existsUser.role === 'customer') {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Tài khoản của bạn chưa xác thực!'
      )
    }

    // Kiểm tra mật khẩu bằng cách so sánh mật khẩu đã băm
    const isMatch = await password.compare(
      reqBody.password,
      existsUser.password
    )

    if (!isMatch) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Email hoặc Mật khẩu của bạn không chính xác!'
      )
    }

    //   Nếu mọi thứ ok thì bắt đầu tạo Tokens đăng nhập để trả về cho phía FE
    //  Tạo thông tin để dính kèm trong JWT Token bao gồm _id và email của user
    const userInfo = {
      _id: existsUser._id,
      email: existsUser.email,
      name: existsUser.name,
      role: existsUser.role
    }

    //   Tạo ra 2 loại token: accessToken và refreshToken trả về cho phía FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )

    //   Trả về thông itn của user kèm theo 2 cái token vừa tạo ra
    return { accessToken, refreshToken, ...pickUser(existsUser) }
  } catch (err) {
    throw err
  }
}

const refreshToken = async (clientRefreshToken) => {
  // eslint-disable-next-line no-useless-catch
  try {
    //   Verify / giải mã cái refresh token xem có hợp lệ không
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    //   Đoạn này vì chúng ta chỉ lưu những thông tin unique và cố định của user trong token rồi, vì vậy có thể lấy luôn từ decoded ra, tiết kiệm query vào DB để lấy data mới.
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email,
      name: refreshTokenDecoded.name,
      role: refreshTokenDecoded.role
    }

    //   Tạo accessToken mới
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    return { accessToken }
  } catch (err) {
    throw err
  }
}

export const authService = {
  register,
  verify,
  login,
  refreshToken
}
