export type ErrorCode =
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_INVALID_TOKEN'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTEGRATION_FAILURE'
  | 'RETRYABLE_FAILURE'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string,
    readonly statusCode = 500,
    readonly isRetryable = false,
    readonly details?: Record<string, string | number | boolean>,
  ) {
    super(message);
  }
}

export const notFound = (entity: string): AppError => new AppError('NOT_FOUND', `${entity} not found`, 404);

