import { z } from 'zod'

export const taskValidationSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(50, { message: 'Title can not be more than 50 characters long' }),
  description: z
    .string()
    .min(3, { message: 'Description must be at least 3 characters long' })
    .max(500, {
      message: 'Description can not be more than 500 characters long',
    }),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['todo', 'in-progress', 'done']),
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: 'Invalid ObjectId format',
  }),
})
