import { ApiResponse } from '@shared/types/api'
import { supabase } from '@/lib/supabase'
import countUsers from '../countUsers'

/**
 * Sends a password reset link to the provided email if the email is associated with an existing user.
 *
 * @param {string} email - The email to send the password reset link to.
 *
 * @example
 * const response = await sendPasswordResetLink('user@example.com');
 * console.log(response.success); // Logs success state
 */
export default async function sendPasswordResetLink(
  email: string
): Promise<ApiResponse<undefined, string>> {
  try {
    // Check if there's a user with the provided email
    const userResponse = await countUsers({ email: email })

    if (!userResponse.success || userResponse.data === undefined) {
      return {
        statusCode: userResponse.statusCode,
        message: 'Error verifying user',
        success: false,
        errors: userResponse.errors,
      }
    }

    // Only send the reset email if the provided email is associated with a user
    if (userResponse.data > 0) {
      const { error: supabaseError } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.SERVER_URL}/auth/password-reset/confirm`,
        })

      // Handle potential Supabase auth errors
      if (supabaseError) {
        throw new Error(`Database password reset error`)
      }
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Password reset link sent! Please check your email.',
    }
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.message
        : 'Unexpected server error while sending the reset link'
    return {
      statusCode: 500,
      success: false,
      message: errorMessage,
    }
  }
}
