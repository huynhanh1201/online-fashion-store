import { StatusCodes } from 'http-status-codes'

import { ColorPaletteModel } from '~/models/ColorPaletteModel'
import ApiError from '~/utils/ApiError'
import { ProductModel } from '~/models/ProductModel'

const createColorPalette = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newColorPalette = {
      productId: reqBody.productId,
      name: reqBody.name,
      image: reqBody.image
    }

    const colorPalette = await ColorPaletteModel.create(newColorPalette)

    return colorPalette
  } catch (err) {
    throw err
  }
}

const getColorPaletteList = async () => {
  const result = await ColorPaletteModel.find({}).lean()

  return result
}

const getColorPalette = async (colorPaletteId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await ColorPaletteModel.findById(colorPaletteId).lean()

    if (!result) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Không có dữ liệu Danh mục sản phẩm.'
      )
    }

    return result
  } catch (err) {
    throw err
  }
}

const updateColorPalette = async (colorPaletteId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedColorPalette = await ColorPaletteModel.findOneAndUpdate(
      { _id: colorPaletteId },
      reqBody,
      { new: true }
    )

    return updatedColorPalette
  } catch (err) {
    throw err
  }
}

const deleteColorPalette = async (colorPaletteId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const colorPaletteDeleted = await ColorPaletteModel.findOneAndDelete({
      _id: colorPaletteId
    })

    return colorPaletteDeleted
  } catch (err) {
    throw err
  }
}

export const colorPalettesService = {
  createColorPalette,
  getColorPaletteList,
  getColorPalette,
  updateColorPalette,
  deleteColorPalette
}
