import { StatusCodes } from 'http-status-codes'

import { UserModel } from '~/models/UserModel'
import ApiError from '~/utils/ApiError'
import { pickUser } from '~/utils/formatters'
import { ROLE } from '~/utils/constants'
import { password } from '~/utils/password'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'
import { CategoryModel } from '~/models/CategoryModel'

const getUserList = async (queryString) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let {
      page = 1,
      limit = 10,
      search,
      sort,
      filterTypeDate,
      startDate,
      endDate,
      role,
      destroy
    } = queryString

    // Kiểm tra dữ liệu đầu vào của limit và page
    validatePagination(page, limit)

    // Xử lý thông tin Filter
    const filter = {
      role: { $ne: 'customer' }
    }

    if (role) filter.role = role

    if (destroy === 'true' || destroy === 'false') {
      destroy = JSON.parse(destroy)

      filter.destroy = destroy
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' }
    }

    const dateRange = getDateRange(filterTypeDate, startDate, endDate)

    if (dateRange.startDate && dateRange.endDate) {
      filter['createdAt'] = {
        $gte: new Date(dateRange.startDate),
        $lte: new Date(dateRange.endDate)
      }
    }

    const sortMap = {
      name_asc: { name: 1 },
      name_desc: { name: -1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 }
    }

    let sortField = {}

    if (sort) {
      sortField = sortMap[sort]
    }

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .collation({ locale: 'vi', strength: 1 })
        .sort(sortField)
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-password -verifyToken')
        .lean(),

      UserModel.countDocuments(filter)
    ])

    const result = {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }

    return result
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
    if (reqBody.password) {
      // Băm mật khẩu
      const hashedPassword = await password.hash(reqBody.password)

      reqBody.password = hashedPassword
    }

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

const restoreUser = async (userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        destroy: false
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

export const usersService = {
  getUserList,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  updatePasswordProfile,
  restoreUser
}
