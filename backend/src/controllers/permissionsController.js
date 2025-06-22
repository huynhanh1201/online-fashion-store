import { StatusCodes } from 'http-status-codes'

import { permissionsService } from '~/services/permissionsService'

const createPermission = async (req, res, next) => {
  try {
    const result = await permissionsService.createPermission(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getPermissionList = async (req, res, next) => {
  try {
    const queryString = req.query

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await permissionsService.getPermissionList(queryString)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getPermission = async (req, res, next) => {
  try {
    const permissionId = req.params.permissionId

    const result = await permissionsService.getPermission(permissionId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updatePermission = async (req, res, next) => {
  try {
    const permissionId = req.params.permissionId

    const result = await permissionsService.updatePermission(
      permissionId,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deletePermission = async (req, res, next) => {
  try {
    const permissionId = req.params.permissionId

    const result = await permissionsService.deletePermission(permissionId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const permissionsController = {
  createPermission,
  getPermissionList,
  getPermission,
  updatePermission,
  deletePermission
}
