import { Request, Response } from 'express'
import verifyReCaptchaToken from '@/data/verifyReCaptchaToken'

export default async function validateCaptchaHandler(
  req: Request,
  res: Response
) {
  const token: string | undefined = req.body.token

  // Validate token presence and type
  // Could use zod but that seems like overkill for this scenario
  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Missing or invalid token',
      statusCode: 400,
    })
  }

  try {
    // Validate/Verify the token
    const response = await verifyReCaptchaToken(token)

    return res.status(response.statusCode).json({
      success: response.success,
      message: response.message,
      statusCode: response.statusCode,
    })
  } catch (error) {
    // Catch any unexpected errors (Unlikely to happen)
    return res.status(500).json({
      success: false,
      message: 'Unexpected error occurred during CAPTCHA verification',
      statusCode: 500,
    })
  }
}
