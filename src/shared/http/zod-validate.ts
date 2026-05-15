import type { Lifecycle, Request } from '@hapi/hapi';
import { AppError } from '../errors/app-error.js';
import type { ZodSchema } from 'zod';

export function zodPayload<T>(schema: ZodSchema<T>): Lifecycle.Method {
  return (request: Request, h) => {
    const parsed = schema.safeParse(request.payload);
    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Invalid request payload', 400);
    }
    (request as { payload: unknown }).payload = parsed.data;
    return h.continue;
  };
}

export function zodQuery<T>(schema: ZodSchema<T>): Lifecycle.Method {
  return (request: Request, h) => {
    const parsed = schema.safeParse(request.query);
    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Invalid request query', 400);
    }
    (request as { query: Request['query'] }).query = parsed.data as Request['query'];
    return h.continue;
  };
}
