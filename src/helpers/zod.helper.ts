import { z } from 'zod';

export function createZodMessageSchema(message: string) {
  return z.object({ message: z.string() }).openapi({ example: { message } });
}
