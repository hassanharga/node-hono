import { apiReference } from '@scalar/hono-api-reference';

import type { App } from '@/types/types';

import { config } from '@/config';

import packageJSON from '../../package.json';

export default function configureOpenApi(app: App) {
  // open api doc
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: packageJSON.version,
      description: 'My API description',
    },
  });

  // scalar route that consumes api doc
  app.get(
    '/reference',
    apiReference({
      theme: 'kepler',
      layout: 'classic',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
      spec: {
        url: '/doc',
      },
      servers: [{ url: config.API_BASE_URL }],
    }),
  );
}
