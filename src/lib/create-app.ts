import { OpenAPIHono } from "@hono/zod-openapi";
import { logger as hLogger } from "hono/logger";

import logger from "@/lib/logger";
import notFound from "@/middlewares/not-found";
import onError from "@/middlewares/on-error";

export default function createApp(): OpenAPIHono {
  const app = new OpenAPIHono({ strict: false });

  app.use(hLogger((message: string, ...rest: string[]) => {
  // eslint-disable-next-line no-control-regex
    logger.info(message.replace(/\x1B\[[0-9;]*[mK]/g, ""), ...rest);
  }));

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
