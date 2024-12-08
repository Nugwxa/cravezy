import { ApiResponse } from '@shared/types/api'
import { UserDTO } from '@shared/types/user'

interface LoginUserDTO {
  email: string
  password: string
}

/**
 * Creates a session for a user
 * @param {LoginUserDTO} loginUserDTO - The data required to login the user
 */
export default async function loginUser(
  loginUserDTO: Readonly<LoginUserDTO>
): Promise<FormSubmissionResult<UserDTO>> {
  try {
    const { email, password } = loginUserDTO

    const response = await fetch(
      `${import.meta.env.VITE_API_HOST_URL}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
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
      message: `Unexpected error while signing in${e instanceof Error ? `: ${e.message}` : ''}`,
    }
  }
}
