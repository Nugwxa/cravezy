import { z } from 'zod'
import { paginationSchema } from '../pagination'

const countUsersSchema = z.object({
  // ID
  id: z.string().min(1, 'Invalid ID length').optional(),
  // Email
  email: z
    .string()
    .email('Invalid email format')
    .transform((email) => email.toLowerCase())
    .optional(),
  // Pagination
  pagination: paginationSchema.optional(),
})

export default countUsersSchema
