import { serve } from '@hono/node-server';

import logger from '@/lib/logger';

import app from './app';
import { config } from './config';

const port = config.PORT;

logger.info(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
