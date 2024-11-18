import { ApiResponse } from '@shared/types/api'
import { CountUsersDTO } from '@shared/types/user'
import countUsersSchema from '@shared/schemas/user/countUser'
import flattenZodErrors from '@shared/utils/flattenZodErrors'
import prisma from '@/lib/prisma'

/**
 * Counts the number of users in the database based on the provided filter criteria and pagination options.
 *
 * @param {string} id - The ID of the user to filter by (optional).
 * @param {string} email - The email of the user to filter by (optional).
 * @param {object} pagination - Pagination options to limit and skip results (optional).
 * @param {number} pagination.page - The current page number (optional).
 * @param {number} pagination.perPage - The number of users per page (optional).
 *
 * @returns {Promise<ApiResponse<number, string>>} An `ApiResponse` object containing the user count.
 *
 * @example
 * // Example usage to get the count of users by ID
 * const result = await countUsers({ id: '123' });
 * console.log(result.data); // Logs the number of users with ID '123'
 */
export default async function countUsers(
  props: Readonly<CountUsersDTO> = {}
): Promise<ApiResponse<number, string>> {
  try {
    const validationResult = countUsersSchema.safeParse(props)

    if (!validationResult.success) {
      // Handle validation errors
      return {
        success: false,
        message: 'Invalid input',
        errors: flattenZodErrors(validationResult.error.format()),
        statusCode: 400,
      }
    }

    const { id, email, pagination } = props
    // Build where clause
    const where = {
      ...(id && { id }),
      ...(id && { email }),
    }

    // Build pagination options
    const paginationOptions = pagination
      ? {
          skip: (pagination.page - 1) * pagination.perPage,
          take: pagination.perPage,
        }
      : {}

    const userCount = await prisma.user.count({
      where,
      skip: paginationOptions.skip,
      take: paginationOptions.take,
    })

    return {
      success: true,
      message: 'User count returned successfully',
      data: userCount,
      statusCode: 200,
    }
  } catch (error) {
    console.error('Error counting users:', error)

    return {
      success: false,
      message:
        'An unexpected database error occurred while counting the users.',
      statusCode: 500,
    }
  }
}
