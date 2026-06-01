import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(5000),
  location: z.string().max(255),
  category: z.string().max(50).optional(),
  type: z.enum(['full-time', 'part-time', 'contract', 'freelance']).optional(),
  experience: z.string().optional(),
  qualification: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'not-applicable']).optional(),
  period: z.string().optional(), // e.g., "3 months", "6 months"
  remoteWork: z.enum(['on-site', 'hybrid', 'remote']).optional(),
  // Rich content - JSON fields
  roles: z.string().nullable(), // JSON string for roles array/objects
  offers: z.string().nullable(), // JSON string for offers
  knowledge: z.string().nullable(), // JSON string for knowledge requirements
  softSkills: z.string().nullable(), // JSON string for soft skills
  tools: z.string().nullable(), // JSON string for required tools
  preferredExperience: z.string().nullable(), // JSON string
  languages: z.array(z.string()).optional(), // Array of language strings
  cover: z.string().url().or(z.literal('')).optional(), // Cover image URL
  pdfFile: z.string().url().or(z.literal('')).optional(), // PDF file URL
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

// For updates, we allow partial updates
export const updateJobSchema = createJobSchema.partial();

// Type definitions
export type CreateJobSchema = z.infer<typeof createJobSchema>;
export type UpdateJobSchema = z.infer<typeof updateJobSchema>;
