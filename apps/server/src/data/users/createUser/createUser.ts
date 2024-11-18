import { ApiResponse } from '@shared/types/api'
import { CreateUserDTO, UserDTO } from '@shared/types/user'
import { createUserSchema } from '@shared/schemas/user'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import flattenZodErrors from '@shared/utils/flattenZodErrors'
import isValidUser from '../isValidUser'
import prisma from '@/lib/prisma'

/**
 * Creates a new user in the database
 *
 * @param {CreateUserDTO} data - User creation data object including name, email, password, and optional role/status
 * @returns {Promise<ApiResponse<UserDTO, string>>} Response object containing success status, data/error message, and status code
 *
 * @example
 *  // Creating an inactive employee
 * const result = await createUser({
 *   name: "John Doe",
 *   email: "john@doe.com",
 *   password: "securePassword123",
 *   isActive: false,
 *   role: "EMPLOYEE"
 * });
 */
export default async function createUser(
  data: Readonly<CreateUserDTO>
): Promise<ApiResponse<UserDTO, string>> {
  // Validate the props
  const validationResult = createUserSchema.safeParse(data)
  if (!validationResult.success) {
    return {
      success: false,
      statusCode: 400,
      message: 'Invalid request',
      errors: flattenZodErrors(validationResult.error.format()),
    }
  }

  const { name, email, password, isActive, role } = validationResult.data

  let userId: string | undefined = undefined
  try {
    // Create user in Supabase
    const {
      data: { user, session },
      error: supabaseError,
    } = await supabase.auth.signUp({ email, password })

    // Handle potential Supabase auth errors
    if (supabaseError) {
      if (supabaseError.code === 'user_already_exists') {
        return {
          success: false,
          statusCode: 409,
          message: 'Email already in use',
        }
      }
      // Any other error (I'd probably look into implementing better error handling for the codes later)
      throw new Error(`Database user creation error: ${supabaseError.message}`)
    }

    // Validate Supabase user object
    if (!isValidUser(user)) {
      throw new Error(
        'Database user creation error: Missing email or invalid user object'
      )
    }

    userId = user.id

    // Create user in the database (within a transaction)
    const newUser = await prisma.$transaction(async (prismaTransaction) => {
      return await prismaTransaction.user.create({
        data: {
          id: user.id,
          name,
          email: user.email,
          isActive,
          role,
        },
      })
    })

    return {
      success: true,
      data: newUser,
      message: 'User created successfully',
      statusCode: 201,
    }
  } catch (e) {
    // Delete Supabase user if database operation failed
    await deleteIncompleteUser(userId)
    const errorMessage = e instanceof Error ? e.message : String(e)

    if (errorMessage.includes('Prisma')) {
      console.error('Rolling back incomplete user creation:', errorMessage)
    }
    return {
      success: false,
      message: `${errorMessage}`,
      statusCode: 500,
    }
  }
}

/**
 * Deletes a user from Supabase
 *
 * @param {string} userId - The id of the user to be deleted
 *
 */
async function deleteIncompleteUser(userId?: string) {
  console.log('Attempt deletion')
  if (!userId) return
  try {
    await supabaseAdmin.auth.admin.deleteUser(userId)
  } catch (error) {
    console.error('Error deleting incomplete user from Supabase:', error)
  }
}
