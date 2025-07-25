import { RoleModel } from '~/models/RoleModel'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'

const createRole = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newRole = {
      name: reqBody.name,
      label: reqBody.label,
      permissions: reqBody.permissions,

      destroy: false
    }

    const roles = await RoleModel.create(newRole)

    return roles
  } catch (err) {
    throw err
  }
}

const getRoleList = async (queryString) => {
  let {
    page = 1,
    limit = 10,
    roleName,
    search,
    status,
    sort,
    filterTypeDate,
    startDate,
    endDate,
    destroy
  } = queryString

  // Kiểm tra dữ liệu đầu vào của limit và page
  validatePagination(page, limit)

  // Xử lý thông tin Filter
  const filter = {}

  if (destroy === 'true' || destroy === 'false') {
    destroy = JSON.parse(destroy)

    filter.destroy = destroy
  }

  if (roleName) {
    filter.name = roleName
  }

  if (status === 'true' || status === 'false') {
    status = JSON.parse(status)

    filter.destroy = status
  }

  if (search) {
    filter.label = { $regex: search, $options: 'i' }
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

  const [roles, total] = await Promise.all([
    RoleModel.find(filter)
      .collation({ locale: 'vi', strength: 1 })
      .sort(sortField)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    RoleModel.countDocuments(filter)
  ])

  const result = {
    data: roles,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  return result
}

const getRole = async (roleId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await RoleModel.findById(roleId).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateRole = async (roleId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedRole = await RoleModel.findOneAndUpdate(
      { _id: roleId },
      reqBody,
      { new: true }
    )

    return updatedRole
  } catch (err) {
    throw err
  }
}

const deleteRole = async (roleId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const roleDeleted = await RoleModel.updateOne(
      { _id: roleId },
      { destroy: true },
      { new: true }
    )

    return roleDeleted
  } catch (err) {
    throw err
  }
}

const restoreRole = async (roleId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const roleDeleted = await RoleModel.findOneAndUpdate(
      { _id: roleId },
      { destroy: false },
      { new: true }
    )

    return roleDeleted
  } catch (err) {
    throw err
  }
}

export const rolesService = {
  createRole,
  getRoleList,
  getRole,
  updateRole,
  deleteRole,
  restoreRole
}
