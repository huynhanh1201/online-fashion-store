import { WebsiteConfigModel } from '~/models/WebsiteConfigModel'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'

const createWebsiteConfig = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newWebsiteConfig = {
      key: reqBody.key,
      title: reqBody.title,
      description: reqBody.description,
      content: reqBody.content,
      status: reqBody.status,

      destroy: false
    }

    const websiteConfigs = await WebsiteConfigModel.create(newWebsiteConfig)

    return websiteConfigs
  } catch (err) {
    throw err
  }
}

const getWebsiteConfigList = async (queryString) => {
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

  const [websiteConfigs, total] = await Promise.all([
    WebsiteConfigModel.find(filter)
      .collation({ locale: 'vi', strength: 1 })
      .sort(sortField)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    WebsiteConfigModel.countDocuments(filter)
  ])

  const result = {
    data: websiteConfigs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  return result
}

const getWebsiteConfig = async (websiteConfigId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await WebsiteConfigModel.findById(websiteConfigId).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateWebsiteConfig = async (websiteConfigId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedWebsiteConfig = await WebsiteConfigModel.findOneAndUpdate(
      { _id: websiteConfigId },
      reqBody,
      { new: true }
    )

    return updatedWebsiteConfig
  } catch (err) {
    throw err
  }
}

const deleteWebsiteConfig = async (websiteConfigId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const websiteConfigDeleted = await WebsiteConfigModel.findOneAndUpdate(
      { _id: websiteConfigId },
      { destroy: true },
      { new: true }
    )

    return websiteConfigDeleted
  } catch (err) {
    throw err
  }
}

export const websiteConfigsService = {
  createWebsiteConfig,
  getWebsiteConfigList,
  getWebsiteConfig,
  updateWebsiteConfig,
  deleteWebsiteConfig
}
