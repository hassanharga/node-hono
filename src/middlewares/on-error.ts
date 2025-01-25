import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode, StatusCode } from "hono/utils/http-status";

import { config } from "@/config";
import logger from "@/lib/logger";

import { INTERNAL_SERVER_ERROR, OK } from "../constants/http-status-codes";

const onError: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err
    ? err.status
    : c.newResponse(null).status;
  const statusCode = currentStatus !== OK
    ? (currentStatus as StatusCode)
    : INTERNAL_SERVER_ERROR;

  const env = c.env?.NODE_ENV || config?.NODE_ENV;

  logger.error(err);

  return c.json(
    {
      message: err.message,
      stack: env === "production"
        ? undefined
        : err.stack,
    },
    statusCode as unknown as ContentfulStatusCode,
  );
};

export default onError;
