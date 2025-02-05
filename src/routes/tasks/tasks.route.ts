import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

import { NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from '@/constants/http-status-codes';
import { insertTasksSchema, patchTasksSchema, selectTasksSchema } from '@/db/schema';
import { jsonContent, jsonContentOneOf, jsonContentRequired } from '@/helpers/open-api.helper';
import { createErrorSchema, createZodMessageSchema, idParamsSchema } from '@/helpers/zod.helper';

const tags = ['Tasks'];

const list = createRoute({
  path: '/tasks',
  method: 'get',
  tags,
  responses: {
    [OK]: jsonContent(
      z.array(selectTasksSchema),
      'List of tasks',
    ),
  },
});

const create = createRoute({
  path: '/tasks',
  method: 'post',
  tags,
  request: {
    body: jsonContentRequired(
      insertTasksSchema,
      'create task',
    ),
  },
  responses: {
    [OK]: jsonContent(
      selectTasksSchema,
      'created task',
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTasksSchema),
      'Invalid task',
    ),
  },
});

const getOne = createRoute({
  path: '/tasks/{id}',
  method: 'get',
  tags,
  request: { params: idParamsSchema },
  responses: {
    [OK]: jsonContent(
      selectTasksSchema,
      'get task',
    ),
    [NOT_FOUND]: jsonContent(
      createZodMessageSchema('task not found'),
      'Task not found',
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(idParamsSchema),
      'Invalid id',
    ),
  },
});

const update = createRoute({
  path: '/tasks/{id}',
  method: 'patch',
  tags,
  request: {
    params: idParamsSchema,
    body: jsonContentRequired(
      patchTasksSchema,
      'update task',
    ),
  },
  responses: {
    [OK]: jsonContent(
      selectTasksSchema,
      'update task',
    ),
    [NOT_FOUND]: jsonContent(
      createZodMessageSchema('task not found'),
      'Task not found',
    ),
    [UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [createErrorSchema(insertTasksSchema), createErrorSchema(idParamsSchema)],
      'Invalid task',
    ),
  },
});

export { create, getOne, list, update };

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
