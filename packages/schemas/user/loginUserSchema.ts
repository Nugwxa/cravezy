import { z } from 'zod'

const loginUserSchema = z.object({
  // Email
  email: z
    .string({ required_error: 'No email provided' })
    .email('Invalid email format')
    .transform((email) => email.toLowerCase()),

  // Password
  // I'm not verifying the length here because if they managed to bypass
  // the length check while creating their account they should still be
  // able to log in.

  password: z
    .string({
      required_error: 'No password provided',
      invalid_type_error: 'Invalid password type',
    })
    .refine((val) => val.trim() !== '', 'Password cannot be empty'),
})

export default loginUserSchema
