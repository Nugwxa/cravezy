import { Request, Response, NextFunction } from 'express'
import { supabase } from '@/lib/supabase'
import parseCookies from '@/utils/parseCookies'
import refreshAccessToken from './refreshAccessToken'
import sendUnauthorisedResponse from './sendUnauthorisedResponse'

export type AuthCookies = {
  craveCookie?: string
  refreshToken?: string
}

/**
 * Middleware to authenticate incoming requests using Supabase.
 * It validates the access token and refreshes it if necessary.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {NextFunction} next - The next function to call.
 */
export default async function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Extract raw cookies from the request headers
    const rawCookies = req.headers.cookie

    // If no cookies are provided, return an unauthorized response
    if (!rawCookies) {
      return sendUnauthorisedResponse(res, 'No tokens provided')
    }

    // Parse cookies into a key-value object for easier access
    const cookies: AuthCookies = parseCookies(rawCookies)

    const accessToken = cookies.craveCookie

    // If no access token is present, return an unauthorized response
    if (!accessToken) {
      return sendUnauthorisedResponse(res, 'No access token provided')
    }

    // Verify the access token using Supabase
    const { error: supabaseError } = await supabase.auth.getUser(accessToken)

    if (supabaseError) {
      // If the access token is invalid or expired, attempt refreshing it
      const refreshedToken = await refreshAccessToken(req, res)
      if (!refreshedToken) {
        // If refreshing the token failed, the error was already handled in refreshAccessToken
        return
      }
      // Set the refreshed access token back into the cookie
      res.cookie('craveCookie', refreshedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 1000, // 1 day expiration
        sameSite: 'strict',
      })
    }

    // Proceed with the next middleware or route handler
    return next()
  } catch (error) {
    // Handle unexpected server errors
    return res.status(500).json({
      statusCode: 500,
      success: false,
      data: null,
      message: 'Unexpected authentication error',
    })
  }
}
