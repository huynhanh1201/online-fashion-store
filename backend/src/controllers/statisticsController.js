import { StatusCodes } from 'http-status-codes'

import { statisticsService } from '~/services/statisticsService'

const getInventoryStatistics = async (req, res, next) => {
  try {
    const result = await statisticsService.getInventoryStatistics()

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getProductStatistics = async (req, res, next) => {
  try {
    const result = await statisticsService.getProductStatistics()

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getOrderStatistics = async (req, res, next) => {
  try {
    const result = await statisticsService.getOrderStatistics()

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getUserStatistics = async (req, res, next) => {
  try {
    const result = await statisticsService.getUserStatistics()

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const statisticsController = {
  getInventoryStatistics,
  getProductStatistics,
  getOrderStatistics,
  getUserStatistics
}
