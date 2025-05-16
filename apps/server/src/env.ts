import { z } from 'zod';

const DEFAULT_SERVER_PORT = 3035;
const DEFAULT_SERVER_HOST = 'localhost';

const createPortSchema = ({ defaultPort }: { defaultPort: number }) =>
  z
    .string()
    .optional()
    .default(`${defaultPort}`)
    .transform((s) => parseInt(s, 10))
    .pipe(z.number().int().min(0).max(65535));

export const envSchema = z.object({
  SERVER_PORT: createPortSchema({ defaultPort: DEFAULT_SERVER_PORT }),
  SERVER_HOST: z.string().min(1).optional().default(DEFAULT_SERVER_HOST),

  SERVER_AUTH_SECRET: z.string().min(1),
  SERVER_POSTGRES_URL: z.string(),
  // Frontend URL, used to configure trusted origin (CORS)
  PUBLIC_WEB_URL: z.string().url(),
  // Used to do super user stuff like seeding data
  INTERNAL_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
