import { WarehouseModel } from '~/models/WarehouseModel'
import generateSequentialCode from '~/utils/generateSequentialCode'
import { InventoryModel } from '~/models/InventoryModel'
import { WarehouseSlipModel } from '~/models/WarehouseSlipsModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'

const createWarehouse = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const prefixCodeWarehouse = 'WH-'

    const codeWarehouse = await generateSequentialCode(
      prefixCodeWarehouse,
      4,
      async (prefixCodeWarehouse) => {
        // Query mã lớn nhất đã có với prefixCodeWarehouse đó
        const regex = new RegExp(`^${prefixCodeWarehouse}(\\d{4})$`)
        const latest = await WarehouseModel.findOne({
          code: { $regex: regex }
        })
          .sort({ code: -1 }) // sort giảm dần, AV10 > AV09
          .lean()

        // Tính số thứ tự tiếp theo
        let nextNumber = 1
        if (latest) {
          const match = latest.code.match(regex)
          if (match && match[1]) {
            nextNumber = parseInt(match[1], 10) + 1 // ví dụ AV10 → match[1] = "10" → +1 = 11
          }
        }

        return nextNumber
      }
    )

    const newWarehouse = {
      code: codeWarehouse,
      name: reqBody.name,
      address: reqBody.address,
      ward: reqBody.ward,
      district: reqBody.district,
      city: reqBody.city,

      destroy: false,

      wardId: reqBody.wardId,
      districtId: reqBody.districtId,
      cityId: reqBody.cityId
    }

    const warehouses = await WarehouseModel.create(newWarehouse)

    return warehouses
  } catch (err) {
    throw err
  }
}

const getWarehouseList = async (queryString) => {
  let {
    page = 1,
    limit = 10,
    search,
    status,
    sort,
    filterTypeDate,
    startDate,
    endDate,
    city,
    district,
    ward
  } = queryString

  // Kiểm tra dữ liệu đầu vào của limit và page
  validatePagination(page, limit)

  // Xử lý thông tin Filter
  const filter = {}

  if (city) filter.city = city

  if (district) filter.district = district

  if (ward) filter.ward = ward

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

  let sortField = {}

  const sortMap = {
    name_asc: { name: 1 },
    name_desc: { name: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 }
  }

  if (sort) {
    sortField = sortMap[sort]
  }

  const [warehouses, total] = await Promise.all([
    WarehouseModel.find(filter)
      .collation({ locale: 'vi', strength: 1 })
      .sort(sortField)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    WarehouseModel.countDocuments(filter)
  ])

  const result = {
    data: warehouses,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  return result
}

const getWarehouse = async (warehouseId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await WarehouseModel.findById(warehouseId).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateWarehouse = async (warehouseId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedWarehouse = await WarehouseModel.findOneAndUpdate(
      { _id: warehouseId },
      reqBody,
      { new: true }
    )

    return updatedWarehouse
  } catch (err) {
    throw err
  }
}

const deleteWarehouse = async (warehouseId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const warehouseDeleted = await WarehouseModel.updateOne(
      { _id: warehouseId },
      { destroy: true },
      { new: true }
    )

    if (!warehouseDeleted) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Kho hàng không tồn tại.')
    }

    return warehouseDeleted
  } catch (err) {
    throw err
  }
}

export const warehousesService = {
  createWarehouse,
  getWarehouseList,
  getWarehouse,
  updateWarehouse,
  deleteWarehouse
}
