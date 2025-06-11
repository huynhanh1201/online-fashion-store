import { StatusCodes } from 'http-status-codes'

import apiError from '~/utils/ApiError'

export default function validatePagination(page, limit) {
  limit = Number(limit)
  page = Number(page)

  if (!limit || limit < 1) {
    throw new apiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Query string "limit" phải là số và lớn hơn 0'
    )
  }

  if (!page || page < 1) {
    throw new apiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Query string "page" phải là số và lớn hơn 0'
    )
  }
}
