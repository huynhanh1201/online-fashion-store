import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'

import ApiError from '~/utils/ApiError'

const validObjectId = (objectID, next) => {
  if (!mongoose.isValidObjectId(objectID)) {
    const error = new ApiError(
      StatusCodes.BAD_REQUEST,
      'Không đúng định dạng MongoDB ObjectId'
    )
    next(error)
  }
}

export default validObjectId
