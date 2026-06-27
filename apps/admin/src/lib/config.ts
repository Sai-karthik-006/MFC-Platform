export const env = {
  NODE_ENV: (process.env.NEXT_PUBLIC_NODE_ENV || 'development') as 'development' | 'production' | 'test',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
} as const;

export type Env = typeof env;