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
      destroy: false,

      packageSize: reqBody.packageSize,

      status: reqBody.status
    }

    const product = await ProductModel.create(newProduct)

    const populatedProduct = await ProductModel.findById(product._id)
      .populate({
        path: 'categoryId',
        select: 'name'
      })
      .lean()

    return populatedProduct
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
      endDate,
      destroy
    } = reqQuery

    validatePagination(page, limit)

    // Xử lý filter
    const filter = {}

    if (destroy) filter.destroy = JSON.parse(destroy)

    if (destroy === 'true' || destroy === 'false') {
      destroy = JSON.parse(destroy)

      filter.destroy = destroy
    }

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

    // Use aggregation to include first variant's discount price
    const aggregationPipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'variants',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$productId', '$$productId'] },
                destroy: false
              }
            },
            { $sort: { createdAt: 1 } }, // Get first variant
            { $limit: 1 },
            { $project: { discountPrice: 1 } }
          ],
          as: 'firstVariant'
        }
      },
      {
        $addFields: {
          firstVariantDiscountPrice: {
            $ifNull: [{ $arrayElemAt: ['$firstVariant.discountPrice', 0] }, 0]
          }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categoryId'
        }
      },
      {
        $unwind: {
          path: '$categoryId',
          preserveNullAndEmptyArrays: true
        }
      }
    ]

    // Only add sort stage if sortField is not empty
    if (Object.keys(sortField).length > 0) {
      aggregationPipeline.push({ $sort: sortField })
    }

    // Convert page and limit to numbers
    const pageNum = Number(page)
    const limitNum = Number(limit)

    aggregationPipeline.push(
      { $skip: (pageNum - 1) * limitNum },
      { $limit: limitNum }
    )

    const [products, total] = await Promise.all([
      ProductModel.aggregate(aggregationPipeline),
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

    if (updatedProduct) {
      await VariantModel.findOneAndUpdate(
        { productId },
        { status: updatedProduct.status }
      )
    }

    return updatedProduct
  } catch (err) {
    throw err
  }
}

const deleteProduct = async (productId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Xóa mềm khi không còn Variant
    const productUpdated = await ProductModel.updateOne(
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
    const ListProduct = await ProductModel.aggregate([
      {
        $match: {
          categoryId: new mongoose.Types.ObjectId(categoryId),
          destroy: false
        }
      },
      {
        $lookup: {
          from: 'variants',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$productId', '$$productId'] },
                destroy: false
              }
            },
            { $sort: { createdAt: 1 } }, // Get first variant
            { $limit: 1 },
            { $project: { discountPrice: 1 } }
          ],
          as: 'firstVariant'
        }
      },
      {
        $addFields: {
          firstVariantDiscountPrice: {
            $ifNull: [{ $arrayElemAt: ['$firstVariant.discountPrice', 0] }, 0]
          }
        }
      }
    ])

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

const restoreProduct = async (productId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Xóa mềm khi không còn Variant
    const productUpdated = await ProductModel.updateOne(
      {
        _id: productId
      },
      {
        destroy: false
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

export const productsService = {
  createProduct,
  getProductList,
  getProduct,
  updateProduct,
  deleteProduct,
  getListProductOfCategory,
  getVariantOfProduct,
  restoreProduct
}
