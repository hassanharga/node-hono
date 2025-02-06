/* eslint-disable node/no-process-env */
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import path from 'node:path';
import { z } from 'zod';

console.log('NODE_ENV:', process.env.NODE_ENV);
expand(dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
  ),
}));

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']),
  API_BASE_URL: z.string(),
  DATABASE_URL: z.string().url(),
  DATABASE_AUTH_TOKEN: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.NODE_ENV === 'production' && !data.DATABASE_AUTH_TOKEN) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_type,
      expected: 'string',
      received: 'undefined',
      path: ['DATABASE_AUTH_TOKEN'],
      message: 'Must be set when NODE_ENV is \'production\'',
    });
  }
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('Invalid environment variables:', env.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = env.data;

export type Env = z.infer<typeof envSchema>;
