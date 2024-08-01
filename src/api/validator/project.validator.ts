import { z } from 'zod'

export const projectValidationSchema = z.object({
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
  deadline: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.boolean(),
  budget: z.number().int().positive(),
  tags: z.array(z.string()),
  difficulty: z.number().int().min(1).max(5),
})
