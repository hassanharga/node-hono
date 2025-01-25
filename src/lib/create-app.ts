import { OpenAPIHono } from "@hono/zod-openapi";
import { logger as hLogger } from "hono/logger";

import type { App } from "@/types/types";

import { UNPROCESSABLE_ENTITY } from "@/constants/http-status-codes";
import logger from "@/lib/logger";
import notFound from "@/middlewares/not-found";
import onError from "@/middlewares/on-error";

export function createAppRouter() {
  return new OpenAPIHono({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            success: result.success,
            errors: result.error,
          },
          UNPROCESSABLE_ENTITY
        );
      }
    },
  });
}

export default function createApp(): App {
  const app = createAppRouter();

  app.use(
    hLogger((message: string, ...rest: string[]) => {
      // eslint-disable-next-line no-control-regex
      logger.info(message.replace(/\x1B\[[0-9;]*[mK]/g, ""), ...rest);
    })
  );

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
