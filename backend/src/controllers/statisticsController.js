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

export const statisticsController = {
  getInventoryStatistics
}
