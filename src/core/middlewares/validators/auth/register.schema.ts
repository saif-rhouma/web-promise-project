import { z } from 'zod';

export const userRegisterSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: 'Password must contain uppercase, lowercase and number.' }),
  phoneNumber: z.string().optional().or(z.literal('')),
});

export type UserRegisterSchema = z.infer<typeof userRegisterSchema>;
