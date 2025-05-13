import { z } from 'zod';

export const CLIENT_ENV_PREFIX = 'PUBLIC_';

export const envSchema = z.object({
  /**
   * This is the backend API server. Note that this should be passed as
   * a build-time variable (ARG) in docker.
   */
  PUBLIC_SERVER_URL: z.string().url(),

  /**
   * Set this if you want to run or deploy your app at a base URL. This is
   * usually required for deploying a repository to Github/Gitlab pages.
   */
  PUBLIC_BASE_PATH: z
    .string()
    .optional()
    .default('/')
    .refine((val) => val.startsWith('/'), {
      message: "PUBLIC_BASE_PATH must start with '/'",
    }),
});

export const env = envSchema.parse(import.meta.env);
