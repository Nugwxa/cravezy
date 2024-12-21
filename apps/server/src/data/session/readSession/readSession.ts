import { ApiResponse } from '@shared/types/api'
import { supabase } from '@/lib/supabase'
import { UserDTO } from '@shared/types/user'
import prisma from '@/lib/prisma'

/**
 * Verifies a session is valid and returns the user associated with it.
 *
 * @param {string} token - The session JWT
 * @returns {Promise<ApiResponse<UserDTO | null, string>>} Response object containing success status, data/error message, and status code
 */
export default async function readSession(
  token: string
): Promise<ApiResponse<UserDTO | null>> {
  try {
    // Retrieve the user associated with the token from Supabase
    const { data, error: supabaseError } = await supabase.auth.getUser(token)

    // Handle potential Supabase auth errors
    if (supabaseError) {
      console.log(supabaseError.code)

      if (supabaseError.code === 'bad_jwt') {
        return {
          statusCode: 400,
          success: false,
          data: null,
          message: 'Invalid token',
        }
      }
      throw new Error(`Database session read error`)
    }

    // Check if there's a user in the database with the userId from Supabase
    const user: UserDTO | null = await prisma.user.findUnique({
      where: {
        id: data.user.id,
      },
    })

    if (!user) {
      return {
        statusCode: 404,
        success: false,
        data: null,
        message: 'No user found ',
      }
    }

    // Return the user data in the response so it can be used after verifying the session
    return {
      statusCode: 200,
      success: true,
      data: user,
      message: 'Session data present',
    }
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.message
        : 'Unexpected server error while reading session'
    return {
      statusCode: 500,
      success: false,
      message: errorMessage,
      data: null,
    }
  }
}
