import { ApiResponse } from '@shared/types/api'
import { supabase } from '@/lib/supabase'

interface LoginUserParams {
  email: string
  password: string
}

export default async function loginUser(
  props: Readonly<LoginUserParams>
): Promise<ApiResponse<string, string>> {
  const { password, email } = props
  try {
    const { data, error: supabaseError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    // Handle potential Supabase auth errors
    if (supabaseError) {
      if (supabaseError.code === 'invalid_credentials') {
        return {
          success: false,
          statusCode: 401,
          message: 'Invalid email or password',
        }
      }
      throw new Error(`Database user login error: ${supabaseError.message}`)
    }

    const token = data.session.access_token

    return {
      statusCode: 200,
      success: true,
      message: 'Logged In',
      data: token,
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    return {
      statusCode: 500,
      success: false,
      message: errorMessage,
    }
  }
}
