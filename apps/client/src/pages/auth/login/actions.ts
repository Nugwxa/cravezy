import { loginUserSchema } from '@shared/schemas/user'
import flattenZodErrors from '@shared/utils/flattenZodErrors'
import loginUser from '@/data/user/loginUser'

/**
 * Handles the login form submission logic
 *
 * @param {FormData} formData - The login form data submitted by the user.
 * @returns {Promise<FormSubmissionResult>} - The result of the form submission, including success status and messages.
 */
export async function handleLoginForm(
  formData: FormData
): Promise<FormSubmissionResult> {
  try {
    // Convert the form data into a plain object and validate it with zod
    const form = Object.fromEntries(formData.entries())

    const parsedFormResponse = loginUserSchema.safeParse(form)

    if (!parsedFormResponse.success) {
      return {
        success: false,
        message: 'Invalid Submission',
        errors: flattenZodErrors(parsedFormResponse.error.format()),
      }
    }
    // Attempt login with the email and password
    const { email, password } = parsedFormResponse.data
    const response = await loginUser({ email, password })

    if (response.success) {
      const queryParams = new URLSearchParams(window.location.search)
      const redirectTo = queryParams.get('redirect')
      const safeRedirectTo = redirectTo?.startsWith('/') ? redirectTo : '/'
      window.location.href = safeRedirectTo
    }

    return {
      success: response.success,
      message: response.message,
      errors: response.errors,
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return {
      success: false,
      message: 'An unexpected error occurred while logging in',
    }
  }
}
