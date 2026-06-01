import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z.string().min(2).max(50),

  // Optional fields matching the model
  email: z.string().email().optional(),
  description: z.string().max(1000).optional(),
  sector: z.string().max(50).or(z.literal('')).optional(),
  website: z.string().url().or(z.literal('')).optional(),
  phone: z.string().max(20).or(z.literal('')).optional(),
  address: z.string().max(255).or(z.literal('')).optional(),

  // Social links as JSON string (matches model json type)
  socialLinks: z
    .object({
      facebook: z.string().url().or(z.literal('')).optional(),
      linkedin: z.string().url().or(z.literal('')).optional(),
      youtube: z.string().url().or(z.literal('')).optional(),
    })
    .passthrough()
    .optional(),

  avatar: z.string().url().or(z.literal('')).optional(),
  cover: z.string().url().or(z.literal('')).optional(),
});

// For updates, allow partial updates
export const updateProfileSchema = userProfileSchema.partial();

export type UserProfileSchema = z.infer<typeof userProfileSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
