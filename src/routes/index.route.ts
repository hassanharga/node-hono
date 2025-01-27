import { OK } from '@/constants/http-status-codes';
import { jsonContent } from '@/helpers/open-api.helper';
import { createZodMessageSchema } from '@/helpers/zod.helper';
import { createAppRouter } from '@/lib/create-app';

const router = createAppRouter().openapi(
  {
    method: 'get',
    path: '/',
    tags: ['index'],
    responses: {
      [OK]: jsonContent(createZodMessageSchema('index api message'), 'index api'),
    },
  },
  (c) => {
    return c.json({ message: c.var.requestId }, OK);
  },
);

export default router;
