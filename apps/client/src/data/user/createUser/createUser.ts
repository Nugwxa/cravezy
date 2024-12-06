import { ApiResponse } from '@shared/types/api'
import { CreateUserDTO, UserDTO } from '@shared/types/user'

/**
 * Creates a new user by sending a POST request to the API.
 *
 * @param {CreateUserDTO & { verificationToken?: string }} createUserDTO - The data required to create a user, with an optional verification token.
 */
export default async function createUser(
  createUserDTO: CreateUserDTO & { verificationToken?: string }
): Promise<FormSubmissionResult<UserDTO>> {
  try {
    // Send a POST request to the API with user details
    const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(createUserDTO),
      headers: { 'Content-Type': 'application/json' },
    })

    // Verify that the response is JSON formatted
    const isJson = response.headers
      .get('content-type')
      ?.includes('application/json')
    const data: ApiResponse<UserDTO | undefined, string> = isJson
      ? await response.json()
      : { message: 'Unexpected response format' }

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to create user',
        errors: data.errors,
      }
    }

    return {
      success: true,
      data: data.data!,
      message: data.message,
    }
  } catch (e) {
    // Handle unexpected errors
    return {
      success: false,
      message: `Unexpected error creating user ${e instanceof Error ? ` :${e.message}` : ''}`,
    }
  }
}
