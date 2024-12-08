import { z } from 'zod'

const passwordResetSchema = z.object({
  // Email
  email: z
    .string({ required_error: 'No email provided' })
    .email('Invalid email format')
    .transform((email) => email.toLowerCase()),
})

export default passwordResetSchema
