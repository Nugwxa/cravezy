import { ApiResponse } from '@shared/types/api'
import { readSession } from '@/data/session'
import { Request, Response } from 'express'
import parseCookies from '@/utils/parseCookies'

type PossibleCookies = {
  craveCookie?: string
}

/**
 * Route handler for processing session check requests.
 *
 * @param {Request} req - The Express request object,
 * @param {Response} res - The Express response object used to send the response back to the client.
 */
export default async function readSessionHandler(
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> {
  try {
    // Extract raw cookies from the request headers
    const rawCookies = req.headers.cookie

    // Check if cookies are present and the "craveCookie" is present
    if (!rawCookies) {
      const errorResponse: ApiResponse<null> = {
        statusCode: 404,
        success: false,
        data: null,
        message: 'Session not found',
      }
      return res.status(errorResponse.statusCode).json(errorResponse)
    }

    // Parse cookies into a key-value object for easier access
    const cookies: PossibleCookies = parseCookies(rawCookies)

    if (!cookies.craveCookie) {
      const errorResponse: ApiResponse<null> = {
        statusCode: 400,
        success: true,
        data: null,
        message: 'Session not found',
      }
      return res.status(errorResponse.statusCode).json(errorResponse)
    }

    // Validate the session JWT/cookie
    const response = await readSession(cookies.craveCookie)
    return res.status(response.statusCode).json(response)
  } catch (e) {
    // Handle unexpected errors
    const errorResponse: ApiResponse<undefined, undefined> = {
      statusCode: 500,
      success: false,
      message: 'Something went wrong',
    }
    return res.status(500).json(errorResponse)
  }
}
