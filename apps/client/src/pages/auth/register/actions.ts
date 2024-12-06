import { CreateUserDTO } from '@shared/types/user'
import { createUserSchema } from '@shared/schemas/user/'
import { verificationTokenSchema } from '@shared/schemas/verificationToken/'
import createUser from '@/data/user/createUser'
import flattenZodErrors from '@shared/utils/flattenZodErrors'

/**
 * Handles the registration form submission logic
 *
 * @param {FormData} formData - The registration form data submitted by the user.
 * @returns {Promise<FormSubmissionResult>} - The result of the form submission, including success status and messages.
 */
export async function handleRegistrationForm(
  formData: FormData
): Promise<FormSubmissionResult> {
  // Extract password and confirmation password from the form data
  // and ensure they match
  const password = formData.get('password')?.toString()
  const confirmPassword = formData.get('confirm-password')?.toString()

  if (password !== confirmPassword)
    return {
      success: false,
      message: 'Passwords do not match',
    }

  // Convert the form data into a plain object and validate it with zod
  const form = Object.fromEntries(formData.entries())
  const parseResult = createUserSchema.safeParse(form)
  if (!parseResult.success) {
    return {
      success: false,
      message: 'Invalid Submission',
      errors: flattenZodErrors(parseResult.error.format()),
    }
  }

  const verificationTokenParse = verificationTokenSchema.safeParse(form)
  if (!verificationTokenParse.success) {
    return {
      success: false,
      message: 'Invalid Submission',
      errors: flattenZodErrors(verificationTokenParse.error.format()),
    }
  }

  // Combine the parsed user data and verification token into a DTO for user creation
  const createUserDTO: CreateUserDTO & { verificationToken: string } = {
    ...parseResult.data,
    verificationToken: verificationTokenParse.data.verificationToken,
  }

  const response = await createUser(createUserDTO)

  if (!response.success) {
    return {
      success: false,
      message: response.message,
      errors: response.errors,
      data: response.data,
    }
  }
  return {
    success: true,
    message: 'Account created',
  }
}
