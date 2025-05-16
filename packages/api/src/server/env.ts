import { z } from 'zod';

export const envSchema = z.object({
  INTERNAL_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
