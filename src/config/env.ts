import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  REFRESH_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(2_592_000),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:5173'),
  LOG_LEVEL: z.string().default('info'),
  RATE_LIMIT_PER_MINUTE: z.coerce.number().int().positive().default(120)
});

export type AppConfig = ReturnType<typeof loadConfig>;

export function loadConfig() {
  const parsed = envSchema.parse(process.env);
  return {
    env: parsed.NODE_ENV,
    server: { port: parsed.PORT, host: parsed.HOST },
    databaseUrl: parsed.DATABASE_URL,
    redisUrl: parsed.REDIS_URL,
    jwt: {
      accessSecret: parsed.JWT_ACCESS_SECRET,
      refreshSecret: parsed.JWT_REFRESH_SECRET,
      accessTtlSeconds: parsed.ACCESS_TOKEN_TTL_SECONDS,
      refreshTtlSeconds: parsed.REFRESH_TOKEN_TTL_SECONDS
    },
    security: {
      bcryptRounds: parsed.BCRYPT_ROUNDS,
      corsOrigins: parsed.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
      rateLimitPerMinute: parsed.RATE_LIMIT_PER_MINUTE
    },
    logging: { level: parsed.LOG_LEVEL }
  };
}

export const config = loadConfig();
