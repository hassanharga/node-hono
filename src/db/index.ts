import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import { config } from '@/config';

const client = createClient({
  url: config.DATABASE_URL,
  authToken: config.DATABASE_AUTH_TOKEN,
});

const db = drizzle({ client, logger: true });

export default db;
