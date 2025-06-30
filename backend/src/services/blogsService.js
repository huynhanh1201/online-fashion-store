import { BlogModel } from '~/models/BlogModel'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'
import { slugify } from '~/utils/formatters'
import { UserModel } from '~/models/UserModel'

const createBlog = async (reqBody, jwtDecoded) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await UserModel.findById(jwtDecoded._id)

    console.log(user)

    const newBlog = {
      title: reqBody.title,
      excerpt: reqBody.excerpt,
      content: reqBody.content,
      coverImage: reqBody.coverImage,
      images: reqBody.images,
      tags: reqBody.tags,
      category: reqBody.category,
      type: reqBody.type,
      brand: reqBody.brand,
      status: reqBody.status,
      meta: reqBody.meta,

      slug: slugify(reqBody.title),
      author: {
        id: user._id,
        name: user.name,
        avatar: user.avatarUrl
      },

      destroy: false
    }

    const blogs = await BlogModel.create(newBlog)

    return blogs
  } catch (err) {
    throw err
  }
}

const getBlogList = async (queryString) => {
  let {
    page = 1,
    limit = 10,
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

  if (destroy) filter.destroy = destroy

  if (status) filter.status = status

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

  const [blogs, total] = await Promise.all([
    BlogModel.find(filter)
      .collation({ locale: 'vi', strength: 1 })
      .sort(sortField)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    BlogModel.countDocuments(filter)
  ])

  const result = {
    data: blogs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  return result
}

const getBlog = async (blogId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await BlogModel.findById(blogId).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateBlog = async (blogId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedBlog = await BlogModel.findOneAndUpdate(
      { _id: blogId },
      reqBody,
      { new: true }
    )

    return updatedBlog
  } catch (err) {
    throw err
  }
}

const deleteBlog = async (blogId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const blogDeleted = await BlogModel.findOneAndUpdate(
      { _id: blogId },
      { destroy: true },
      { new: true }
    )

    return blogDeleted
  } catch (err) {
    throw err
  }
}

export const blogsService = {
  createBlog,
  getBlogList,
  getBlog,
  updateBlog,
  deleteBlog
}
