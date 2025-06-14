import { PartnerModel } from '~/models/PartnerModel'
import generateSequentialCode from '~/utils/generateSequentialCode'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'
import { SizeModel } from '~/models/SizeModel'

const createPartner = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Tạo Code PartnerManagement
    const prefixPartnerId = 'NCC-'

    const partnerCode = await generateSequentialCode(
      prefixPartnerId,
      4,
      async (prefixPartnerId) => {
        // Query mã lớn nhất đã có với prefixPartnerId đó
        const regex = new RegExp(`^${prefixPartnerId}(\\d{4})$`)
        const latest = await PartnerModel.findOne({
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

    const newPartner = {
      code: partnerCode,
      name: reqBody.name,
      type: reqBody.type,
      contact: {
        phone: reqBody.contact?.phone,
        email: reqBody.contact?.email,
        website: reqBody.contact?.website || null
      },
      taxCode: reqBody.taxCode || null,
      address: {
        street: reqBody.address?.street || null,
        ward: reqBody.address?.ward || null,
        district: reqBody.address?.district || null,
        city: reqBody.address?.city || null
      },

      bankInfo: {
        bankName: reqBody.bankInfo?.bankName || null,
        accountNumber: reqBody.bankInfo?.accountNumber || null,
        accountHolder: reqBody.bankInfo?.accountHolder || null
      },
      note: reqBody.note || null,
      destroy: false
    }

    const partnerCreated = await PartnerModel.create(newPartner)

    return partnerCreated
  } catch (err) {
    throw err
  }
}

const getPartnerList = async (queryString) => {
  let {
    page = 1,
    limit = 10,
    search,
    status,
    sort,
    filterTypeDate,
    startDate,
    endDate,
    type
  } = queryString

  // Kiểm tra dữ liệu đầu vào của limit và page
  validatePagination(page, limit)

  // Xử lý thông tin Filter
  const filter = {}

  if (type) {
    filter.type = type
  }

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

  const [partners, total] = await Promise.all([
    PartnerModel.find(filter)
      .collation({ locale: 'vi', strength: 1 })
      .sort(sortField)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    PartnerModel.countDocuments(filter)
  ])

  const result = {
    data: partners,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  return result
}

const getPartner = async (partnerId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await PartnerModel.findById(partnerId).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updatePartner = async (partnerId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedPartner = await PartnerModel.findOneAndUpdate(
      { _id: partnerId },
      reqBody,
      { new: true }
    )

    return updatedPartner
  } catch (err) {
    throw err
  }
}

const deletePartner = async (partnerId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const partnerDeleted = await PartnerModel.findOneAndUpdate(
      { _id: partnerId },
      { destroy: true },
      { new: true }
    )

    return partnerDeleted
  } catch (err) {
    throw err
  }
}

export const partnersService = {
  createPartner,
  getPartnerList,
  getPartner,
  updatePartner,
  deletePartner
}
