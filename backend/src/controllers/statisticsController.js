import { StatusCodes } from 'http-status-codes'

import { statisticsService } from '~/services/statisticsService'

const getInventoryStatistics = async (req, res, next) => {
  try {
    const queryString = req.query
    const result = await statisticsService.getInventoryStatistics(queryString)

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

const getFinanceStatistics = async (req, res, next) => {
  try {
    const queryString = req.query
    const result = await statisticsService.getFinanceStatistics(queryString)

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
  getUserStatistics,
  getFinanceStatistics
}
