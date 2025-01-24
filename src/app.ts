import { OpenAPIHono } from "@hono/zod-openapi";
import { logger as hLogger } from "hono/logger";

import logger from "@/lib/logger";

import notFound from "./middlewares/not-found";
import onError from "./middlewares/on-error";

const app = new OpenAPIHono();

app.use(hLogger((message: string, ...rest: string[]) => {
  // eslint-disable-next-line no-control-regex
  logger.info(message.replace(/\x1B\[[0-9;]*[mK]/g, ""), ...rest);
}));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/error", (c) => {
  c.status(422);
  throw new Error("This is an error");
});

app.notFound(notFound);

app.onError(onError);

export default app;
