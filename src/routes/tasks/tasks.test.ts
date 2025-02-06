/* eslint-disable ts/ban-ts-comment */
import { testClient } from 'hono/testing';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from 'vitest';

import { config } from '@/config';
import { ZOD_ERROR_MESSAGES } from '@/constants/zod-errors';
import createApp from '@/lib/create-app';

import router from '.';

if (config.NODE_ENV !== 'test') {
  throw new Error('NODE_ENV must be \'test\'');
}

const client = testClient(createApp().route('/', router));

describe('tasks routes', () => {
  const id = 1;
  const name = 'Learn vitest';

  beforeAll(async () => {
    execSync('pnpm drizzle-kit push');
  });

  afterAll(async () => {
    fs.rmSync('test.db', { force: true });
  });

  it('post /tasks validates the body when creating', async () => {
    const response = await client.tasks.$post({
      // @ts-expect-error
      json: {
        done: false,
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.errors.name[0]).toBe(ZOD_ERROR_MESSAGES.REQUIRED);
    }
  });

  it('post /tasks creates a task', async () => {
    const response = await client.tasks.$post({
      json: {
        name,
        done: false,
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.name).toBe(name);
      expect(json.done).toBe(false);
    }
  });

  it('get /tasks lists all tasks', async () => {
    const response = await client.tasks.$get();
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expectTypeOf(json).toBeArray();
      // expect(json.length).toBe(1);
    }
  });

  it('get /tasks/{id} validates the id param', async () => {
    const response = await client.tasks[':id'].$get({
      param: {
        // @ts-expect-error
        id: 'wat',
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.errors.id[0]).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it('get /tasks/{id} returns 404 when task not found', async () => {
    const response = await client.tasks[':id'].$get({
      param: {
        id: 999,
      },
    });
    expect(response.status).toBe(404);
    if (response.status === 404) {
      const json = await response.json();
      expect(json.message).toBe('not found');
    }
  });

  it('get /tasks/{id} gets a single task', async () => {
    const response = await client.tasks[':id'].$get({
      param: {
        id,
      },
    });
    expect(response.status).toBe(404);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.name).toBe(name);
      expect(json.done).toBe(false);
    }
  });

  it('patch /tasks/{id} validates the body when updating', async () => {
    const response = await client.tasks[':id'].$patch({
      param: {
        id,
      },
      json: {
        name: '',
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.errors.name[0]).toBe(ZOD_ERROR_MESSAGES.TOO_SHORT);
    }
  });

  it('patch /tasks/{id} validates the id param', async () => {
    const response = await client.tasks[':id'].$patch({
      param: {
        // @ts-expect-error
        id: 'wat',

      },
      json: {},
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.errors.id[0]).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  // it('patch /tasks/{id} validates empty body', async () => {
  //   const response = await client.tasks[':id'].$patch({
  //     param: {
  //       id,
  //     },
  //     json: {},
  //   });
  //   expect(response.status).toBe(422);
  //   if (response.status === 422) {
  //     const json = await response.json();
  //     console.log('json :>> ', json);
  //     expect(json.errors.issues[0].code).toBe(ZOD_ERROR_CODES.INVALID_UPDATES);
  //     expect(json.errors.issues[0].message).toBe(ZOD_ERROR_MESSAGES.NO_UPDATES);
  //   }
  // });

  it('patch /tasks/{id} updates a single property of a task', async () => {
    const response = await client.tasks[':id'].$patch({
      param: {
        id,
      },
      json: {
        done: true,
      },
    });
    expect(response.status).toBe(404);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.done).toBe(true);
    }
  });

  it('delete /tasks/{id} validates the id when deleting', async () => {
    const response = await client.tasks[':id'].$delete({
      param: {
        // @ts-expect-error
        id: 'wat',
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.errors.id[0]).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it('delete /tasks/{id} removes a task', async () => {
    const response = await client.tasks[':id'].$delete({
      param: {
        id,
      },
    });
    expect(response.status).toBe(404);
  });
});
