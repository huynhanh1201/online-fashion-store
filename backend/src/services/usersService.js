import { StatusCodes } from 'http-status-codes'

import { UserModel } from '~/models/UserModel'
import ApiError from '~/utils/ApiError'
import { pickUser } from '~/utils/formatters'
import { ROLE } from '~/utils/constants'
import { password } from '~/utils/password'

const getUserList = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await UserModel.find({}).lean()
    const userList = []

    for (let i = 0; i < result.length; i++) {
      const user = pickUser(result[i])
      userList.push(user)
    }

    return userList
  } catch (err) {
    throw err
  }
}

const getUser = async (userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await UserModel.findById(userId)

    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không có dữ liệu người dùng.')
    }

    return pickUser(result)
  } catch (err) {
    throw err
  }
}

const updateUser = async (userId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: userId
      },
      reqBody,
      {
        new: true
      }
    )

    if (!updatedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'ID không tồn tại.')
    }

    // const role = reqBody.role
    // // if (!Object.values(ROLE).includes(role)) {
    // //   throw new ApiError(
    // //     StatusCodes.UNPROCESSABLE_ENTITY,
    // //     'Không đúng định dạng dữ liệu.'
    // //   )
    // // }
    //
    // // Cập nhật dữ liệu
    // user.role = role
    //
    // const updatedUser = await user.save()

    return pickUser(updatedUser)
  } catch (err) {
    throw err
  }
}

const deleteUser = async (userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await UserModel.updateOne(
      { _id: userId },
      {
        destroy: true
      }
    )

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Tài khoản không tồn tại.')
    }

    return user
  } catch (err) {
    throw err
  }
}

const getProfile = async (userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await UserModel.findById(userId).select(
      '_id name email avatarUrl createdAt updatedAt role'
    )

    return result
  } catch (err) {
    throw err
  }
}

const updateProfile = async (userId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await UserModel.findOneAndUpdate({ _id: userId }, reqBody, {
      new: true
    }).select('_id name email avatarUrl createdAt updatedAt')

    return result
  } catch (err) {
    throw err
  }
}

const updatePasswordProfile = async (userId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await UserModel.findById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không có dữ liệu người dùng.')
    }

    const validateOldPassword = await password.compare(
      reqBody.oldPassword,
      user.password
    )

    if (!validateOldPassword) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        'Mật khẩu cũ không đúng.'
      )
    }

    const newPasswordHash = await password.hash(reqBody.newPassword)

    user.password = newPasswordHash

    const result = await user.save()

    return result
  } catch (err) {
    throw err
  }
}

export const usersService = {
  getUserList,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  updatePasswordProfile
}
