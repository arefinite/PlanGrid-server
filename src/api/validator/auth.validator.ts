import { z } from 'zod'

export const signUpValidationSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'Full name must be at least 3 characters long' })
    .max(50, { message: 'Full name can not be more than 50 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(50, { message: 'Password can not be more than 50 characters long' }),
})

export const signInValidationSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(50, { message: 'Password can not be more than 50 characters long' }),
})
