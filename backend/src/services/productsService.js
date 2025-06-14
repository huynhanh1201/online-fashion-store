import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'

import { ProductModel } from '~/models/ProductModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import generateSequentialCode from '~/utils/generateSequentialCode'
import { VariantModel } from '~/models/VariantModel'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'

const createProduct = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Tạo lấy ký tự để tạo Prefix cho productCode
    const prefix =
      slugify(reqBody.name, { lower: true }) // bỏ dấu, gạch ngang
        .trim()
        .split('-')
        .map((item) => item.charAt(0).toUpperCase())
        .join('') + '-'

    // Tạo productCode
    const productCodeValue = await generateSequentialCode(
      prefix,
      4,
      async (prefix) => {
        // Query mã lớn nhất đã có với prefix đó
        const regex = new RegExp(`^${prefix}(\\d+)$`)
        const latest = await ProductModel.findOne({
          productCode: { $regex: regex }
        })
          .sort({ productCode: -1 }) // sort giảm dần, AV10 > AV09
          .lean()

        // Tính số thứ tự tiếp theo
        let nextNumber = 1
        if (latest) {
          const match = latest.productCode.match(regex)
          if (match && match[1]) {
            nextNumber = parseInt(match[1], 10) + 1 // ví dụ AV10 → match[1] = "10" → +1 = 11
          }
        }

        return nextNumber
      }
    )

    const newProduct = {
      name: reqBody.name,
      description: reqBody.description,
      image: reqBody.image,
      categoryId: reqBody.categoryId,
      importPrice: reqBody.importPrice,
      exportPrice: reqBody.exportPrice,

      productCode: productCodeValue,
      slug: slugify(reqBody.name),
      quantity: 0,
      destroy: false
    }

    const product = await ProductModel.create(newProduct)

    return product
  } catch (err) {
    throw err
  }
}

const getProductList = async (reqQuery) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let {
      page = 1,
      limit = 10,
      search,
      categoryId,
      priceMin,
      priceMax,
      sort,
      status,
      filterTypeDate,
      startDate,
      endDate
    } = reqQuery

    validatePagination(page, limit)

    // Xử lý filter
    const filter = {}

    if (status === 'true' || status === 'false') {
      status = JSON.parse(status)

      filter.destroy = status
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' }
    }

    const priceMinNumber = Number(priceMin)
    const priceMaxNumber = Number(priceMax)

    if (!isNaN(priceMinNumber))
      filter.exportPrice = {
        ...(filter.exportPrice || {}),
        $gte: priceMinNumber
      }

    if (!isNaN(priceMaxNumber))
      filter.exportPrice = {
        ...(filter.exportPrice || {}),
        $lte: priceMaxNumber
      }

    if (search) filter.name = { $regex: search, $options: 'i' }

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId))
      filter.categoryId = categoryId

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

    const [products, total] = await Promise.all([
      ProductModel.find(filter)
        .collation({ locale: 'vi', strength: 1 })
        .sort(sortField)
        .populate({
          path: 'categoryId',
          select: 'name description slug _id'
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ProductModel.countDocuments(filter)
    ])

    const result = {
      data: products,
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

const getProduct = async (productId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await ProductModel.findById({
      _id: productId,
      destroy: false
    })
      .populate({
        path: 'categoryId',
        select: 'name description slug _id'
      })
      .lean()

    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tồn tại ID này.')
    }

    return result
  } catch (err) {
    throw err
  }
}

const updateProduct = async (productId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: productId, destroy: false },
      reqBody,
      {
        new: true,
        runValidators: true
      }
    )

    return updatedProduct
  } catch (err) {
    throw err
  }
}

const deleteProduct = async (productId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const isVariantExists = await VariantModel.exists({
      productId,
      destroy: false
    })

    if (isVariantExists) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Không thể xóa SẢN PHẨM khi vẫn còn BIẾN THỂ hoạt động.'
      )
    }

    // Xóa mềm khi không còn Variant
    const productUpdated = await ProductModel.findOneAndUpdate(
      {
        _id: productId
      },
      {
        destroy: true
      },
      { new: true }
    )

    if (!productUpdated) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại.')
    }

    return productUpdated
  } catch (err) {
    throw err
  }
}

const getListProductOfCategory = async (categoryId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const ListProduct = await ProductModel.find({
      categoryId: categoryId,
      destroy: false
    }).lean()

    return ListProduct
  } catch (err) {
    throw err
  }
}

const getVariantOfProduct = async (productId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const variants = await VariantModel.find({
      productId: productId,
      destroy: false
    }).lean()

    return variants
  } catch (err) {
    throw err
  }
}

export const productsService = {
  createProduct,
  getProductList,
  getProduct,
  updateProduct,
  deleteProduct,
  getListProductOfCategory,
  getVariantOfProduct
}
