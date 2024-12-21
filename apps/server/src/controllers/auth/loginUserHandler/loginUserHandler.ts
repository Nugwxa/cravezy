import { ApiResponse } from '@shared/types/api'
import { loginUser } from '@/data/users'
import { loginUserSchema } from '@shared/schemas/user'
import { Request, Response } from 'express'
import flattenZodErrors from '@shared/utils/flattenZodErrors'

export default async function loginUserHandler(
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> {
  try {
    // Check if the request body matches the expected format
    const parseResponse = loginUserSchema.safeParse(req.body)

    if (!parseResponse.success) {
      const responseObject: ApiResponse<undefined, string> = {
        statusCode: 400,
        success: false,
        message: 'Invalid Request',
        errors: flattenZodErrors(parseResponse.error.format()),
      }

      return res.status(400).json(responseObject)
    }

    const response = await loginUser({
      email: parseResponse.data.email,
      password: parseResponse.data.password,
    })

    // Set a cookie with user's session data if the login succeeds
    if (response.success) {
      res.cookie('craveCookie', response.data!.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 1000, // Expire after a day
        sameSite: 'strict',
      })

      res.cookie('refreshToken', response.data!.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
      })
    }

    // Send the login result back to the client
    return res.status(response.statusCode).json({
      statusCode: response.statusCode,
      success: response.success,
      message: response.message,
    })
  } catch (e) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: 'Something went wrong',
    })
  }
}
