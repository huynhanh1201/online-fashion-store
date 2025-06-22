import { StatusCodes } from 'http-status-codes'

import { rolesService } from '~/services/rolesService'

const createRole = async (req, res, next) => {
  try {
    const result = await rolesService.createRole(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getRoleList = async (req, res, next) => {
  try {
    const queryString = req.query

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await rolesService.getRoleList(queryString)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getRole = async (req, res, next) => {
  try {
    const roleId = req.params.roleId

    const result = await rolesService.getRole(roleId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateRole = async (req, res, next) => {
  try {
    const roleId = req.params.roleId

    const result = await rolesService.updateRole(roleId, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteRole = async (req, res, next) => {
  try {
    const roleId = req.params.roleId

    const result = await rolesService.deleteRole(roleId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const rolesController = {
  createRole,
  getRoleList,
  getRole,
  updateRole,
  deleteRole
}
