import { ApiResponse } from '@shared/types/api'
import { Request, Response } from 'express'
import { verifyPasswordResetToken } from '@/data/auth'
import jwt from 'jsonwebtoken'

/**
 * Route handler for verifying password reset tokens and generating new validation tokens for changing passwords
 *
 * @param {Request} req - The Express request object,
 * @param {Response} res - The Express response object used to send the response back to the client.
 */
export default async function passwordResetTokenVerificationHandler(
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> {
  try {
    const resetToken = req.query.token as string | undefined

    if (!resetToken) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: 'No token provided',
      } as ApiResponse)
    }

    // Verify the reset token is valid
    const response = await verifyPasswordResetToken(resetToken)

    if (!response.success) {
      return res.status(response.statusCode).json(response)
    }

    // If the token is valid, generate a JWT with a short expiration time to be
    // used for changing passwords
    const validationToken = jwt.sign(
      { email: response.data! },
      process.env.JWT_SECRET_KEY!,
      // 15 minutes should be more than enough time for the user to enter a new password
      { expiresIn: '15m' }
    )

    const newResponseData = {
      validationToken,
      email: response.data!,
    }

    // Send a success response with the new validation token and email
    return res.status(response.statusCode).json({
      ...response,
      message: 'Token verified and new validation token generated.',
      data: newResponseData, // Override the `data` field with additional details
    } as ApiResponse)
  } catch (e) {
    // Handle unexpected errors
    console.error('Error in password reset token handler:', e)
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: 'Something went wrong',
    } as ApiResponse)
  }
}
