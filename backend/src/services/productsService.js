import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'

import { ProductModel } from '~/models/ProductModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { ColorPaletteModel } from '~/models/ColorPaletteModel'
import { SizePaletteModel } from '~/models/SizePaletteModel'
import { InventoryModel } from '~/models/InventoryModel'
import generateSKU from '~/utils/generateSKU'

const createProduct = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newProduct = {
      name: reqBody.name,
      description: reqBody.description,
      price: reqBody.price,
      image: reqBody.image,
      categoryId: reqBody.categoryId,
      slug: slugify(reqBody.name),

      importPrice: reqBody.importPrice,
      sizes: reqBody.sizes,
      colors: reqBody.colors,

      exportPrice: reqBody.price,
      quantity: 0,
      destroy: false
    }

    const product = await ProductModel.create(newProduct)

    //  Tạo Màu sắc sản phẩm
    const newColorPalette = {
      productId: product._id,
      colors: reqBody.colors
    }

    await ColorPaletteModel.create(newColorPalette)

    //  Tạo Kích cỡ sản phẩm
    const newSizePalette = {
      productId: product._id,
      sizes: reqBody.sizes
    }

    await SizePaletteModel.create(newSizePalette)

    // Lưu vào Kho sản phẩm

    const inventoris = reqBody.stockMatrix.map((item) => {
      const colorName = item.color.toLowerCase()

      const colorObj = reqBody.colors.find(
        (color) => color.name.toLowerCase() === colorName
      )

      const inventory = {
        productId: product._id, // ID sản phẩm gốc
        variant: {
          color: { name: item.color, image: colorObj.image },
          size: { name: item.size.toUpperCase() },
          sku: generateSKU(product.name, colorName, item.size)
        },
        quantity: item.quantity,
        importPrice: product.importPrice,
        exportPrice: product.price,
        minQuantity: 5,
        status: 'in-stock',
        destroy: false
      }

      return inventory
    })

    await InventoryModel.insertMany(inventoris)

    return product
  } catch (err) {
    throw err
  }
}

const getProductList = async (reqQuery) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let { page, limit, search, categoryId, origin, priceMin, priceMax } =
      reqQuery

    page = parseInt(page, 10)
    limit = parseInt(limit, 10)

    if (isNaN(page) || page < 1) page = 1
    if (isNaN(limit) || limit < 1) limit = 10

    const filter = { destroy: false }

    const priceMinNumber = Number(priceMin)
    const priceMaxNumber = Number(priceMax)

    if (!isNaN(priceMinNumber))
      filter.price = { ...(filter.price || {}), $gte: priceMinNumber }

    if (!isNaN(priceMaxNumber))
      filter.price = { ...(filter.price || {}), $lte: priceMaxNumber }

    if (search) filter.name = { $regex: search, $options: 'i' }

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId))
      filter.categoryId = categoryId

    if (origin) filter.origin = origin

    const [products, total] = await Promise.all([
      ProductModel.find(filter)
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

    return result || []
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
    const productUpdated = await ProductModel.findOneAndUpdate(
      {
        _id: productId
      },
      {
        $set: { destroy: true }
      },
      {
        new: true
      }
    )

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

export const productsService = {
  createProduct,
  getProductList,
  getProduct,
  updateProduct,
  deleteProduct,
  getListProductOfCategory
}
