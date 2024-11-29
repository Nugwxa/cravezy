import { ApiResponse } from '@shared/types/api'

/**
 *  Verifies the reCAPTCHA token with Google's reCAPTCHA API.
 * @param {string} token - The reCAPTCHA token to be verified.
 */
export default async function verifyReCaptchaToken(
  token: string
): Promise<ApiResponse> {
  try {
    // Construct the request parameters
    const params = new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY ?? '  ',
      response: token,
    })

    // Send a request to Google's reCAPTCHA API to verify the token
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?${params.toString()}`,
      { method: 'POST' }
    )

    if (!response.ok) {
      return {
        success: false,
        message: 'Error validating captcha token',
        statusCode: 500,
      }
    }

    const parsedResponse = await response.json()

    if (!parsedResponse.success) {
      return {
        success: false,
        message: 'Invalid captcha',
        statusCode: 400,
      }
    }

    return {
      success: true,
      message: 'Token is valid',
      statusCode: 200,
    }
  } catch (e) {
    return {
      success: false,
      message: 'Unexpected error validating captcha token',
      statusCode: 500,
    }
  }
}
