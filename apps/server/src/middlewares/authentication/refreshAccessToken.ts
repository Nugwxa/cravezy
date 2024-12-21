import { AuthCookies } from './authenticationMiddleware'
import { Request, Response } from 'express'
import { supabase } from '@/lib/supabase'
import parseCookies from '@/utils/parseCookies'
import sendUnauthorisedResponse from './sendUnauthorisedResponse'

/**
 * Refreshes the access token using the refresh token from cookies.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 */
export default async function refreshAccessToken(req: Request, res: Response) {
  // Extract raw cookies from the request headers
  const rawCookies = req.headers.cookie

  // If no cookies are provided, send an unauthorised response
  if (!rawCookies) {
    return sendUnauthorisedResponse(res, 'No tokens provided')
  }

  // Parse cookies into a key-value object for easier access
  const cookies: AuthCookies = parseCookies(rawCookies)

  if (!cookies.refreshToken) {
    return sendUnauthorisedResponse(res, 'No refresh token provided')
  }

  // Use the refresh token to get a new access token from Supabase
  const { data, error: supabaseError } = await supabase.auth.refreshSession({
    refresh_token: cookies.refreshToken,
  })

  if (supabaseError || !data.session) {
    return sendUnauthorisedResponse(res, 'Failed to refresh access token')
  }

  return data.session.access_token
}
