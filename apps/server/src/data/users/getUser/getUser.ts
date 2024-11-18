import { ApiResponse } from '@shared/types/api'
import { UserIdentifierDTO } from '@shared/types/user'
import prisma from '@/lib/prisma'

export default async function getUser(
  props: Readonly<UserIdentifierDTO>
): Promise<ApiResponse> {
  const { id, email } = props

  if (!id && !email)
    return {
      success: false,
      message: 'No identifier provided. An email or id must be provided.',
      statusCode: 400,
    }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        registrationDate: true,
      },
    })

    return {
      success: true,
      data: user,
      message: 'User data retrieved.',
      statusCode: 200,
    }
  } catch (e) {
    return {
      success: false,
      message: 'An unexpected database error occurred while getting the user.',
      statusCode: 500,
    }
  }
}
