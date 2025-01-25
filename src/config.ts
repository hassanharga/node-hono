import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(dotenv.config());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
});

// eslint-disable-next-line node/no-process-env
const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("Invalid environment variables:", env.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = env.data;

export type Env = z.infer<typeof envSchema>;
