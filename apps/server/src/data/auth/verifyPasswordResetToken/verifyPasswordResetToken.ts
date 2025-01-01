import { ApiResponse } from '@shared/types/api'
import { supabase } from '@/lib/supabase'

/**
 * Verifies a password reset token is valid.
 *
 * @param {string} resetToken - The password reset token to be verified.
 * @returns {Promise<ApiResponse<UserDTO | null, string>>} Response object containing success status, data/error message, and status code
 */
export default async function verifyPasswordResetToken(
  resetToken: string
): Promise<ApiResponse<string | undefined>> {
  try {
    const { data, error: supabaseError } = await supabase.auth.verifyOtp({
      type: 'recovery',
      token_hash: resetToken,
    })

    // Handle scenarios where token verification fails or the user's email is missing
    if (supabaseError || !data.user?.email) {
      return {
        statusCode: 401,
        success: false,
        message: 'Invalid or expired token.',
      }
    }

    return {
      statusCode: 200,
      success: true,
      data: data.user.email,
      message: 'Token verified',
    }
  } catch (e) {
    console.error('Error during token verification:', e)
    return {
      statusCode: 500,
      success: false,
      message: 'Internal server error',
    }
  }
}
