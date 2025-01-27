import type { ListRoute } from '@/routes/tasks/tasks.route';
import type { AppRouteHandler } from '@/types/types';

import logger from '@/lib/logger';

const list: AppRouteHandler<ListRoute> = (c) => {
  logger.debug('List tasks', { requestId: c.var.requestId });
  return c.json([
    { name: 'task1', done: false },
    { name: 'task2', done: true },
  ]);
};

export { list };
