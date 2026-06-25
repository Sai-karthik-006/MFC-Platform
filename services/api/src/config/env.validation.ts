import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().optional().transform((val) => parseInt(val || '3000', 10)),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  ADMIN_SECRET: z.string().min(1),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    throw new Error(`Config validation error: ${parsed.error.message}`);
  }
  return parsed.data;
}