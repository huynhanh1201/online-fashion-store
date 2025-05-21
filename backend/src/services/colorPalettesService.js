import { StatusCodes } from 'http-status-codes'

import { ColorPaletteModel } from '~/models/ColorPaletteModel'
import ApiError from '~/utils/ApiError'

const createColorPalette = async (colorPaletteId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newColorPalette = {
      name: reqBody.name,
      image: reqBody.image,
      isActive: true
    }

    const updatedPalette = await ColorPaletteModel.findOneAndUpdate(
      { _id: colorPaletteId },
      { $push: { colors: newColorPalette } },
      {
        new: true,
        upsert: true
      }
    )

    return updatedPalette
  } catch (err) {
    throw err
  }
}

const getColorPaletteList = async (productId) => {
  const result = await ColorPaletteModel.findOne({ productId }).lean()
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
      { 'colors._id': colorPaletteId },
      {
        $set: {
          'colors.$.name': reqBody.name, // cập nhật từng trường
          'colors.$.image': reqBody.image,
          'colors.$.isActive': reqBody.isActive
        }
      },
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
    const colorPaletteDeleted = await ColorPaletteModel.updateOne(
      { 'colors._id': colorPaletteId }, // tìm document chứa phần tử cần xóa
      { $pull: { colors: { _id: colorPaletteId } } } // pull phần tử có _id khớp
    )

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
