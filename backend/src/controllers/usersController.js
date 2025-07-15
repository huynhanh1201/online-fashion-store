import { StatusCodes } from 'http-status-codes'

import { usersService } from '~/services/usersService'

const getUserList = async (req, res, next) => {
  try {
    const queryString = req.query

    // Lấy danh sách user từ tầng Service chuyển qua
    const result = await usersService.getUserList(queryString)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId

    const result = await usersService.getUser(userId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.userId

    const result = await usersService.updateUser(userId, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId

    const result = await usersService.deleteUser(userId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getProfile = async (req, res, next) => {
  try {
    const result = await usersService.getProfile(req.jwtDecoded._id)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const result = await usersService.updateProfile(
      req.jwtDecoded._id,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updatePasswordProfile = async (req, res, next) => {
  try {
    const result = await usersService.updatePasswordProfile(
      req.jwtDecoded._id,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const restoreUser = async (req, res, next) => {
  try {
    const userId = req.params.userId

    const result = await usersService.restoreUser(userId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const usersController = {
  getUserList,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  updatePasswordProfile,
  restoreUser
}
