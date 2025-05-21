import { StatusCodes } from 'http-status-codes'

import { colorPalettesService } from '~/services/colorPalettesService'

const createColorPalette = async (req, res, next) => {
  try {
    // Lấy Danh mục sản phẩm mới tạo từ tầng Service chuyển qua
    const result = await colorPalettesService.createColorPalette(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getColorPaletteList = async (req, res, next) => {
  try {
    const productId = req.query.productId

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await colorPalettesService.getColorPaletteList(productId)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getColorPalette = async (req, res, next) => {
  try {
    const colorPaletteId = req.params.colorPaletteId

    const result = await colorPalettesService.getColorPalette(colorPaletteId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateColorPalette = async (req, res, next) => {
  try {
    const colorPaletteId = req.params.colorPaletteId

    const result = await colorPalettesService.updateColorPalette(
      colorPaletteId,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteColorPalette = async (req, res, next) => {
  try {
    const colorPaletteId = req.params.colorPaletteId

    const result = await colorPalettesService.deleteColorPalette(colorPaletteId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const colorPalettesController = {
  createColorPalette,
  getColorPaletteList,
  getColorPalette,
  updateColorPalette,
  deleteColorPalette
}
