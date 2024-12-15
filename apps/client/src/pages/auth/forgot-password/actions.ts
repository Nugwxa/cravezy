import { passwordResetSchema } from '@shared/schemas/user'
import flattenZodErrors from '@shared/utils/flattenZodErrors'
import sendPasswordResetLink from '@/data/user/sendPasswordResetLink'

/**
 * Handles the forgot password form submission logic
 *
 * @param {FormData} formData - The form data submitted by the user.
 * @returns {Promise<FormSubmissionResult>} - The result of the form submission, including success status and messages.
 */
export async function handleForgotPasswordForm(
  formData: FormData
): Promise<FormSubmissionResult> {
  try {
    // Convert the form data into a plain object and validate it with zod
    const form = Object.fromEntries(formData.entries())

    const parsedForm = passwordResetSchema.safeParse(form)

    if (!parsedForm.success) {
      return {
        success: false,
        message: 'Invalid Submission',
        errors: flattenZodErrors(parsedForm.error.format()),
      }
    }
    // Attempt sending a password reset link to the provided email
    const response = await sendPasswordResetLink(parsedForm.data.email)

    return {
      success: response.success,
      message: response.message,
      errors: response.errors,
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return {
      success: false,
      message: 'An unexpected error occurred while sending the reset link',
    }
  }
}
