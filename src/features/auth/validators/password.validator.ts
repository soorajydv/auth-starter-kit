import { z } from "zod";

const resetPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(100, 'Password must be no longer than 100 characters'),

    confirmNewPassword: z
        .string()
        .min(8, 'Confirm password must be at least 8 characters long')
        .max(100, 'Confirm password must be no longer than 100 characters'),

    token: z
        .string()
        .length(64, 'Invalid token format') // Assuming a 64-character SHA256 token
});

// Add password match refinement
export const resetPasswordValidator = resetPasswordSchema.refine(
    (data) => data.newPassword === data.confirmNewPassword,
    {
        message: "Passwords do not match",
        path: ['confirmNewPassword'],
    }
);