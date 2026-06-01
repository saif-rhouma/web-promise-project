import { z } from 'zod';

export const sendMessageSchema = z.object({
  recipientId: z.string().uuid({ message: 'Invalid user ID' }),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

export type SendMessageSchema = z.infer<typeof sendMessageSchema>;
