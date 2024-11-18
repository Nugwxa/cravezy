import { z } from 'zod'

export const paginationSchema = z.object({
  page: z
    .number({
      required_error: 'No page provided',
      invalid_type_error: 'Invalid page',
    })
    .min(1, 'Invalid page')
    .default(1),
  perPage: z
    .number({
      required_error: 'No per page value provided',
      invalid_type_error: 'Invalid per page value',
    })
    .min(1, 'Must have at least 1 item on a page')
    .max(100, 'Cant have more than 100 items on a page')
    .default(10),
})
