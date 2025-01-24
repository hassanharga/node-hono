import { serve } from "@hono/node-server";

import logger from "@/lib/logger";

import app from "./app";

const port = 3000;

logger.info(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
