import * as handlers from '@/handlers/tasks.handler';
import { createAppRouter } from '@/lib/create-app';

import * as routes from './tasks.route';

const router = createAppRouter().openapi(routes.list, handlers.list);

export default router;
