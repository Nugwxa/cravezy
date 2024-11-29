import { ApiResponse } from '@shared/types/api'

export type CaptchaToken = null | string
/**
 * Checks if a captcha token (currently reCAPTCHA) is valid.
 *
 * @param {CaptchaToken} token - The reCAPTCHA token to validate.
 *
 */
export default async function verifyCaptchaToken(
  token?: CaptchaToken
): Promise<Pick<ApiResponse, 'success' | 'message' | 'errors'>> {
  // Check if a token is present
  if (!token) {
    return {
      success: false,
      message: 'No reCAPTCHA token present',
    }
  }

  try {
    // Send the token to the backend to validate it
    const response = await fetch(
      `${process.env.API_HOST_URL}/captcha/validate`,
      {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ token }),
      }
    )

    // Handle errors for status codes outside the 200 range
    if (!response.ok) {
      const parsedResponse: ApiResponse<undefined, string> =
        await response.json()

      const { message, errors } = parsedResponse
      return {
        success: false,
        message,
        errors,
      }
    }

    return {
      success: true,
      message: 'Token is valid 👍',
    }
  } catch (e) {
    return {
      success: false,
      message: `Unexpected error while verifying captcha token: ${e instanceof Error ? e.message : String(e)}`,
    }
  }
}
