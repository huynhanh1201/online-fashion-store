import { StatusCodes } from 'http-status-codes'

import ApiError from '~/utils/ApiError'
import { VariantModel } from '~/models/VariantModel'
import { ProductModel } from '~/models/ProductModel'
import generateSKU from '~/utils/generateSKU'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'

const createVariant = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await ProductModel.findById(reqBody.productId)

    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại')
    }

    // Kiểm tra xem SKU đã tồn tại chưa
    const newSku = generateSKU(
      product.productCode,
      reqBody.color.name,
      reqBody.size.name
    )
    const existsVariant = await VariantModel.exists({ sku: newSku })
    if (existsVariant) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Màu sắc và kích thước này đã tồn tại cho sản phẩm này'
      )
    }

    const newVariant = {
      productId: reqBody.productId,
      color: {
        name: reqBody.color.name,
        image: reqBody.color.image
      },
      size: {
        name: reqBody.size.name
      },
      importPrice: reqBody.overridePrice
        ? reqBody.importPrice
        : product.importPrice,
      exportPrice: reqBody.overridePrice
        ? reqBody.exportPrice
        : product.exportPrice,
      overridePrice: reqBody.overridePrice,

      productCode: product.productCode,
      sku: newSku,
      name: `${product.name}`,
      destroy: false,

      packageSize: product.overridePackageSize
        ? product.packageSize
        : reqBody.packageSize,

      status: reqBody.status,

      discountPrice: reqBody.discountPrice || 0
    }

    const variants = await VariantModel.create(newVariant)

    return variants
  } catch (err) {
    throw err
  }
}

const getVariantList = async (queryString) => {
  let {
    page = 1,
    limit = 10,
    search,
    status,
    sort,
    filterTypeDate,
    startDate,
    endDate,
    productId,
    colorName,
    sizeName,
    destroy
  } = queryString

  // Kiểm tra dữ liệu đầu vào của limit và page
  validatePagination(page, limit)

  // Xử lý thông tin Filter
  const filter = {}

  if (destroy) filter.destroy = destroy

  if (productId) filter.productId = productId

  if (colorName) filter['color.name'] = colorName.toLowerCase()

  if (sizeName) filter['size.name'] = sizeName.toLowerCase()

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

  const [variants, total] = await Promise.all([
    VariantModel.find(filter)
      .collation({ locale: 'vi', strength: 1 })
      .sort(sortField)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    VariantModel.countDocuments(filter)
  ])

  const result = {
    data: variants,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  return result
}

const getVariant = async (variantId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await VariantModel.findById(variantId).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateVariant = async (variantId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateOps = {
      importPrice: reqBody.importPrice,
      exportPrice: reqBody.exportPrice,
      overridePrice: reqBody.overridePrice,
      destroy: reqBody.destroy,
      overridePackageSize: reqBody.overridePackageSize,
      packageSize: reqBody.packageSize,
      status: reqBody.status
    }

    // Nếu có ảnh color mới
    if (reqBody.color && reqBody.color.image) {
      updateOps['color.image'] = reqBody.color.image
    }

    // Nếu có discountPrice
    if (reqBody.discountPrice !== undefined) {
      updateOps.discountPrice = reqBody.discountPrice
    }

    const updatedVariant = await VariantModel.findByIdAndUpdate(
      { _id: variantId },
      { $set: updateOps },
      { new: true }
    )

    return updatedVariant
  } catch (err) {
    throw err
  }
}

// Cập nhật discountPrice cho tất cả biến thể của một sản phẩm
const updateProductVariantsDiscountPrice = async (
  productId,
  flashSalePrice
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Kiểm tra sản phẩm có tồn tại không
    const product = await ProductModel.findById(productId)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại')
    }

    // Lấy tất cả biến thể hiện tại để lưu giá ban đầu
    const currentVariants = await VariantModel.find({
      productId: productId,
      destroy: false
    })

    // Cập nhật discountPrice và lưu giá ban đầu cho tất cả biến thể của sản phẩm
    const updatePromises = currentVariants.map(async (variant) => {
      // Nếu originalDiscountPrice chưa được set (lần đầu tạo Flash Sale)
      if (
        variant.originalDiscountPrice === 0 ||
        variant.originalDiscountPrice === undefined
      ) {
        return VariantModel.findByIdAndUpdate(
          variant._id,
          {
            $set: {
              discountPrice: flashSalePrice, // Thay thế hoàn toàn bằng giá Flash Sale
              originalDiscountPrice: variant.discountPrice // Lưu giá ban đầu (ví dụ: 10.000)
            }
          },
          { new: true }
        )
      } else {
        // Nếu đã có originalDiscountPrice, chỉ cập nhật discountPrice
        return VariantModel.findByIdAndUpdate(
          variant._id,
          { $set: { discountPrice: flashSalePrice } }, // Thay thế bằng giá Flash Sale mới
          { new: true }
        )
      }
    })

    const results = await Promise.all(updatePromises)

    return {
      message: `Đã cập nhật giá Flash Sale cho ${results.length} biến thể`,
      modifiedCount: results.length
    }
  } catch (err) {
    throw err
  }
}

// Khôi phục discountPrice về giá ban đầu cho tất cả biến thể của một sản phẩm
const restoreProductVariantsOriginalDiscountPrice = async (productId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Kiểm tra sản phẩm có tồn tại không
    const product = await ProductModel.findById(productId)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại')
    }

    // Lấy tất cả biến thể hiện tại để có giá originalDiscountPrice
    const currentVariants = await VariantModel.find({
      productId: productId,
      destroy: false
    })

    // Cập nhật discountPrice về giá ban đầu cho tất cả biến thể của sản phẩm
    const updatePromises = currentVariants.map(async (variant) => {
      return VariantModel.findByIdAndUpdate(
        variant._id,
        {
          $set: {
            discountPrice: variant.originalDiscountPrice || 0 // Sử dụng giá trị thực tế
          }
        },
        { new: true }
      )
    })

    const results = await Promise.all(updatePromises)

    return {
      message: `Đã khôi phục giá về ban đầu cho ${results.length} biến thể`,
      modifiedCount: results.length
    }
  } catch (err) {
    throw err
  }
}

const deleteVariant = async (variantId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const variantDeleted = await VariantModel.updateOne(
      { _id: variantId },
      { destroy: true },
      { new: true }
    )

    if (!variantDeleted) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Biến thể không tồn tại.')
    }

    return variantDeleted
  } catch (err) {
    throw err
  }
}

export const variantsService = {
  createVariant,
  getVariantList,
  getVariant,
  updateVariant,
  updateProductVariantsDiscountPrice,
  restoreProductVariantsOriginalDiscountPrice,
  deleteVariant
}
