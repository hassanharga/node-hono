import { defineConfig } from 'drizzle-kit';

import { config } from '@/config';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  //   driver: 'turso',
  dbCredentials: {
    url: config.DATABASE_URL,
    token: config.DATABASE_AUTH_TOKEN,
  },
});
