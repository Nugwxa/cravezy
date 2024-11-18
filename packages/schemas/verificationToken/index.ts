import { z } from 'zod'

export const verificationTokenSchema = z.object({
  // Token
  verificationToken: z
    .string({
      required_error: 'No verification token provided',
      invalid_type_error: 'Invalid verification token',
    })
    .min(1, 'Verification token must not be empty'),
})
