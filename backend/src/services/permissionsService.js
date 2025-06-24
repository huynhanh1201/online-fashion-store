import { PermissionModel } from '~/models/PermissionModel'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'
import { permissionsHelpers } from '~/helpers/permissionsHelpers'

const createPermission = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newPermission = {
      key: reqBody.key,
      label: reqBody.label,
      group: reqBody.group,

      destroy: false
    }

    const permissions = await PermissionModel.create(newPermission)

    return permissions
  } catch (err) {
    throw err
  }
}

const getPermissionList = async (queryString) => {
  let {
    page = 1,
    limit = 10,
    search,
    status,
    sort,
    filterTypeDate,
    startDate,
    endDate
  } = queryString

  // Kiểm tra dữ liệu đầu vào của limit và page
  validatePagination(page, limit)

  // Xử lý thông tin Filter
  const filter = {}

  if (status === 'true' || status === 'false') {
    status = JSON.parse(status)

    filter.destroy = status
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

  const [permissions, total] = await Promise.all([
    PermissionModel.find(filter)
      .collation({ locale: 'vi', strength: 1 })
      .sort(sortField)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    PermissionModel.countDocuments(filter)
  ])

  // Xử lý data permissions
  const dataHandled = permissionsHelpers.groupPermissions(permissions)

  const result = {
    data: dataHandled,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  return result
}

const getPermission = async (permissionId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await PermissionModel.findById(permissionId).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updatePermission = async (permissionId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedPermission = await PermissionModel.findOneAndUpdate(
      { _id: permissionId },
      reqBody,
      { new: true }
    )

    return updatedPermission
  } catch (err) {
    throw err
  }
}

const deletePermission = async (permissionId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const permissionDeleted = await PermissionModel.findOneAndUpdate(
      { _id: permissionId },
      { destroy: true },
      { new: true }
    )

    return permissionDeleted
  } catch (err) {
    throw err
  }
}

export const permissionsService = {
  createPermission,
  getPermissionList,
  getPermission,
  updatePermission,
  deletePermission
}
