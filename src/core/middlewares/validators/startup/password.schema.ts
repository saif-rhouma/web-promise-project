import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password is required' }),
    newPassword: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: 'Password must contain uppercase, lowercase and number.' }),
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
