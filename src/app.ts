import configureOpenApi from '@/lib/configure-open-api';
import createApp from '@/lib/create-app';
import index from '@/routes/index.route';
import tasks from '@/routes/tasks';

const app = createApp();

configureOpenApi(app);

const routes = [index, tasks] as const;
routes.forEach((route) => {
  app.route('/', route);
});

const _routes = app.route('/', index).route('/tasks', tasks);
// export type AppRouterType = typeof _routes;

export type AppRouterType = typeof routes[number];

export default app;
