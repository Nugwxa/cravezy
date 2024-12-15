import { ApiResponse } from '@shared/types/api'

/**
 * Sends an email to the provided email (if it is associated with a user)
 * @param {string} email - The email of the user to send the email to
 */
export default async function sendPasswordResetLink(
  email: string
): Promise<FormSubmissionResult<undefined>> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_HOST_URL}/auth/password-reset`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }
    )

    // Verify that the response is JSON formatted
    const isJson = response.headers
      .get('content-type')
      ?.includes('application/json')
    const data: ApiResponse<undefined, string> = isJson
      ? await response.json()
      : { message: 'Unexpected response format' }

    if (!response.ok) {
      return {
        success: false,
        message: data.message,
        errors: data.errors,
      }
    }

    return {
      success: true,
      message: data.message,
    }
  } catch (e) {
    // Handle unexpected errors
    return {
      success: false,
      message: `Unexpected error while sending reset email${e instanceof Error ? `: ${e.message}` : ''}`,
    }
  }
}
