import { z } from 'zod';

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;
