import { z } from "zod";
import { USER_ROLES } from "../../../constants/constants";

export const loginValidator = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

export const signupValidator = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must be at most 50 characters long' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' }),

  email: z
    .string()
    .email({ message: 'Invalid email address' }),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),

  role: z.enum(Object.values(USER_ROLES) as any).refine(value => Object.values(USER_ROLES).includes(value as any), {
    message: 'Invalid role',
  })
});

export const emailValidator = z.object({
  email: loginValidator.shape.email,
});

export const refreshTokenValidator = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});