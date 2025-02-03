import type { CreateRoute, GetOneRoute, ListRoute } from '@/routes/tasks/tasks.route';
import type { AppRouteHandler } from '@/types/types';

import { NOT_FOUND, OK } from '@/constants/http-status-codes';
import db from '@/db';
import { tasks } from '@/db/schema';
import logger from '@/lib/logger';

const list: AppRouteHandler<ListRoute> = async (c) => {
  logger.debug('GET List of tasks from DB', { requestId: c.var.requestId });
  const tasks = await db.query.tasks.findMany();

  return c.json(tasks);
};

// create task handler
const create: AppRouteHandler<CreateRoute> = async (c) => {
  logger.debug('POST Create task in DB', { requestId: c.var.requestId });

  const task = c.req.valid('json');
  const [createdTask] = await db.insert(tasks).values(task).returning();

  return c.json(createdTask, OK);
};

// get one task handler
const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  logger.debug('GEt Get task from DB', { requestId: c.var.requestId });

  const { id } = c.req.valid('param');
  const task = await db.query.tasks.findFirst({
    where: (fields, operators) => operators.eq(fields.id, id),
  });

  if (!task) {
    return c.json({ message: 'not found' }, NOT_FOUND);
  }

  return c.json(task, OK);
};

export { create, getOne, list };
