import { z } from 'zod';
import type { Config } from 'drizzle-kit';

const envSchema = z.object({
  DB_POSTGRES_URL: z.string().min(1),
});

const env = envSchema.parse(process.env);

export default {
  schema: './src/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url: env.DB_POSTGRES_URL },
  casing: 'snake_case',
} satisfies Config;
