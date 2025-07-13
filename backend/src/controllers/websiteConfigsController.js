import { StatusCodes } from 'http-status-codes'

import { websiteConfigsService } from '~/services/websiteConfigsService'

const createWebsiteConfig = async (req, res, next) => {
  try {
    const result = await websiteConfigsService.createWebsiteConfig(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getWebsiteConfigList = async (req, res, next) => {
  try {
    const queryString = req.query

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await websiteConfigsService.getWebsiteConfigList(queryString)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getWebsiteConfig = async (req, res, next) => {
  try {
    const websiteConfigId = req.params.websiteConfigId

    const result = await websiteConfigsService.getWebsiteConfig(websiteConfigId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateWebsiteConfig = async (req, res, next) => {
  try {
    const websiteConfigId = req.params.websiteConfigId

    const result = await websiteConfigsService.updateWebsiteConfig(
      websiteConfigId,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteWebsiteConfig = async (req, res, next) => {
  try {
    const websiteConfigId = req.params.websiteConfigId

    const result =
      await websiteConfigsService.deleteWebsiteConfig(websiteConfigId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const websiteConfigsController = {
  createWebsiteConfig,
  getWebsiteConfigList,
  getWebsiteConfig,
  updateWebsiteConfig,
  deleteWebsiteConfig
}
