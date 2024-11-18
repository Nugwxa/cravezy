import { createUser } from '@/data/users'
import { createUserSchema } from '@shared/schemas/user/'
import { verificationTokenSchema } from '@shared/schemas/verificationToken'
import { Response, Request } from 'express'
import { z } from 'zod'
import flattenZodErrors from '@shared/utils/flattenZodErrors'

export default async function createUserHandler(
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> {
  try {
    // validate the provided verification token
    const vtResult = verificationTokenSchema.safeParse(req.body)

    if (!vtResult.success) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid request',
        errors: flattenZodErrors(vtResult.error.format()),
      })
    }

    if (vtResult.data.verificationToken !== process.env.VERIFICATION_TOKEN!)
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Invalid verification token',
      })

    // Handle validation errors
    const validationResult = createUserSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid Request',
        errors: flattenZodErrors(validationResult.error.format()),
      })
    }

    // validate the user data
    const response = await createUser(validationResult.data)

    if (!response.success)
      return res.status(response.statusCode).json({
        success: false,
        statusCode: response.statusCode,
        message: response.message,
        errors: [],
      })

    return res.status(201).json({
      success: true,
      data: response.data,
      message: 'Account created successfully',
    })
  } catch (err) {
    // Zod Error
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request',
        errors: err,
      })
    }

    // General Error
    return res
      .status(500)
      .json({ success: false, message: 'Something went wrong' })
  }
}
