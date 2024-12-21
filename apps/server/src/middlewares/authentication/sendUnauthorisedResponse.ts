import { ApiResponse } from '@shared/types/api'
import { Response } from 'express'

/**
 * Sends a standardised unauthorised response.
 *
 * @param {Response} res - The outgoing response object.
 * @param {string} message - The message describing the error.
 */
export default function sendUnauthorisedResponse(
  res: Response,
  message: string
) {
  const response: ApiResponse<null, undefined> = {
    statusCode: 401,
    success: false,
    data: null,
    message,
  }
  res.status(401).json(response)
}
