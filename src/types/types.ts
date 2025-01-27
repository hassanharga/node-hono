import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { RequestIdVariables } from 'hono/request-id';
import type { SecureHeadersVariables } from 'hono/secure-headers';
import type { z } from 'zod';

export interface AppBinding {
  Variables: RequestIdVariables & SecureHeadersVariables;
}

export type App = OpenAPIHono<AppBinding>;

export type AppRouteHandler<T extends RouteConfig> = RouteHandler<T, AppBinding>;

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
export type ZodSchema = z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;
