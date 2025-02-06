import { OpenAPIHono } from '@hono/zod-openapi';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { logger as hLogger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';

import type { App, AppBinding } from '@/types/types';

import { UNPROCESSABLE_ENTITY } from '@/constants/http-status-codes';
import logger from '@/lib/logger';
import notFound from '@/middlewares/not-found';
import onError from '@/middlewares/on-error';

export function createAppRouter() {
  return new OpenAPIHono<AppBinding>({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        logger.error('validation error', { errors: result.error.flatten().fieldErrors, requestId: c.var.requestId, url: c.req.path });
        return c.json(
          {
            success: result.success,
            errors: result.error.flatten().fieldErrors,
          },
          UNPROCESSABLE_ENTITY,
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
      logger.info(message.replace(/\x1B\[[0-9;]*[mK]/g, ''), ...rest);
    }),
  );

  app.use(cors());
  app.use('*', requestId());
  app.use(compress());
  app.use(prettyJSON());
  app.use(secureHeaders());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
