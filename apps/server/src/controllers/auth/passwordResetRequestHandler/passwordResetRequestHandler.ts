import { ApiResponse } from '@shared/types/api'
import { passwordResetSchema } from '@shared/schemas/user'
import { Request, Response } from 'express'
import { sendPasswordResetLink } from '@/data/users'
import flattenZodErrors from '@shared/utils/flattenZodErrors'

/**
 * Route handler for processing password reset requests.
 *
 * @param {Request} req - The Express request object,
 * @param {Response} res - The Express response object used to send the response back to the client.
 */
export default async function passwordResetRequestHandler(
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> {
  try {
    // Check if the request body matches the expected format
    const parsedRequest = passwordResetSchema.safeParse(req.body)

    if (!parsedRequest.success) {
      const responseObj: ApiResponse<undefined, string> = {
        statusCode: 400,
        success: false,
        message: 'Invalid Request',
        errors: flattenZodErrors(parsedRequest.error.format()),
      }
      return res.status(400).json(responseObj)
    }

    const { email } = parsedRequest.data

    // Attempt to send a password reset link
    const resetResponse = await sendPasswordResetLink(email)

    // Construct and send a response based on the reset attempt outcome
    const responseObj: ApiResponse<undefined, string> = {
      statusCode: resetResponse.statusCode,
      message: resetResponse.message,
      success: resetResponse.success,
      errors: resetResponse.errors,
    }

    return res.status(resetResponse.statusCode).json(responseObj)
  } catch (e) {
    const errorResponse: ApiResponse = {
      statusCode: 500,
      success: false,
      message: 'Something went wrong',
    }
    return res.status(errorResponse.statusCode).json(errorResponse)
  }
}
