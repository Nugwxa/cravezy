import { z } from 'zod'

const createUserSchema = z.object({
  // Name
  name: z
    .string({
      required_error: 'No name provided',
      invalid_type_error: 'Invalid name',
    })
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  // Email
  email: z
    .string({ required_error: 'No email provided' })
    .email('Invalid email format')
    .transform((email) => email.toLowerCase()),

  // Password
  password: z
    .string({
      required_error: 'No password provided',
      invalid_type_error: 'Invalid password type',
    })
    .min(6, 'Password must be at lest 6 characters long'),

  // Role
  role: z
    .enum(['EMPLOYEE', 'MANAGER'], {
      required_error: 'Invalid role provided',
    })
    .default('EMPLOYEE'),

  // Active Status
  isActive: z
    .boolean({
      invalid_type_error: 'Invalid active status type provided',
    })
    .default(true),
})

export default createUserSchema
