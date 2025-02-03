import { z } from 'zod';

import type { ZodSchema } from '@/types/types';

export const idParamsSchema = z.object({
  id: z.coerce
    .number()
    .openapi({ param: { name: 'id', in: 'path' }, example: 1 }),
});

export function createZodMessageSchema(message: string) {
  return z.object({ message: z.string() }).openapi({ example: { message } });
}

export function createErrorSchema<T extends ZodSchema>(schema: T) {
  const { error } = schema.safeParse(schema._def.typeName === z.ZodFirstPartyTypeKind.ZodArray ? [] : {});

  return z.object({
    success: z.boolean().openapi({
      example: false,
    }),
    errors: z
      .object({ ...schema.shape })
      .openapi({
        example: error.flatten().fieldErrors,
      }),
  });
}
