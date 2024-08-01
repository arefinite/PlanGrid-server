import { z } from "zod";

export const userValidationSchema = z.object({
  fullName: z.string().min(3, { message: 'Full name must be at least 3 characters long' }).max(50, { message: 'Full name can not be more than 50 characters long' }),
  oldPassword: z.string().min(6, { message: 'Password must be at least 6 characters long' }).max(50, { message: 'Password can not be more than 50 characters long' }),
  newPassword: z.string().min(6, { message: 'Password must be at least 6 characters long' }).max(50, { message: 'Password can not be more than 50 characters long' }),
})