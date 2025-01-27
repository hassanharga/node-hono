import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

import { OK } from '@/constants/http-status-codes';
import { jsonContent } from '@/helpers/open-api.helper';

const tags = ['Tasks'];

const list = createRoute({
  path: '/tasks',
  method: 'get',
  tags,
  responses: {
    [OK]: jsonContent(z.array(z.object({
      name: z.string(),
      done: z.boolean(),
    })), 'List of tasks'),
  },
});

export { list };

export type ListRoute = typeof list;
